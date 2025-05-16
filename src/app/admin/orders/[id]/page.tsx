"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Navigation } from "@/components/Navigation";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    image: string;
  };
}

interface Order {
  id: string;
  status: "PENDING" | "CONFIRMED" | "DELIVERED";
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  items: OrderItem[];
  files: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session) {
      fetchOrder();
    }
  }, [status, session]);

  async function fetchOrder() {
    try {
      const response = await fetch(`/api/admin/orders/${params.id}`);
      if (!response.ok) throw new Error("Erro ao buscar pedido");
      const data = await response.json();
      setOrder(data.order);
    } catch (error) {
      toast.error("Erro ao carregar pedido");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdateStatus(newStatus: string) {
    try {
      const response = await fetch(`/api/admin/orders/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar status");

      toast.success("Status atualizado com sucesso");
      fetchOrder();
    } catch (error) {
      toast.error("Erro ao atualizar status");
    }
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/admin/orders/${params.id}/files`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erro ao fazer upload do arquivo");

      toast.success("Arquivo anexado com sucesso");
      fetchOrder();
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      toast.error("Erro ao anexar arquivo");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDeleteFile(fileId: string) {
    try {
      const response = await fetch(`/api/admin/orders/${params.id}/files/${fileId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao remover arquivo");

      toast.success("Arquivo removido com sucesso");
      fetchOrder();
    } catch (error) {
      console.error("Erro ao remover arquivo:", error);
      toast.error("Erro ao remover arquivo");
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Pedido não encontrado</h2>
            <button
              onClick={() => router.push("/admin/orders")}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Voltar para Pedidos
            </button>
          </div>
        </main>
      </div>
    );
  }

  const total = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Pedido #{order.id}
              </h1>
              <p className="text-gray-600 mt-1">
                Data: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={order.status}
                onChange={(e) => handleUpdateStatus(e.target.value)}
                className="block pl-3 pr-10 py-2 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50"
              >
                <option value="PENDING">Pendente</option>
                <option value="CONFIRMED">Confirmado</option>
                <option value="DELIVERED">Entregue</option>
              </select>
              <button
                onClick={() => router.push("/admin/orders")}
                className="text-gray-600 hover:text-gray-800"
              >
                Voltar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Informações do Cliente</h2>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-800">
                  <span className="font-medium">Nome:</span> {order.user.name}
                </p>
                <p className="text-gray-800 mt-2">
                  <span className="font-medium">Email:</span> {order.user.email}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Frete</span>
                  <span className="font-medium">Grátis</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold">R$ {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Itens do Pedido</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-gray-50 rounded-xl p-4"
                >
                  <div className="flex items-center">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-800">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.quantity}x - R$ {item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-800">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Documentos</h2>
              <div className="relative">
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <label
                  htmlFor="file-upload"
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                    isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Anexar Arquivo
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="space-y-2">
              {order.files && order.files.length > 0 ? (
                order.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between bg-gray-50 rounded-xl p-4"
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-800">{file.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Download
                      </a>
                      <button
                        onClick={() => handleDeleteFile(file.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">Nenhum arquivo anexado</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Navigation } from "@/components/Navigation";

interface Order {
  id: string;
  userId: string;
  user: {
    name: string;
    email: string;
  };
  status: string;
  total: number;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
    };
  }>;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "categories" | "admins">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    } else if (activeTab === "products") {
      fetchProducts();
    } else if (activeTab === "admins") {
      fetchAdmins();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders");
      if (!response.ok) throw new Error("Erro ao carregar pedidos");
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      toast.error("Erro ao carregar pedidos");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products");
      if (!response.ok) throw new Error("Erro ao carregar produtos");
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      toast.error("Erro ao carregar produtos");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (!response.ok) throw new Error("Erro ao buscar administradores");
      const data = await response.json();
      setAdmins(data.users);
    } catch (error) {
      toast.error("Erro ao carregar administradores");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAdmin = async (email: string) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Erro ao adicionar administrador");

      toast.success("Administrador adicionado com sucesso");
      fetchAdmins();
    } catch (error) {
      toast.error("Erro ao adicionar administrador");
    }
  };

  const handleRemoveAdmin = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao remover administrador");

      toast.success("Administrador removido com sucesso");
      fetchAdmins();
    } catch (error) {
      toast.error("Erro ao remover administrador");
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar status");

      toast.success("Status atualizado com sucesso");
      fetchOrders();
    } catch (error) {
      toast.error("Erro ao atualizar status");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
        >
          <div className="flex flex-col gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Painel Administrativo</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Gerencie pedidos, produtos e categorias</p>
            </div>
            
            {/* Responsive Navigation Tabs */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <div className="flex overflow-x-auto sm:overflow-visible scrollbar-hide bg-gray-100 p-1 rounded-xl">
                <div className="flex space-x-2 sm:space-x-4 min-w-full sm:min-w-0">
                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                      activeTab === "orders"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Pedidos
                  </button>
                  <button
                    onClick={() => setActiveTab("products")}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                      activeTab === "products"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Produtos
                  </button>
                  <button
                    onClick={() => setActiveTab("categories")}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                      activeTab === "categories"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Categorias
                  </button>
                  <button
                    onClick={() => setActiveTab("admins")}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                      activeTab === "admins"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Administradores
                  </button>
                </div>
              </div>
              
              {/* Action Buttons */}
              {activeTab === "products" && (
                <button
                  onClick={() => router.push("/admin/products/new")}
                  className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Novo Produto
                </button>
              )}

              {activeTab === "categories" && (
                <button
                  onClick={() => router.push("/admin/categories")}
                  className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Gerenciar Categorias
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : activeTab === "orders" ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col gap-4">
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <h3 className="text-lg font-semibold text-gray-900">Pedido #{order.id}</h3>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          order.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "CONFIRMED"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {order.status === "PENDING"
                            ? "Pendente"
                            : order.status === "CONFIRMED"
                            ? "Confirmado"
                            : "Entregue"}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Cliente</p>
                          <p className="font-medium text-gray-900">{order.user.name}</p>
                          <p className="text-sm text-gray-500">{order.user.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Data</p>
                          <p className="font-medium text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="w-full sm:w-48 pl-3 pr-10 py-2 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50"
                      >
                        <option value="PENDING">Pendente</option>
                        <option value="CONFIRMED">Confirmado</option>
                        <option value="DELIVERED">Entregue</option>
                      </select>
                      <button
                        onClick={() => router.push(`/admin/orders/${order.id}`)}
                        className="w-full sm:w-auto px-4 py-2 text-green-600 hover:text-green-800 font-medium text-center sm:text-left"
                      >
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : activeTab === "products" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
                    <p className="text-gray-600 mt-1">R$ {product.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 mt-1">Estoque: {product.stock}</p>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => router.push(`/admin/products/${product.id}`)}
                        className="text-green-600 hover:text-green-700 font-medium"
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : activeTab === "admins" ? (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Adicionar Novo Administrador</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
                    handleAddAdmin(email);
                    form.reset();
                  }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <input
                    type="email"
                    name="email"
                    placeholder="Email do novo administrador"
                    required
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                  >
                    Adicionar
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Administradores Cadastrados</h3>
                <div className="space-y-4">
                  {admins.map((admin) => (
                    <div
                      key={admin.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-4"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{admin.name}</p>
                        <p className="text-sm text-gray-500">{admin.email}</p>
                      </div>
                      {admin.id !== session?.user?.id && (
                        <button
                          onClick={() => handleRemoveAdmin(admin.id)}
                          className="w-full sm:w-auto px-3 py-1 text-sm text-red-600 hover:text-red-800 font-medium text-center sm:text-left"
                        >
                          Remover
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-gray-600 mb-4 text-center px-4">Clique no botão abaixo para gerenciar categorias</p>
              <button
                onClick={() => router.push("/admin/categories")}
                className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Gerenciar Categorias
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 
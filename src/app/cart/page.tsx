"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Navigation } from "@/components/Navigation";
import { Trash2, ShoppingBag, ArrowLeft } from "lucide-react";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
}

export default function CartPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session) {
      fetchCart();
    }
  }, [session]);

  async function fetchCart() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/cart");
      if (!response.ok) throw new Error("Erro ao buscar carrinho");
      const data = await response.json();
      setCart(data.cart?.items || []);
    } catch (error) {
      console.error("Erro ao buscar carrinho:", error);
      toast.error("Erro ao carregar carrinho");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRemoveItem(itemId: string) {
    try {
      setIsLoading(true);
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      });

      if (!response.ok) throw new Error("Erro ao remover item");

      toast.success("Item removido do carrinho");
      await fetchCart();
    } catch (error) {
      console.error("Erro ao remover item:", error);
      toast.error("Erro ao remover item do carrinho");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCheckout() {
    if (!session) {
      router.push("/login");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar pedido");
      }

      const data = await response.json();
      const order = data;

      // Criar mensagem para o WhatsApp
      const message = `Olá! Meu nome é ${session.user.name} e gostaria de fazer um pedido.\n\nPedido #${order.id}\n\nItens:\n${cart.map(item => 
        `${item.product.name} - ${item.quantity}x - R$ ${(item.product.price * item.quantity).toFixed(2)}`
      ).join('\n')}\n\nTotal: R$ ${total.toFixed(2)}`;

      // Redirecionar para o WhatsApp com o número específico
      const whatsappUrl = `https://wa.me/5516992025527?text=${encodeURIComponent(message)}`;
      
      // Primeiro mostra a mensagem de sucesso
      toast.success("Pedido criado com sucesso! Você será redirecionado para o WhatsApp.");
      
      // Depois redireciona para o WhatsApp
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        
        // Por último redireciona para a página de pedidos
        setTimeout(() => {
          router.push("/orders");
        }, 1000);
      }, 1000);

    } catch (error: any) {
      console.error("Erro ao finalizar compra:", error);
      toast.error(error.message || "Erro ao finalizar compra");
    } finally {
      setIsLoading(false);
    }
  }

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Você precisa estar logado para ver seu carrinho
            </h2>
            <button
              onClick={() => router.push("/login")}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Fazer Login
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push("/products")}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold">Seu Carrinho</h1>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-xl mb-4">Seu carrinho está vazio</p>
            <button
              onClick={() => router.push("/products")}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Ver Produtos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg p-6 transition-all hover:shadow-xl"
                >
                  <div className="flex items-center gap-6">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        Quantidade: {item.quantity}
                      </p>
                      <p className="text-green-600 font-semibold mt-2">
                        R$ {(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-800 transition-colors p-2 hover:bg-red-50 rounded-lg"
                      disabled={isLoading}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Resumo do Pedido</h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Frete</span>
                    <span className="text-green-600">Grátis</span>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-green-600">R$ {total.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 font-semibold text-lg mt-6"
                  >
                    {isLoading ? "Finalizando..." : "Finalizar Compra"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 
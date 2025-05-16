import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export const dynamic = 'force-dynamic';

interface OrderWithRelations {
  id: string;
  userId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string;
    email: string;
  };
  items: Array<{
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
    product: {
      name: string;
      price: number;
    };
  }>;
}

interface OrderWithTotal extends OrderWithRelations {
  total: number;
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    // Verificar se o usuário é admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Acesso não autorizado" },
        { status: 403 }
      );
    }

    // Obter parâmetros de busca da URL
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          {
            id: {
              contains: search,
            },
          },
          {
            user: {
              name: {
                contains: search,
              },
            },
          },
        ],
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calcular o total para cada pedido
    const ordersWithTotal: OrderWithTotal[] = orders.map((order: OrderWithRelations) => {
      const total = order.items.reduce((sum: number, item) => {
        return sum + item.quantity * item.product.price;
      }, 0);

      return {
        ...order,
        total,
      };
    });

    return NextResponse.json({ orders: ordersWithTotal }, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return NextResponse.json(
      { message: "Erro ao buscar pedidos" },
      { status: 500 }
    );
  }
} 
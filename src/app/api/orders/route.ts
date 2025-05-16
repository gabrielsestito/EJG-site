import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const { items } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "Itens do pedido são obrigatórios" },
        { status: 400 }
      );
    }

    // Calcular o total do pedido
    const total = items.reduce((sum: number, item: { price: number; quantity: number }) => 
      sum + item.price * item.quantity, 0);

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total,
        items: {
          create: items.map((item: { productId: string; quantity: number; price: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Clear cart
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: { items: true },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    // Send WhatsApp message to admin
    const adminPhone = process.env.ADMIN_PHONE;
    if (adminPhone) {
      const message = `Novo pedido recebido!\n\nCliente: ${session.user.name}\n\nItens:\n${order.items
        .map(
          (item) =>
            `${item.product.name} - ${item.quantity}x - R$ ${(
              item.price * item.quantity
            ).toFixed(2)}`
        )
        .join("\n")}\n\nTotal: R$ ${order.items
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2)}`;

      const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(
        message
      )}`;

      // In a real application, you would use a proper WhatsApp API
      console.log("WhatsApp message URL:", whatsappUrl);
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Order error:", error);
    return NextResponse.json(
      { message: "Erro ao criar pedido" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        files: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Order error:", error);
    return NextResponse.json(
      { message: "Erro ao buscar pedidos" },
      { status: 500 }
    );
  }
} 
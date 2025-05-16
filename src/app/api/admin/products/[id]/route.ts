import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const product = await prisma.product.findUnique({
      where: {
        id: params.id,
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, description, price, stock, image, categoryId } = body;

    if (!name || !description || !price || !stock || !image || !categoryId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const product = await prisma.product.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        image,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Primeiro, remover todas as referências ao produto no carrinho
    await prisma.cartItem.deleteMany({
      where: {
        productId: params.id,
      },
    });

    // Depois, remover todas as referências ao produto nos pedidos
    await prisma.orderItem.deleteMany({
      where: {
        productId: params.id,
      },
    });

    // Por fim, excluir o produto
    const product = await prisma.product.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error deleting product:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 
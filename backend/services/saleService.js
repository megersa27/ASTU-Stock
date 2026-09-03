import prisma from "../config/db.js";

export const createSale = async (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    const error = new Error("Sale must contain at least one item");
    error.statusCode = 400;
    throw error;
  }

  return await prisma.$transaction(async (tx) => {
    let totalAmount = 0;

    const saleItems = [];

    for (const item of items) {
      const productId = Number(item.productId);
      const quantity = Number(item.quantity);

      if (
        !Number.isInteger(productId) ||
        productId <= 0
      ) {
        const error = new Error("Invalid product ID");
        error.statusCode = 400;
        throw error;
      }

      if (
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        const error = new Error(
          "Quantity must be a positive integer"
        );
        error.statusCode = 400;
        throw error;
      }

      const product = await tx.product.findUnique({
        where: {
          id: productId,
        },
      });

      if (!product) {
        const error = new Error(
          `Product ${productId} not found`
        );
        error.statusCode = 404;
        throw error;
      }

      if (quantity > product.stock) {
        const error = new Error(
          `Insufficient stock for ${product.name}`
        );
        error.statusCode = 409;
        throw error;
      }

      const itemTotal = product.price * quantity;

      totalAmount += itemTotal;

      saleItems.push({
        productId: product.id,
        quantity,
        price: product.price,
      });

      await tx.product.update({
        where: {
          id: product.id,
        },
        data: {
          stock: {
            decrement: quantity,
          },
        },
      });
    }

    const sale = await tx.sale.create({
      data: {
        totalAmount,
        items: {
          create: saleItems,
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

    return sale;
  });
};

export const getSales = async () => {
  return await prisma.sale.findMany({
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getSaleById = async (id) => {
  const sale = await prisma.sale.findUnique({
    where: {
      id,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!sale) {
    const error = new Error("Sale not found");
    error.statusCode = 404;
    throw error;
  }

  return sale;
};
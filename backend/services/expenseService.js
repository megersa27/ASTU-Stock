import prisma from "../config/db.js";

export const createExpense = async ({
  title,
  amount,
  description,
  userId,
}) => {
  return await prisma.expense.create({
    data: {
      title,
      amount,
      description,
      userId,
    },
  });
};

export const getAllExpenses = async () => {
  return await prisma.expense.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getExpenseById = async (id) => {
  const expense = await prisma.expense.findUnique({
    where: { id },
  });

  if (!expense) {
    const error = new Error("Expense not found");
    error.statusCode = 404;
    throw error;
  }

  return expense;
};

export const updateExpense = async (
  id,
  { title, amount, description }
) => {
  await getExpenseById(id);

  return await prisma.expense.update({
    where: { id },
    data: {
      title,
      amount,
      description,
    },
  });
};

export const deleteExpense = async (id) => {
  const expense = await getExpenseById(id);

  await prisma.expense.delete({
    where: { id },
  });

  return expense;
};
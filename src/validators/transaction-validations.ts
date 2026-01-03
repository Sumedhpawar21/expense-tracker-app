import { z } from "zod";

export const createTransactionSchema = z.object({
  transaction_title: z.string().min(1, "Title is required"),
  transaction_description: z.string().optional(),
  transaction_type: z.enum(["INCOME", "EXPENSE"]),
  category_id: z.number().positive("Category ID must be a positive number"),
  transaction_amount: z.number().positive("Amount must be a positive number"),
});
export const editTransactionSchema = z.object({
  transaction_title: z.string().min(1, "Title is required"),
  transaction_description: z.string().optional(),
  transaction_type: z.enum(["INCOME", "EXPENSE"]),
  category_id: z.number().positive("Category ID must be a positive number"),
  transaction_amount: z.number().positive("Amount must be a positive number"),
});

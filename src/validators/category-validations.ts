import { z } from "zod";

export const addCategoryValidator = z.object({
  category_title: z.string().min(1, "Category title is required"),
  category_description: z.string().optional(),
  category_color: z.string().min(1, "Category color is required").optional(),
});
export const editCategoryValidator = z.object({
  category_title: z.string().min(1, "Category title is required"),
  category_description: z.string().optional(),
  category_color: z.string().min(1, "Category color is required").optional(),
});

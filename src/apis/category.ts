import { AxiosError } from "axios";
import { apiClient } from "../lib/axios";
const apiPrfix = "/category";

export async function getCategories(
  page: Number,
  limit: number,
  search: string
) {
  try {
    const data = await apiClient.get(
      `${apiPrfix}?page=${page}&limit=${limit}&search=${search}`
    );
    return data.data.data;
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }
  }
}
export async function getCategoryById(categoryId: string) {
  try {
    const data = await apiClient.get(`${apiPrfix}/${categoryId}`);
    return data.data.data;
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }
  }
}
export async function addCategory({
  category_title = "",
  category_description = "",
  category_color = "",
}: {
  category_title: string;
  category_description?: string;
  category_color?: string;
}) {
  try {
    const data = await apiClient.post(`${apiPrfix}/create`, {
      category_title,
      category_description,
      category_color,
    });
    return data.data.data;
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }
  }
}
export async function editCategory({
  category_title = "",
  category_description = "",
  category_color = "",
  category_id,
}: {
  category_title: string;
  category_description?: string;
  category_color?: string;
  category_id: string;
}) {
  try {
    const data = await apiClient.put(`${apiPrfix}/${category_id}`, {
      category_title,
      category_description,
      category_color,
    });
    return data.data.data;
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }
  }
}
export async function deleteCategory(categoryId: string) {
  try {
    const data = await apiClient.delete(`${apiPrfix}/${categoryId}`);
    return data.data.data;
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }
  }
}

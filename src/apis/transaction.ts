import { AxiosError } from "axios";
import { apiClient } from "../lib/axios";
const apiPrfix = "/transaction";

export async function getTransactions(
  page: Number,
  limit: number,
  search: string,
  transaction_type?: "INCOME" | "EXPENSE",
  category_id?: number
) {
  try {
    let url = `${apiPrfix}?page=${page}&limit=${limit}`;
    if (search) {
      url += `&search=${search}`;
    }
    if (transaction_type) {
      url += `&transaction_type=${transaction_type}`;
    }
    if (category_id) {
      url += `&category_id=${category_id}`;
    }
    const data = await apiClient.get(url);
    return data.data.data;
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      console.log(error);

      throw new Error(error.response?.data.message);
    }
  }
}
export async function getTransactionById(transactionId: string) {
  try {
    const data = await apiClient.get(`${apiPrfix}/${transactionId}`);
    return data.data.data;
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }
  }
}
export async function addTransaction({
  transaction_title,
  transaction_description,
  transaction_type,
  category_id,
  transaction_amount,
}: {
  transaction_title: string;
  transaction_description?: string;
  transaction_type: "INCOME" | "EXPENSE";
  category_id: number;
  transaction_amount: number;
}) {
  try {
    const data = await apiClient.post(`${apiPrfix}/create`, {
      transaction_title: transaction_title,
      transaction_description: transaction_description,
      transaction_type: transaction_type,
      category_id: category_id,
      transaction_amount: transaction_amount,
    });
    return data.data.data;
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }
  }
}
export async function editTransaction({
  transaction_title,
  transaction_description,
  transaction_type,
  category_id,
  transaction_amount,
  transaction_id,
}: {
  transaction_title: string;
  transaction_description?: string;
  transaction_type: "INCOME" | "EXPENSE";
  category_id: number;
  transaction_amount: number;
  transaction_id: number;
}) {
  try {
    const data = await apiClient.put(`${apiPrfix}/${transaction_id}`, {
      transaction_title,
      transaction_description,
      transaction_type,
      category_id,
      transaction_amount,
    });
    return data.data.data;
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }
  }
}
export async function deleteTransaction(transactionId: number) {
  try {
    const data = await apiClient.delete(`${apiPrfix}/${transactionId}`);
    return data.data.data;
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }
  }
}

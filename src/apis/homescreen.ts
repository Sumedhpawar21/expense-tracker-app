import { AxiosError } from "axios";
import { apiClient } from "../lib/axios";

const apiPrfix = "/home";

export async function getMonthlySummary() {
  try {
    const data = await apiClient.get(`${apiPrfix}/monthly-summary`);
    return data.data.data;
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      console.log(error);

      throw new Error(error.response?.data.message);
    }
  }
}
export async function getMonthlyBreakdown() {
  try {
    const data = await apiClient.get(`${apiPrfix}/monthly-expense-breakdown`);
    return data.data.data;
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      console.log(error);

      throw new Error(error.response?.data.message);
    }
  }
}
export async function getRecentTransactions() {
  try {
    const data = await apiClient.get(`${apiPrfix}/recent-transactions`);
    return data.data.data;
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      console.log(error);

      throw new Error(error.response?.data.message);
    }
  }
}

import { AxiosError } from "axios";
import { apiClient } from "../lib/axios";

const apiPrfix = "/auth";
export async function login({
  email_id,
  password,
}: {
  email_id: string;
  password: string;
}) {
  try {
    const data = await apiClient.post(`${apiPrfix}/login`, {
      email_id,
      password,
    });
    return data.data.data;
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }
  }
}
export async function register({
  full_name,
  email_id,
  password,
}: {
  full_name: string;
  email_id: string;
  password: string;
}) {
  try {
    const data = await apiClient.post(`${apiPrfix}/register`, {
      full_name,
      email_id,
      password,
    });
    return data.data.data;
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }
  }
}

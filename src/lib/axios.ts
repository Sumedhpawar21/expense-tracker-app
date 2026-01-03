import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const backend_url = process.env.BACKEND_URL || "http://192.168.0.102:8000/api";
export const apiClient = axios.create({
  baseURL: backend_url,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

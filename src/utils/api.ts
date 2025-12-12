import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig } from "axios";

export type ApiResponse<T> = T | { error: string };

const API_BASE_URL = import.meta.env.API_URL || "http://localhost:3000/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.data && typeof error.response.data === "object") {
      const data = error.response.data as { error?: string };
      if (data.error) {
        return Promise.reject(new Error(data.error));
      }
    }

    return Promise.reject(new Error(error.message || "A apărut o eroare neașteptată."));
  }
);

export async function apiRequest<T>(url: string, options?: AxiosRequestConfig): Promise<T> {
  const response = await api(url, options);
  return response.data as T;
}

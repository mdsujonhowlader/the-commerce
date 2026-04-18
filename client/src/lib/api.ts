import axios, { type AxiosRequestConfig } from "axios";

import { env } from "./env";
import type { ApiEnvelope } from "./types";

let tokenGetter: (() => Promise<string | null>) | null = null;

export function setApiTokenGetter(getter: () => Promise<string | null>) {
  tokenGetter = getter;
}

const api = axios.create({
  baseURL: env.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

api.interceptors.request.use(async (config) => {
  if (!tokenGetter) return config;
  const token = await tokenGetter();

  if (token) {
    //config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function getErrorMsg(error: unknown) {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.errors?.[0]?.message ||
      error.message ||
      "Something went Wrong"
    );
  }
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went Wrong";
}

export async function apiGet<T>(url: string, config?: AxiosRequestConfig) {
  try {
    const response = await api.get<ApiEnvelope<T>>(url, config);

    if (response.data.status === "error" || !response.data.data) {
      throw new Error(response.data.errors?.[0]?.message || "Request Failed");
    }
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMsg(error));
  }
}

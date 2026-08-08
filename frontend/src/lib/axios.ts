import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import { tokenStorage } from "./token";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ==========================================
   REQUEST INTERCEPTOR
========================================== */

api.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig
  ) => {

    const publicRoutes = [
      "/accounts/login/",
      "/accounts/register/",
      "/accounts/forgot-password/",
      "/accounts/reset-password/",
      "/accounts/refresh/",
    ];

    const isPublic =
      publicRoutes.some((route) =>
        config.url?.includes(route)
      );

    if (!isPublic) {

      const token =
        tokenStorage.getAccessToken();

      if (token) {
        config.headers.Authorization =
          `Bearer ${token}`;
      }

    }

    return config;
  }
);

/* ==========================================
   RESPONSE INTERCEPTOR
========================================== */

api.interceptors.response.use(

  (response) => response,

  async (error: AxiosError) => {

    const originalRequest =
      error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      const refresh =
        tokenStorage.getRefreshToken();

      if (!refresh) {

        tokenStorage.clearTokens();

        window.location.href = "/";

        return Promise.reject(error);

      }

      try {

        const response =
          await axios.post(

            `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/refresh/`,

            {
              refresh,
            }

          );

        const newAccess =
          response.data.access;

        tokenStorage.setTokens(
          newAccess,
          refresh
        );

        originalRequest.headers.Authorization =
          `Bearer ${newAccess}`;

        return api(originalRequest);

      } catch {

        tokenStorage.clearTokens();

        window.location.href = "/";

      }

    }

    return Promise.reject(error);

  }

);

export default api;
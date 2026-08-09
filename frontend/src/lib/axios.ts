import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import { tokenStorage } from "./token";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
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

    /* ==========================================
       AUTHORIZATION
    ========================================== */

    if (!isPublic) {

      const token =
        tokenStorage.getAccessToken();

      if (token) {
        config.headers.Authorization =
          `Bearer ${token}`;
      }
    }

    /* ==========================================
       CONTENT TYPE
    ========================================== */

    /*
      Let Axios/browser automatically set the
      Content-Type for FormData requests.

      This is important because the browser needs
      to add the multipart boundary.

      For normal JSON requests, explicitly use
      application/json.
    */

    if (config.data instanceof FormData) {

      delete config.headers["Content-Type"];

    } else {

      config.headers["Content-Type"] =
        "application/json";
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

    /* ==========================================
       ACCESS TOKEN EXPIRED
    ========================================== */

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      const refresh =
        tokenStorage.getRefreshToken();

      /* ==========================================
         NO REFRESH TOKEN
      ========================================== */

      if (!refresh) {

        tokenStorage.clearTokens();

        window.location.href = "/";

        return Promise.reject(error);
      }

      try {

        /* ==========================================
           REFRESH ACCESS TOKEN
        ========================================== */

        const response =
          await axios.post(

            `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/refresh/`,

            {
              refresh,
            },

            {
              headers: {
                "Content-Type":
                  "application/json",
              },
            }

          );

        const newAccess =
          response.data.access;

        tokenStorage.setTokens(
          newAccess,
          refresh
        );

        /* ==========================================
           RETRY ORIGINAL REQUEST
        ========================================== */

        originalRequest.headers.Authorization =
          `Bearer ${newAccess}`;

        /*
          If the original request was FormData,
          keep it as FormData and don't force
          application/json.
        */

        if (
          originalRequest.data instanceof FormData
        ) {

          delete originalRequest.headers[
            "Content-Type"
          ];

        } else {

          originalRequest.headers[
            "Content-Type"
          ] = "application/json";
        }

        return api(originalRequest);

      } catch {

        tokenStorage.clearTokens();

        window.location.href = "/";

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
import api from "@/lib/axios";

/* ===========================
   LOGIN
=========================== */

export interface LoginData {
  email: string;
  password: string;
}

export const login = async (
  data: LoginData
) => {
  const response = await api.post(
    "/accounts/login/",
    data
  );

  return response.data;
};

/* ===========================
   REGISTER
=========================== */

export interface RegisterData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  confirm_password: string;
}

export const register = async (
  data: RegisterData
) => {
  const response = await api.post(
    "/accounts/register/",
    data
  );

  return response.data;
};

/* ===========================
   FORGOT PASSWORD
=========================== */

export interface ForgotPasswordData {
  email: string;
}

export const forgotPassword = async (
  data: ForgotPasswordData
) => {
  const response = await api.post(
    "/accounts/forgot-password/",
    data
  );

  return response.data;
};

/* ===========================
   RESET PASSWORD
=========================== */

export interface ResetPasswordData {
  uid: string;
  token: string;
  password: string;
  confirm_password: string;
}

export const resetPassword = async (
  data: ResetPasswordData
) => {
  const response = await api.post(
    "/accounts/reset-password/",
    data
  );

  return response.data;
};

/* ===========================
   LOGOUT
=========================== */

export const logout = async () => {
  const refresh =
    localStorage.getItem("refresh");

  if (refresh) {
    try {
      await api.post(
        "/accounts/logout/",
        {
          refresh,
        }
      );
    } catch {
      // Ignore backend errors
    }
  }

  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("theme");
};
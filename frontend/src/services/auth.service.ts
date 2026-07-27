import api from "@/lib/axios";

export interface LoginResponse {
  access: string;
  refresh: string;
}

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const response = await api.post("/accounts/login/", {
    username,
    password,
  });

  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/accounts/profile/");
  return response.data;
};

export const logout = async (refresh: string) => {
  await api.post("/accounts/logout/", {
    refresh,
  });
};
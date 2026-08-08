import api from "@/lib/axios";

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export const changePassword = async (
  data: ChangePasswordData
): Promise<ChangePasswordResponse> => {
  const response =
    await api.post<ChangePasswordResponse>(
      "/accounts/change-password/",
      data
    );

  return response.data;
};
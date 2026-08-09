import api from "@/lib/axios";

import {
  UserProfile,
  UpdateProfileData,
} from "@/types/profile";

export const getProfile = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>(
    "/accounts/profile/"
  );

  return response.data;
};

export const updateProfile = async (
    data: UpdateProfileData
  ): Promise<UserProfile> => {
    const formData = new FormData();
  
    Object.entries(data).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null
      ) {
        return;
      }
  
      if (key === "profilePictureFile") {
        formData.append(
          "profile_picture",
          value as File
        );
  
        return;
      }
  
      if (key === "profile_picture") {
        return;
      }
  
      formData.append(
        key,
        String(value)
      );
    });
  
    const response =
      await api.patch<UserProfile>(
        "/accounts/profile/",
        formData
      );
  
    return response.data;
  };
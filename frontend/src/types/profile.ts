export interface UserProfile {
    username: string;
  
    first_name: string;
  
    last_name: string;
  
    email: string;
  
    profile_picture: string | null;
  
    profilePictureFile?: File;
  
    phone_number: string;
  
    date_of_birth: string | null;
  
    country: string;
  
    city: string;
  
    bio: string;
  
    preferred_currency: string;
  
    preferred_language: string;
  
    theme: "light" | "dark" | "system";
  
    is_verified: boolean;
  
    created_at: string;
  
    updated_at: string;
  }
  
  export interface UpdateProfileData
    extends Partial<UserProfile> {
    profilePictureFile?: File;
  }
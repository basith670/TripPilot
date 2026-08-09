import { z } from "zod";

export const registerSchema = z
  .object({
    first_name: z
      .string()
      .min(2, "First name is required."),

    last_name: z
      .string()
      .min(1, "Last name is required."),

    username: z
      .string()
      .min(3, "Username is required."),

    email: z
      .string()
      .email("Invalid email address."),

    password: z
      .string()
      .min(
        8,
        "Password must be at least 8 characters."
      ),

    confirm_password: z
      .string(),
  })
  .refine(
    (data) =>
      data.password ===
      data.confirm_password,
    {
      message:
        "Passwords do not match.",
      path: [
        "confirm_password",
      ],
    }
  );

export type RegisterFormData =
  z.infer<
    typeof registerSchema
  >;
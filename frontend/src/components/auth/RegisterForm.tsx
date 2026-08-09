"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import axios from "axios";

import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Loader2,
  } from "lucide-react";

import { toast } from "sonner";

import {
  register as registerUser,
} from "@/services/auth.service";

import {
  registerSchema,
  RegisterFormData,
} from "@/features/auth/registerSchema";

function getPasswordStrength(password: string) {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) {
    return {
      label: "Weak",
      textClass: "text-red-600",
      barClass: "bg-red-500",
      widthClass: "w-1/4",
    };
  }

  if (score <= 2) {
    return {
      label: "Fair",
      textClass: "text-amber-600",
      barClass: "bg-amber-500",
      widthClass: "w-2/4",
    };
  }

  if (score <= 3) {
    return {
      label: "Good",
      textClass: "text-blue-600",
      barClass: "bg-blue-500",
      widthClass: "w-3/4",
    };
  }

  return {
    label: "Strong",
    textClass: "text-green-600",
    barClass: "bg-green-500",
    widthClass: "w-full",
  };
}

export default function RegisterForm() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [serverError, setServerError] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password") || "";

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (
    data: RegisterFormData
  ) => {
    try {
      setLoading(true);
      setServerError("");
  
      await registerUser(data);
  
      toast.success(
        "Welcome to TripPilot! Your account has been created."
      );
  
      router.replace("/");
  
    } catch (error: unknown) {
  
      if (axios.isAxiosError(error)) {
  
        const data = error.response?.data;
  
        if (typeof data === "object" && data) {
  
          const firstError = Object.values(data)[0];
  
          if (Array.isArray(firstError)) {
            setServerError(firstError[0]);
          } else if (typeof firstError === "string") {
            setServerError(firstError);
          } else {
            setServerError("Registration failed.");
          }
  
        } else {
          setServerError("Registration failed.");
        }
  
      } else {
        setServerError("Registration failed.");
      }
  
    } finally {
  
      setLoading(false);
  
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >

      {/* First + Last */}

      <div className="grid gap-5 md:grid-cols-2">

        <Input
          label="First Name"
          placeholder="Isac"
          icon={<User size={18} />}
          register={register("first_name")}
          error={errors.first_name?.message}
        />

        <Input
          label="Last Name"
          placeholder="John"
          icon={<User size={18} />}
          register={register("last_name")}
          error={errors.last_name?.message}
        />

      </div>

      {/* Username */}

      <Input
        label="Username"
        placeholder="Isac"
        icon={<User size={18} />}
        register={register("username")}
        error={errors.username?.message}
      />

      {/* Email */}

      <Input
        label="Email"
        placeholder="isacjohn@gmail.com"
        icon={<Mail size={18} />}
        register={register("email")}
        error={errors.email?.message}
      />

      {/* Password */}

      <PasswordInput
        label="Password"
        show={showPassword}
        toggle={() =>
          setShowPassword(!showPassword)
        }
        register={register("password")}
        error={errors.password?.message}
      />

      {/* Confirm */}

      <PasswordInput
        label="Confirm Password"
        show={showConfirmPassword}
        toggle={() =>
          setShowConfirmPassword(
            !showConfirmPassword
          )
        }
        register={register("confirm_password")}
        error={
          errors.confirm_password?.message
        }
      />

      {/* Password Strength */}

      {password.length > 0 && (

        <div>

          <div className="mb-2 flex justify-between text-sm">

            <span className="text-slate-500">
              Password Strength
            </span>

            <span
              className={`font-semibold ${passwordStrength.textClass}`}
            >
              {passwordStrength.label}
            </span>

          </div>

          <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">

            <div
              className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.barClass} ${passwordStrength.widthClass}`}
            />

          </div>

        </div>

      )}

      {/* Terms */}

      <label className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">

        <input
          type="checkbox"
          required
          className="mt-1 rounded"
        />

        <span>
          I agree to the{" "}
          <Link
            href="/terms"
            className="font-semibold text-blue-600"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="font-semibold text-blue-600"
          >
            Privacy Policy
          </Link>
        </span>

      </label>

      {serverError && (
        <div
          className="
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-4
            text-sm
            text-red-600

            dark:border-red-900
            dark:bg-red-950/30
            dark:text-red-300
          "
        >
          {serverError}
        </div>
      )}

      {/* Button */}

      <button
        type="submit"
        disabled={loading}
        className="
          w-full
          rounded-2xl
          bg-gradient-to-r
          from-blue-600
          to-cyan-500
          py-4
          text-lg
          font-bold
          text-white
          shadow-lg
          transition-all

          hover:-translate-y-1
          hover:shadow-xl

          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {loading
          ? <span className="flex items-center justify-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          Creating Account...
        </span>
          : "Create Account"}
      </button>

      {/* Divider */}

      <div className="relative">

        <div className="absolute inset-0 flex items-center">

          <div className="w-full border-t border-slate-200 dark:border-slate-700" />

        </div>

        <div className="relative flex justify-center">

          <span className="bg-white px-4 text-sm text-slate-400 dark:bg-slate-900">
            Already have an account?
          </span>

        </div>

      </div>

      <Link
        href="/"
        className="
          flex
          justify-center
          rounded-2xl
          border
          border-slate-200
          py-4
          font-semibold
          transition
          hover:bg-slate-50
          dark:border-slate-700
          dark:hover:bg-slate-800
        "
      >
        Sign In
      </Link>

    </form>
  );
}

function Input({
  label,
  placeholder,
  icon,
  register,
  error,
}: {
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  register: any;
  error?: string;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </label>

      <div className="relative">

        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>

        <input
          {...register}
          autoFocus
          placeholder={placeholder}
          className="
            w-full
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            py-4
            pl-12
            pr-4
            outline-none
            transition
            focus:border-blue-500
            focus:bg-white
            dark:border-slate-700
            dark:bg-slate-800
            dark:text-white
          "
        />

      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

    </div>
  );
}

function PasswordInput({
  label,
  show,
  toggle,
  register,
  error,
}: {
  label: string;
  show: boolean;
  toggle: () => void;
  register: any;
  error?: string;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </label>

      <div className="relative">

        <Lock
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          {...register}
          type={
            show
              ? "text"
              : "password"
          }
          placeholder={label}
          className="
            w-full
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            py-4
            pl-12
            pr-14
            outline-none
            transition
            focus:border-blue-500
            focus:bg-white
            dark:border-slate-700
            dark:bg-slate-800
            dark:text-white
          "
        />

        <button
          type="button"
          onClick={toggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
        >
          {show
            ? <EyeOff size={20} />
            : <Eye size={20} />}
        </button>

      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

    </div>
  );
}
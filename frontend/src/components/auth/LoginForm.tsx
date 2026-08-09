"use client";

import Link from "next/link";
import { useState } from "react";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Eye,
    EyeOff,
    Lock,
    Mail,
  } from "lucide-react";

import axios from "axios";

import {
  loginSchema,
  LoginFormData,
} from "@/features/auth/loginSchema";

import { login } from "@/services/auth.service";
import { getProfile } from "@/services/profile.service";

import { tokenStorage } from "@/lib/token";

import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/authSlice";

export default function LoginForm() {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const [loading, setLoading] =
    useState(false);

  const [serverError, setServerError] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (
    data: LoginFormData
  ) => {
    try {
      setLoading(true);
      setServerError("");

      const tokens = await login({
        email: data.email,
        password: data.password,
      });

      tokenStorage.setTokens(
        tokens.access,
        tokens.refresh
      );

      const profile =
        await getProfile();

      const html =
        document.documentElement;

      html.classList.remove(
        "light",
        "dark"
      );

      const savedTheme =
        profile.theme || "system";

      localStorage.setItem(
        "theme",
        savedTheme
      );

      if (
        savedTheme === "system"
      ) {
        const prefersDark =
          window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches;

        html.classList.add(
          prefersDark
            ? "dark"
            : "light"
        );
      } else {
        html.classList.add(
          savedTheme
        );
      }

      dispatch(setUser(profile));

      router.push("/dashboard");

    } catch (error) {

      if (axios.isAxiosError(error)) {

        setServerError(
          error.response?.data?.detail ??
            "Invalid email or password."
        );

      } else {

        setServerError(
          "Invalid email or password."
        );

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

      {/* Server Error */}

      {serverError && (

        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          {serverError}
        </div>

      )}

 {/* Email */}

<div>

<label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
  Email Address
</label>

<div className="relative">

  <Mail
    size={20}
    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
  />

  <input
    type="email"
    {...register("email")}
    placeholder="Enter your email"
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

{errors.email && (
  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
    {errors.email.message}
  </p>
)}

</div>

      {/* Password */}

      <div>

        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Password
        </label>

        <div className="relative">

          <Lock
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            {...register("password")}
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Enter your password"
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
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
          >
            {showPassword
              ? <EyeOff size={20} />
              : <Eye size={20} />}
          </button>

        </div>

        {errors.password && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {errors.password.message}
          </p>
        )}

      </div>

      {/* Remember */}

      <div className="flex items-center justify-between">

        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">

          <input
            type="checkbox"
            className="rounded"
          />

          Remember me

        </label>

        <Link
          href="/forgot-password"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          Forgot Password?
        </Link>

      </div>

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
          ? "Signing In..."
          : "Sign In"}
      </button>

      {/* Divider */}

      <div className="relative">

        <div className="absolute inset-0 flex items-center">

          <div className="w-full border-t border-slate-200 dark:border-slate-700" />

        </div>

        <div className="relative flex justify-center">

          <span className="bg-white px-4 text-sm text-slate-400 dark:bg-slate-900">
            New to TripPilot?
          </span>

        </div>

      </div>

      {/* Register */}

      <Link
        href="/register"
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
        Create Account
      </Link>

    </form>
  );
}
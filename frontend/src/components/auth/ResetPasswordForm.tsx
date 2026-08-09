"use client";

import Link from "next/link";
import { useState } from "react";
import axios from "axios";

import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

import { toast } from "sonner";


import { resetPassword } from "@/services/auth.service";

interface Props {
  uid: string;
  token: string;
}

export default function ResetPasswordForm({
  uid,
  token,
}: Props) {
  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      await resetPassword({
        uid,
        token,
        password,
        confirm_password:
          confirmPassword,
      });

      toast.success(
        "Password reset successfully."
      );

      setSuccess(true);

    } catch (err: unknown) {

      if (axios.isAxiosError(err)) {

        const data =
          err.response?.data;

        if (
          typeof data === "object" &&
          data
        ) {
          const firstError =
            Object.values(data)[0];

          if (
            Array.isArray(firstError)
          ) {
            setError(firstError[0]);

          } else if (
            typeof firstError ===
            "string"
          ) {
            setError(firstError);

          } else {

            setError(
              "Unable to reset password."
            );

          }

        } else {

          setError(
            "Unable to reset password."
          );

        }

      } else {

        setError(
          "Unable to reset password."
        );

      }

    } finally {

      setLoading(false);

    }
  };

  if (success) {
    return (
      <div className="space-y-8 text-center">

        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>

        <div>

          <h1 className="text-3xl font-bold text-white">
            Password Updated
          </h1>

          <p className="mt-3 text-slate-400">
            Your password has been reset
            successfully.
          </p>

        </div>

        <Link
          href="/"
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-blue-600
            px-6
            py-3
            font-semibold
            text-white
            transition
            hover:bg-blue-700
          "
        >
          <ArrowLeft size={18} />
          Back to Login
        </Link>

      </div>
    );
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >


      <div className="space-y-2 text-center">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/15">

          <Lock className="h-10 w-10 text-blue-500" />

        </div>

        <h2 className="text-3xl font-bold text-white">
          Reset Password
        </h2>

        <p className="text-slate-400">
          Create a new secure password for your
          TripPilot account.
        </p>

      </div>

      {/* New Password */}

      <div>

        <label className="mb-2 block text-sm font-semibold text-slate-300">
          New Password
        </label>

        <div className="relative">

          <Lock
            size={18}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Enter new password"
            required
            className="
              w-full
              rounded-2xl
              border
              border-slate-700
              bg-slate-800
              py-4
              pl-12
              pr-14
              text-white
              placeholder:text-slate-500
              outline-none
              transition

              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-500/20
            "
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-slate-400
              hover:text-blue-500
            "
          >
            {showPassword
              ? <EyeOff size={20} />
              : <Eye size={20} />}
          </button>

        </div>

      </div>

      {/* Confirm Password */}

      <div>

        <label className="mb-2 block text-sm font-semibold text-slate-300">
          Confirm Password
        </label>

        <div className="relative">

          <Lock
            size={18}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            placeholder="Confirm password"
            required
            className="
              w-full
              rounded-2xl
              border
              border-slate-700
              bg-slate-800
              py-4
              pl-12
              pr-14
              text-white
              placeholder:text-slate-500
              outline-none
              transition

              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-500/20
            "
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-slate-400
              hover:text-blue-500
            "
          >
            {showConfirmPassword
              ? <EyeOff size={20} />
              : <Eye size={20} />}
          </button>

        </div>

      </div>

      {error && (
        <div
          className="
            rounded-2xl
            border
            border-red-500/30
            bg-red-500/10
            p-4
            text-sm
            text-red-300
          "
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="
          flex
          w-full
          items-center
          justify-center

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
          hover:shadow-2xl

          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {loading
          ? "Updating Password..."
          : "Reset Password"}
      </button>

      <Link
        href="/"
        className="
          flex
          items-center
          justify-center
          gap-2

          font-semibold
          text-slate-400

          transition

          hover:text-blue-400
        "
      >
        <ArrowLeft size={18} />
        Back to Login
      </Link>

    </form>
  );
}
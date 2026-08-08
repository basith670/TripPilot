"use client";

import Link from "next/link";
import { useState } from "react";
import axios from "axios";

import {
  Mail,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

import { toast } from "sonner";

import { forgotPassword } from "@/services/auth.service";

export default function ForgotPasswordForm() {
  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      setError("");

      await forgotPassword({
        email,
      });

      setSuccess(true);

      toast.success(
        "Password reset email sent."
      );

    } catch (err: unknown) {

      if (axios.isAxiosError(err)) {

        const data = err.response?.data;

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
            typeof firstError === "string"
          ) {
            setError(firstError);

          } else {
            setError(
              "Unable to send reset email."
            );
          }

        } else {
          setError(
            "Unable to send reset email."
          );
        }

      } else {

        setError(
          "Unable to send reset email."
        );

      }

    } finally {

      setLoading(false);

    }
  };

  /* =========================
      SUCCESS SCREEN
  ========================= */

  if (success) {
    return (
      <div className="space-y-8 text-center">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/15">

          <CheckCircle2
            className="h-10 w-10 text-green-500"
          />

        </div>

        <div className="space-y-3">

          <h2 className="text-3xl font-bold text-white">
            Check your email
          </h2>

          <p className="text-slate-400">
            We've sent a password reset link to
          </p>

          <p className="break-all font-semibold text-white">
            {email}
          </p>

          <p className="text-sm text-slate-500">
            The reset link expires in
            <span className="font-semibold text-slate-300">
              {" "}30 minutes
            </span>.
          </p>

        </div>

        <Link
          href="/"
          className="
            inline-flex
            items-center
            justify-center
            rounded-2xl
            bg-gradient-to-r
            from-blue-600
            to-cyan-500
            px-8
            py-3
            font-semibold
            text-white
            transition-all
            hover:scale-105
          "
        >
          Back to Login
        </Link>

      </div>
    );
  }

  /* =========================
      FORM
  ========================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >


      <div className="space-y-3 text-center">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/15">

          <Mail className="h-10 w-10 text-blue-500" />

        </div>

        <h2 className="text-3xl font-bold text-white">
          Forgot Password?
        </h2>

        <p className="text-slate-400">
          Enter your email address and we'll send
          you a secure password reset link.
        </p>

      </div>

      <div>

        <label className="mb-2 block text-sm font-semibold text-slate-300">
          Email Address
        </label>

        <div className="relative">

          <Mail
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
            type="email"
            required
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="john@example.com"
            className="
              w-full
              rounded-2xl
              border
              border-slate-700
              bg-slate-800
              py-4
              pl-12
              pr-4
              text-white
              placeholder:text-slate-500
              outline-none
              transition

              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-500/20
            "
          />

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
          ? "Sending Reset Link..."
          : "Send Reset Link"}
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
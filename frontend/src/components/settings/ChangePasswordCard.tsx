"use client";

import { useMemo, useState } from "react";

import {
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";

import { toast } from "sonner";

import { changePassword } from "@/services/settings.service";
import { getPasswordStrength } from "@/utils/passwordStrength";

export default function ChangePasswordCard() {
  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [showOld, setShowOld] =
    useState(false);

  const [showNew, setShowNew] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const strength = useMemo(
    () =>
      getPasswordStrength(
        form.new_password
      ),
    [form.new_password]
  );

  const passwordsMatch =
    form.new_password ===
      form.confirm_password &&
    form.confirm_password.length > 0;

  const canSubmit =
    form.old_password.trim() !== "" &&
    form.new_password.length >= 8 &&
    passwordsMatch &&
    !loading;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  const resetForm = () => {
    setForm({
      old_password: "",
      new_password: "",
      confirm_password: "",
    });
  };

  const handleSubmit = async () => {
    if (
      form.old_password.trim() === "" ||
      form.new_password.trim() === "" ||
      form.confirm_password.trim() === ""
    ) {
      toast.error(
        "Please fill in all fields."
      );
      return;
    }

    if (
      form.new_password.length < 8
    ) {
      toast.error(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (!passwordsMatch) {
      toast.error(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await changePassword(form);

      toast.success(
        response.message
      );

      resetForm();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.error ??
          "Unable to change password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="
        rounded-[32px]
        bg-white
        p-8
        shadow-xl
        dark:bg-slate-900
      "
    >
      {/* Header */}

      <div className="flex items-center gap-4">

        <div className="rounded-2xl bg-blue-100 p-4 dark:bg-blue-900/30">

          <Lock
            size={28}
            className="text-blue-600"
          />

        </div>

        <div>

          <h2 className="text-2xl font-bold dark:text-white">
            Change Password
          </h2>

          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Keep your account secure by
            updating your password.
          </p>

        </div>

      </div>

      {/* Form */}

      <div className="mt-8 space-y-6">

        <PasswordField
          label="Current Password"
          name="old_password"
          value={form.old_password}
          show={showOld}
          onToggle={() =>
            setShowOld(!showOld)
          }
          onChange={handleChange}
        />

        <div>

          <PasswordField
            label="New Password"
            name="new_password"
            value={form.new_password}
            show={showNew}
            onToggle={() =>
              setShowNew(!showNew)
            }
            onChange={handleChange}
          />

          {form.new_password && (

            <div className="mt-3">

              <div className="h-2 overflow-hidden rounded-full bg-slate-200">

                <div
                  className={`h-full ${strength.color}`}
                  style={{
                    width:
                      strength.text ===
                      "Weak"
                        ? "35%"
                        : strength.text ===
                          "Medium"
                        ? "70%"
                        : "100%",
                  }}
                />

              </div>

              <p className="mt-2 text-sm text-slate-500">

                Password Strength:

                <span className="ml-1 font-semibold">

                  {strength.text}

                </span>

              </p>

            </div>

          )}

        </div>

        <div>

          <PasswordField
            label="Confirm Password"
            name="confirm_password"
            value={
              form.confirm_password
            }
            show={showConfirm}
            onToggle={() =>
              setShowConfirm(
                !showConfirm
              )
            }
            onChange={handleChange}
          />

          {form.confirm_password && (

            <p
              className={`mt-2 text-sm font-medium ${
                passwordsMatch
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {passwordsMatch
                ? "✓ Passwords match"
                : "✗ Passwords do not match"}
            </p>

          )}

        </div>

      </div>

      {/* Footer */}

      <div className="mt-10 flex justify-end">

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="
            rounded-xl
            bg-blue-600
            px-8
            py-3
            font-semibold
            text-white
            transition
            hover:bg-blue-700
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {loading
            ? "Updating..."
            : "Update Password"}
        </button>

      </div>

    </section>
  );
}

interface PasswordFieldProps {
  label: string;
  name: string;
  value: string;
  show: boolean;
  onToggle: () => void;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

function PasswordField({
  label,
  name,
  value,
  show,
  onToggle,
  onChange,
}: PasswordFieldProps) {
  return (
    <div>

      <label className="mb-2 block font-medium dark:text-white">
        {label}
      </label>

      <div className="relative">

        <input
          type={
            show
              ? "text"
              : "password"
          }
          name={name}
          value={value}
          onChange={onChange}
          className="
            w-full
            rounded-xl
            border
            border-slate-300
            bg-white
            p-3
            pr-12
            focus:border-blue-500
            focus:outline-none
            dark:border-slate-700
            dark:bg-slate-800
            dark:text-white
          "
        />

        <button
          type="button"
          onClick={onToggle}
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            text-slate-500
          "
        >
          {show ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>

      </div>

    </div>
  );
}
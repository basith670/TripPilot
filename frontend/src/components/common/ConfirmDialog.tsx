"use client";

import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  variant?: "primary" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const handleClose = () => {
    if (loading) return;
    onCancel();
  };

  return (
    <div
      onClick={handleClose}
      className="
        fixed
        inset-0
        z-[9999]

        flex
        items-center
        justify-center

        bg-black/60

        backdrop-blur-md

        p-4
      "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full
          max-w-lg

          overflow-hidden

          rounded-[32px]

          border
          border-border

          bg-card

          shadow-2xl
        "
      >
        {/* Header */}

        <div
          className={`
            px-8
            py-7
            text-white

            ${
              variant === "danger"
                ? "bg-gradient-to-r from-red-600 via-red-500 to-rose-600"
                : "bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600"
            }
          `}
        >
          <div className="flex items-center gap-4">
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center

                rounded-2xl

                bg-white/15
              "
            >
              <AlertTriangle size={28} />
            </div>

            <div>
              <span
                className="
                  rounded-full
                  bg-white/20

                  px-3
                  py-1

                  text-xs
                  font-semibold
                "
              >
                Confirmation
              </span>

              <h2 className="mt-3 text-3xl font-bold">
                {title}
              </h2>
            </div>
          </div>
        </div>

        {/* Body */}

        <div className="px-8 py-8">
          <p className="leading-8 text-muted-foreground">
            {message}
          </p>
        </div>

        {/* Footer */}

        <div
          className="
            flex
            justify-end
            gap-4

            border-t
            border-border

            bg-card

            px-8
            py-6
          "
        >
          <button
            onClick={handleClose}
            disabled={loading}
            className="
              rounded-2xl

              border
              border-border

              bg-background

              px-6
              py-3

              font-semibold

              text-foreground

              transition-all

              hover:bg-muted

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`
              rounded-2xl

              px-7
              py-3

              font-semibold

              text-white

              shadow-lg

              transition-all

              hover:-translate-y-0.5
              hover:shadow-xl

              disabled:cursor-not-allowed
              disabled:opacity-50
              disabled:hover:translate-y-0

              ${
                variant === "danger"
                  ? "bg-gradient-to-r from-red-600 to-rose-600"
                  : "bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600"
              }
            `}
          >
            {loading
              ? "Processing..."
              : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
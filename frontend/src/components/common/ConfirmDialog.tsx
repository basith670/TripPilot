"use client";

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Header */}

        <div className="border-b px-6 py-5">
          <h2 className="text-xl font-bold text-gray-900">
            {title}
          </h2>
        </div>

        {/* Body */}

        <div className="px-6 py-5">
          <p className="leading-7 text-gray-600">
            {message}
          </p>
        </div>

        {/* Footer */}

        <div className="border-t bg-white px-6 py-5">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={handleClose}
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-5 py-3 font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {cancelText}
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              className={`w-full rounded-lg px-5 py-3 font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${
                variant === "danger"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading
                ? "Processing..."
                : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
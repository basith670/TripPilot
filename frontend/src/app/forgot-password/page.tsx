import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import AuthBrand from "@/components/auth/AuthBrand";

export default function ForgotPasswordPage() {
  return (
    <main
      className="
        min-h-screen
        bg-gradient-to-br
        from-slate-950
        via-slate-900
        to-slate-950

        flex
        flex-col
        items-center
        justify-center

        px-6
        py-12
      "
    >
      {/* Brand */}

      <div className="mb-12">
        <AuthBrand />
      </div>

      {/* Form */}

      <ForgotPasswordForm />

      {/* Footer */}

      <p
        className="
          mt-12
          text-sm
          text-slate-500
        "
      >
        Trusted by{" "}
        <span className="font-bold text-white">
          10,000+
        </span>{" "}
        travelers worldwide
      </p>
    </main>
  );
}
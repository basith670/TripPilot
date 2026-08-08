import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import AuthBrand from "@/components/auth/AuthBrand";

interface Props {
  params: Promise<{
    uid: string;
    token: string;
  }>;
}

export default async function ResetPasswordPage({
  params,
}: Props) {
  const { uid, token } = await params;

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

      <ResetPasswordForm
        uid={uid}
        token={token}
      />

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
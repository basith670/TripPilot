"use client";

import AuthHero from "@/components/auth/AuthHero";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden

        bg-slate-100

        dark:bg-slate-950
      "
    >
      {/* Background */}

      <div
        className="
          absolute
          inset-0

          bg-[radial-gradient(circle_at_top_right,#3b82f620,transparent_40%),radial-gradient(circle_at_bottom_left,#06b6d420,transparent_35%)]
        "
      />

      <div
        className="
          relative
          z-10

          mx-auto

          flex
          min-h-screen

          max-w-7xl

          items-center

          px-6
          py-10
        "
      >
        <div
          className="
            grid

            w-full

            overflow-hidden

            rounded-[40px]

            bg-white/70

            shadow-2xl

            backdrop-blur-xl

            dark:bg-slate-900/80

            lg:grid-cols-2
          "
        >
          {/* Left */}

          <AuthHero />

          {/* Right */}

          <section
            className="
              flex
              items-center
              justify-center

              p-8

              md:p-14
            "
          >
            <div className="w-full max-w-md">

              <span
                className="
                  inline-flex

                  rounded-full

                  bg-blue-100

                  px-4
                  py-2

                  text-sm
                  font-semibold

                  text-blue-700

                  dark:bg-cyan-500/10
                  dark:text-cyan-400
                "
              >
                Welcome Back
              </span>

              <h1
                className="
                  mt-6

                  text-5xl

                  font-black

                  text-slate-900

                  dark:text-white
                "
              >
                Sign In
              </h1>

              <p
                className="
                  mt-3

                  text-lg

                  text-slate-500

                  dark:text-slate-400
                "
              >
                Continue your travel journey with
                TripPilot AI.
              </p>

              {/* Login Form */}

              <div
              className="
                mt-10

                rounded-3xl

                border
                border-slate-200

                bg-white

                p-8

                shadow-lg

                dark:border-slate-700
                dark:bg-slate-900
              "
            >
              <LoginForm />
            </div>

            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
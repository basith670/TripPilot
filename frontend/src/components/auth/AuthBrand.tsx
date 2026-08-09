import Image from "next/image";
import Link from "next/link";

export default function AuthBrand() {
  return (
    <Link
      href="/"
      className="
        absolute
        top-10
        left-10

        flex
        items-center
        gap-4

        transition
        hover:opacity-90
      "
    >
      <Image
        src="/logo/trippilot-logo.png"
        alt="TripPilot"
        width={64}
        height={64}
        priority
      />

      <div>

        <h1
          className="
            text-5xl
            font-black
            tracking-tight
            text-white
            leading-none
          "
        >
          TripPilot
        </h1>

        <p
          className="
            mt-1
            text-lg
            text-slate-400
          "
        >
          AI Powered Travel Planner
        </p>

      </div>

    </Link>
  );
}
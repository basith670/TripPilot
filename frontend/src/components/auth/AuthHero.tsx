"use client";

import {
  Plane,
  Map,
  Hotel,
  Sparkles,
  Globe2,
  Wallet,
} from "lucide-react";

export default function AuthHero() {
  return (
    <section
      className="
        relative
        hidden
        overflow-hidden
        lg:flex
        lg:flex-col
        lg:justify-between

        rounded-[40px]

        bg-gradient-to-br
        from-slate-900
        via-blue-900
        to-indigo-900

        p-12

        text-white

        shadow-2xl
      "
    >
      {/* Background */}

      <div className="absolute inset-0">

        <div className="absolute -top-24 -left-16 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

      </div>

      {/* Content */}

      <div className="relative z-10">

        <div
          className="
            inline-flex
            items-center
            gap-3

            rounded-full

            border
            border-white/10

            bg-white/10

            px-5
            py-2

            backdrop-blur
          "
        >
          <Plane size={20} />

          <span className="font-semibold">
            TripPilot AI
          </span>

        </div>

        <h1
          className="
            mt-10
            max-w-lg

            text-6xl
            font-black
            leading-tight
          "
        >
          Travel{" "}
          <span
            className="
              bg-gradient-to-r
              from-cyan-300
              to-blue-300
              bg-clip-text
              text-transparent
            "
          >
            Smarter
          </span>
          , Not Harder.
        </h1>

        <p
          className="
            mt-6
            max-w-xl

            text-lg
            leading-8

            text-slate-300
          "
        >
          Plan complete trips with AI,
          manage flights, hotels,
          itineraries and expenses in one
          beautiful workspace.
        </p>

      </div>

      {/* Features */}

      <div
        className="
          relative
          z-10

          mt-12

          grid
          grid-cols-2
          gap-5
        "
      >

        <Feature
          icon={<Sparkles size={20} />}
          title="AI Planning"
        />

        <Feature
          icon={<Plane size={20} />}
          title="Flights"
        />

        <Feature
          icon={<Hotel size={20} />}
          title="Hotels"
        />

        <Feature
          icon={<Map size={20} />}
          title="Itinerary"
        />

        <Feature
          icon={<Wallet size={20} />}
          title="Budget"
        />

        <Feature
          icon={<Globe2 size={20} />}
          title="Worldwide"
        />

      </div>
    </section>
  );
}

function Feature({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div
      className="
        group
        flex
        items-center
        gap-3

        rounded-2xl

        border
        border-white/10

        bg-white/10

        p-4

        backdrop-blur

        transition-all
        duration-300

        hover:-translate-y-0.5
        hover:bg-white/15
      "
    >
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center

          rounded-xl

          bg-white/10

          transition-colors

          group-hover:bg-white/20
        "
      >
        {icon}
      </div>

      <span className="font-medium">
        {title}
      </span>
    </div>
  );
}
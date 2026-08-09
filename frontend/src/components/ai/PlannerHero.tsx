"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Plane,
  Hotel,
  MapPinned,
  Brain,
} from "lucide-react";

const features = [
  {
    icon: Plane,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-500/15",
  },
  {
    icon: Hotel,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-500/15",
  },
  {
    icon: MapPinned,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-100 dark:bg-rose-500/15",
  },
  {
    icon: Brain,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-500/15",
  },
];

export default function PlannerHero() {
  return (
    <section className="relative mb-10 overflow-hidden">

      {/* AI Badge */}

      <motion.div
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="flex justify-center"
      >
        <div
          className="
            inline-flex
            items-center
            gap-2

            rounded-full

            border
            border-border

            bg-card/80

            px-5
            py-2.5

            shadow-lg
            backdrop-blur-xl
          "
        >
          <Sparkles
            size={18}
            className="text-yellow-500"
          />

          <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
            Powered by AI
          </span>

        </div>
      </motion.div>

      {/* Title */}

      <motion.h1
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.2,
          duration: 0.7,
        }}
        className="
          mt-8

          text-center

          text-4xl
          font-black
          leading-tight

          sm:text-5xl
          lg:text-7xl
        "
      >
        <span
          className="
            bg-gradient-to-r
            from-blue-600
            via-cyan-500
            to-indigo-600

            bg-clip-text
            text-transparent

            dark:from-cyan-300
            dark:via-blue-400
            dark:to-indigo-300
          "
        >
          AI Travel Planner
        </span>
      </motion.h1>

      {/* Subtitle */}

      <motion.p
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 0.45,
        }}
        className="
          mx-auto
          mt-6

          max-w-3xl

          px-4

          text-center

          text-base
          leading-8

          text-muted-foreground

          sm:text-lg
          lg:text-xl
        "
      >
        Flights, hotels, itineraries, transport,
        restaurants and budgets planned intelligently
        in seconds using AI-powered recommendations.
      </motion.p>

      {/* Floating Icons */}

      <div
        className="
          mx-auto
          mt-12

          grid
          max-w-sm
          grid-cols-2
          gap-5

          sm:max-w-none
          sm:grid-cols-4
          sm:gap-8
        "
      >
        {features.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={index}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: index * 0.25,
              }}
              className={`
                mx-auto

                flex
                h-20
                w-20
                items-center
                justify-center

                rounded-3xl

                border
                border-border

                ${item.bg}

                shadow-xl

                transition-all
                duration-300

                hover:-translate-y-2
                hover:shadow-2xl

                sm:h-24
                sm:w-24
              `}
            >
              <Icon
                className={item.color}
                size={32}
              />
            </motion.div>
          );
        })}
      </div>

    </section>
  );
}
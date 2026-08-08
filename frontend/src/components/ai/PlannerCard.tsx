"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface PlannerCardProps {
  icon: string;
  title: string;
  description: string;
  features: string[];
  buttonText: string;
  gradient: string;
  onClick: () => void;
}

export default function PlannerCard({
  icon,
  title,
  description,
  features,
  buttonText,
  gradient,
  onClick,
}: PlannerCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -10,
        scale: 1.015,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className="
        group
        relative
        overflow-hidden

        rounded-[32px]

        border
        border-border

        bg-card

        p-8

        shadow-xl

        transition-all
        duration-300

        hover:shadow-2xl
      "
    >
      {/* Hover Gradient */}

      <div
        className={`
          absolute
          inset-0

          opacity-0

          transition-opacity
          duration-500

          group-hover:opacity-100

          ${gradient}
        `}
      />

      {/* Decorative Glow */}

      <div
        className="
          absolute
          -right-20
          -top-20

          h-52
          w-52

          rounded-full

          bg-blue-500/10

          blur-3xl
        "
      />

      <div className="relative z-10 flex h-full flex-col">

        {/* Icon */}

        <motion.div
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
          }}
          className="
            mb-6

            flex
            h-24
            w-24
            items-center
            justify-center

            rounded-3xl

            bg-background

            text-6xl

            shadow-lg
          "
        >
          {icon}
        </motion.div>

        {/* Title */}

        <h2 className="text-4xl font-bold text-foreground">
          {title}
        </h2>

        {/* Description */}

        <p
          className="
            mt-5

            text-lg
            leading-8

            text-muted-foreground
          "
        >
          {description}
        </p>

        {/* Features */}

        <div className="mt-8 flex-1 space-y-4">

          {features.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-3"
            >
              <CheckCircle2
                size={20}
                className="text-emerald-500"
              />

              <span className="text-foreground">
                {feature}
              </span>

            </div>
          ))}

        </div>

        {/* Button */}

        <motion.button
          whileHover={{
            scale: 1.03,
          }}
          whileTap={{
            scale: 0.98,
          }}
          onClick={onClick}
          className="
            group/button

            mt-10

            inline-flex
            items-center
            justify-center
            gap-3

            rounded-2xl

            bg-blue-600

            px-7
            py-4

            font-semibold

            text-white

            shadow-lg

            transition-all
            duration-300

            hover:-translate-y-1
            hover:bg-blue-700
            hover:shadow-xl
          "
        >
          {buttonText}

          <ArrowRight
            size={20}
            className="
              transition-transform
              duration-300

              group-hover/button:translate-x-1
            "
          />

        </motion.button>

      </div>

    </motion.div>
  );
}
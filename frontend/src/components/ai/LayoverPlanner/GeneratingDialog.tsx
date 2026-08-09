"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Plane,
  Loader2,
  CheckCircle2,
} from "lucide-react";

interface GeneratingDialogProps {
  open: boolean;
  onComplete?: () => void;
}

const steps = [
  "Analyzing your flight schedule...",
  "Calculating layover duration...",
  "Checking airport facilities...",
  "Finding the best lounges...",
  "Searching nearby attractions...",
  "Finding restaurants & cafés...",
  "Planning transport options...",
  "Optimizing your budget...",
  "Creating your personalized itinerary...",
];

export default function GeneratingDialog({
  open,
  onComplete,
}: GeneratingDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!open) {
      setCurrentStep(0);
      return;
    }

    let index = 0;

    const interval = setInterval(() => {
      index++;

      if (index >= steps.length) {
        clearInterval(interval);

        setTimeout(() => {
          onComplete?.();
        }, 700);

        return;
      }

      setCurrentStep(index);
    }, 800);

    return () => clearInterval(interval);
  }, [open, onComplete]);

  if (!mounted || !open) return null;

  const progress =
    ((currentStep + 1) / steps.length) * 100;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="
          fixed
          inset-0
          z-[9999]
          flex
          items-center
          justify-center
          bg-black/60
          p-4
          backdrop-blur-md
        "
      >
        <motion.div
          initial={{
            scale: 0.95,
            opacity: 0,
            y: 20,
          }}
          animate={{
            scale: 1,
            opacity: 1,
            y: 0,
          }}
          exit={{
            scale: 0.97,
            opacity: 0,
          }}
          transition={{
            duration: 0.25,
          }}
          className="
            flex
            w-full
            max-w-2xl
            max-h-[90vh]
            flex-col
            overflow-hidden
            rounded-3xl
            border
            border-border
            bg-card
            text-foreground
            shadow-2xl
          "
        >
          {/* Header */}

          <div
            className="
              bg-gradient-to-r
              from-blue-600
              via-cyan-600
              to-indigo-600
              px-6
              py-8
              text-center
              text-white
              sm:px-8
            "
          >
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
              className="
                mx-auto
                mb-4
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                bg-white/20
                backdrop-blur
                sm:h-20
                sm:w-20
              "
            >
              <Plane className="h-8 w-8 sm:h-10 sm:w-10" />
            </motion.div>

            <h2 className="text-2xl font-bold sm:text-3xl">
              Creating Your AI Layover Plan
            </h2>

            <p className="mt-2 text-sm text-blue-100 sm:text-base">
              Our AI is preparing the perfect airport
              experience for your journey.
            </p>
          </div>

          {/* Scrollable Body */}

          <div className="flex-1 overflow-y-auto p-5 sm:p-6 md:p-8">
            {/* Progress */}

            <div className="mb-6">
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="
                    h-full
                    rounded-full
                    bg-gradient-to-r
                    from-blue-600
                    via-cyan-500
                    to-indigo-600
                  "
                  animate={{
                    width: `${progress}%`,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                />
              </div>

              <p className="mt-3 text-center text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>

            {/* Steps */}

            <div className="space-y-3">
              {steps.map((step, index) => (
                <motion.div
                  key={step}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className={`
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    px-4
                    py-3
                    transition-all

                    ${
                      index === currentStep
                        ? "border-blue-500/40 bg-blue-50 dark:bg-blue-500/10 shadow-sm"
                        : "border-border bg-card"
                    }
                  `}
                >
                  <div className="flex-shrink-0">
                    {index < currentStep ? (
                      <CheckCircle2
                        className="h-5 w-5 text-green-600 dark:text-green-400"
                      />
                    ) : index === currentStep ? (
                      <Loader2
                        className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400"
                      />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/40" />
                    )}
                  </div>

                  <span
                    className={`
                      text-sm
                      font-medium
                      sm:text-base

                      ${
                        index <= currentStep
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    `}
                  >
                    {step}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Footer */}

            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground sm:text-sm">
                This usually takes only a few seconds.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
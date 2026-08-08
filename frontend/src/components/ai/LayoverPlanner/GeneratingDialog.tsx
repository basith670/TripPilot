"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Brain,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface GeneratingDialogProps {
  open: boolean;
  onComplete?: () => void;
}

const steps = [
  "Understanding your destination...",
  "Finding the best flights...",
  "Comparing hotels...",
  "Creating your itinerary...",
  "Optimizing your budget...",
  "Finding restaurants...",
  "Planning local transport...",
  "Preparing travel tips...",
  "Finalizing your AI trip...",
];

export default function GeneratingDialog({
  open,
  onComplete,
}: GeneratingDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);

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
    }, 900);

    return () => clearInterval(interval);
  }, [open, onComplete]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{
            scale: 0.9,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          exit={{
            scale: 0.95,
            opacity: 0,
          }}
          transition={{
            duration: 0.25,
          }}
          className="
            w-full
            max-w-3xl
            max-h-[90vh]
            overflow-y-auto
            rounded-3xl
            bg-white
            p-5
            shadow-2xl
            sm:p-6
            md:p-8
            lg:p-10
          "
        >
          {/* Header */}

          <div className="flex flex-col items-center text-center">
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
              className="mb-5"
            >
              <Brain
                size={56}
                className="text-blue-600 md:h-[72px] md:w-[72px]"
              />
            </motion.div>

            <h2 className="text-2xl font-bold md:text-4xl">
              Generating Your AI Trip
            </h2>

            <p className="mt-3 max-w-xl text-sm text-gray-500 md:text-base">
              Our AI is planning every detail for your journey.
            </p>
          </div>

          {/* Steps */}

          <div className="mt-6 space-y-3 md:mt-10 md:space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={step}
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.25,
                }}
                className="
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  p-3
                  shadow-sm
                  sm:p-4
                "
              >
                <div className="flex-shrink-0">
                  {index < currentStep ? (
                    <CheckCircle2
                      size={22}
                      className="text-green-600"
                    />
                  ) : index === currentStep ? (
                    <Loader2
                      size={22}
                      className="animate-spin text-blue-600"
                    />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                  )}
                </div>

                <span className="text-sm font-medium text-gray-800 sm:text-base">
                  {step}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
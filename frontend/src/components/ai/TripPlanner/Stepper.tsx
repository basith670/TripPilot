"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepperProps {
  currentStep: number;
}

const steps = [
  "Trip Details",
  "Travellers",
  "Preferences",
  "Review",
];

export default function Stepper({
  currentStep,
}: StepperProps) {
  const progress =
    ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="mb-10 w-full">

      {/* ==========================
          MOBILE
      ========================== */}

      <div className="block md:hidden">

        <div className="mb-3 flex items-center justify-between">

          <span className="text-sm font-semibold text-blue-600">
            Step {currentStep} of {steps.length}
          </span>

          <span className="text-sm text-gray-500">
            {Math.round(progress)}%
          </span>

        </div>

        <div className="h-2 overflow-hidden rounded-full bg-gray-200">

          <motion.div
            animate={{
              width: `${progress}%`,
            }}
            transition={{
              duration: 0.35,
            }}
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"
          />

        </div>

        <motion.div
          key={currentStep}
          initial={{
            opacity: 0,
            x: 20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.3,
          }}
          className="mt-5 text-center"
        >

          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white shadow-lg">

            {currentStep}

          </div>

          <h3 className="text-xl font-bold">

            {steps[currentStep - 1]}

          </h3>

          <p className="mt-1 text-sm text-gray-500">

            Complete this section to continue.

          </p>

        </motion.div>

      </div>

      {/* ==========================
          DESKTOP
      ========================== */}

      <div className="hidden md:block">

        <div className="flex items-center justify-between">

          {steps.map((step, index) => {

            const stepNumber = index + 1;

            const completed =
              currentStep > stepNumber;

            const active =
              currentStep === stepNumber;

            return (

              <div
                key={step}
                className="flex flex-1 items-center"
              >

                <div className="flex flex-col items-center">

                  <motion.div
                    animate={{
                      scale: active ? 1.08 : 1,
                    }}
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 font-bold transition-all duration-300 ${
                      completed
                        ? "border-green-600 bg-green-600 text-white"
                        : active
                        ? "border-blue-600 bg-blue-600 text-white shadow-lg"
                        : "border-gray-300 bg-white text-gray-500"
                    }`}
                  >

                    {completed ? (
                      <Check size={20} />
                    ) : (
                      stepNumber
                    )}

                  </motion.div>

                  <span
                    className={`mt-3 text-sm font-semibold transition ${
                      active
                        ? "text-blue-600"
                        : completed
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    {step}
                  </span>

                </div>

                {index < steps.length - 1 && (

                  <div className="mx-3 h-1 flex-1 rounded-full bg-gray-200">

                    <motion.div
                      animate={{
                        width:
                          currentStep > stepNumber
                            ? "100%"
                            : "0%",
                      }}
                      transition={{
                        duration: 0.4,
                      }}
                      className="h-full rounded-full bg-blue-600"
                    />

                  </div>

                )}

              </div>

            );

          })}

        </div>

      </div>

    </div>
  );
}
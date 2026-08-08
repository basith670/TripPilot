"use client";

import {
  Plane,
  SlidersHorizontal,
  ClipboardCheck,
  CheckCircle2,
} from "lucide-react";

interface StepperProps {
  currentStep: number;
}

const steps = [
  {
    id: 1,
    title: "Flight",
    icon: Plane,
  },
  {
    id: 2,
    title: "Preferences",
    icon: SlidersHorizontal,
  },
  {
    id: 3,
    title: "Review",
    icon: ClipboardCheck,
  },
];

export default function Stepper({
  currentStep,
}: StepperProps) {
  return (
    <>
      {/* ================= MOBILE ================= */}

      <div className="space-y-4 md:hidden">
        {steps.map((step) => {
          const Icon = step.icon;

          const completed =
            currentStep > step.id;

          const active =
            currentStep === step.id;

          return (
            <div
              key={step.id}
              className={`
                flex
                items-center
                gap-4
                rounded-2xl
                border
                p-4
                transition-all

                ${
                  active
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                    : completed
                    ? "border-green-500/30 bg-green-50 dark:bg-green-500/10"
                    : "border-border bg-card"
                }
              `}
            >
              <div
                className={`
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  transition-all

                  ${
                    completed
                      ? "bg-green-600 text-white"
                      : active
                      ? "bg-blue-600 text-white"
                      : "bg-muted text-muted-foreground"
                  }
                `}
              >
                {completed ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <Icon size={20} />
                )}
              </div>

              <div className="flex-1">
                <p className="font-semibold text-foreground">
                  Step {step.id}
                </p>

                <p
                  className={`
                    font-medium

                    ${
                      active
                        ? "text-blue-600 dark:text-blue-400"
                        : completed
                        ? "text-green-600 dark:text-green-400"
                        : "text-muted-foreground"
                    }
                  `}
                >
                  {step.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= DESKTOP ================= */}

      <div className="hidden items-center justify-between md:flex">
        {steps.map((step, index) => {
          const Icon = step.icon;

          const completed =
            currentStep > step.id;

          const active =
            currentStep === step.id;

          return (
            <div
              key={step.id}
              className="flex flex-1 items-center"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    transition-all
                    duration-300

                    ${
                      completed
                        ? "bg-green-600 text-white shadow-lg"
                        : active
                        ? "bg-blue-600 text-white shadow-xl"
                        : "bg-muted text-muted-foreground"
                    }
                  `}
                >
                  {completed ? (
                    <CheckCircle2 size={22} />
                  ) : (
                    <Icon size={22} />
                  )}
                </div>

                <span
                  className={`
                    mt-3
                    text-sm
                    font-semibold

                    ${
                      completed
                        ? "text-green-600 dark:text-green-400"
                        : active
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-muted-foreground"
                    }
                  `}
                >
                  {step.title}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`
                    mx-6
                    h-1
                    flex-1
                    rounded-full
                    transition-all

                    ${
                      completed
                        ? "bg-green-600"
                        : active
                        ? "bg-blue-600"
                        : "bg-border"
                    }
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
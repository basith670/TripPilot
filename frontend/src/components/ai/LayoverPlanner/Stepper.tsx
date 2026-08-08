"use client";

import {
  Plane,
  SlidersHorizontal,
  ClipboardCheck,
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
    <div className="flex items-center justify-between">

      {steps.map((step, index) => {
        const Icon = step.icon;

        const active =
          currentStep >= step.id;

        return (
          <div
            key={step.id}
            className="flex flex-1 items-center"
          >
            <div className="flex flex-col items-center">

              <div
                className={`
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  transition-all
                  duration-300

                  ${
                    active
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-200 text-gray-500"
                  }
                `}
              >
                <Icon size={20} />
              </div>

              <span
                className={`
                  mt-2
                  text-sm
                  font-medium

                  ${
                    active
                      ? "text-blue-600"
                      : "text-gray-400"
                  }
                `}
              >
                {step.title}
              </span>

            </div>

            {index < steps.length - 1 && (
              <div
                className={`
                  mx-4
                  h-1
                  flex-1
                  rounded-full

                  ${
                    currentStep > step.id
                      ? "bg-blue-600"
                      : "bg-gray-200"
                  }
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
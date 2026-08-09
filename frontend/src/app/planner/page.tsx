"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import DashboardLayout from "@/components/layout/DashboardLayout";

import AnimatedBackground from "@/components/ai/AnimatedBackground";
import PlannerHero from "@/components/ai/PlannerHero";
import PlannerSelector from "@/components/ai/PlannerSelector";

import TripPlannerForm from "@/components/ai/TripPlanner/TripPlannerForm";
import LayoverPlannerForm from "@/components/ai/LayoverPlanner/LayoverPlannerForm";

function PlannerContent() {
  const searchParams = useSearchParams();

  const editId = searchParams.get("edit");

  const [plannerType, setPlannerType] = useState<
    "trip" | "layover" | null
  >(editId ? "layover" : null);

  return (
    <DashboardLayout>
      <div className="relative min-h-screen overflow-hidden bg-background transition-colors">

        {/* Animated Background */}

        <AnimatedBackground />

        {/* Content */}

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">

          <PlannerHero />

          <AnimatePresence mode="wait">

            {/* Planner Selection */}

            {!plannerType && (
              <motion.div
                key="selector"
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.97,
                }}
                transition={{
                  duration: 0.5,
                }}
              >
                <PlannerSelector
                  value={plannerType}
                  onChange={setPlannerType}
                />
              </motion.div>
            )}

            {/* Trip Planner */}

            {plannerType === "trip" && (
              <motion.div
                key="trip"
                initial={{
                  opacity: 0,
                  y: 30,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.96,
                }}
                transition={{
                  duration: 0.45,
                }}
              >
                <button
                  onClick={() => setPlannerType(null)}
                  className="
                    mb-6
                    inline-flex
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-border
                    bg-card
                    px-5
                    py-3
                    text-sm
                    font-medium
                    text-foreground
                    shadow-lg
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:bg-accent
                    hover:shadow-xl
                    sm:px-6
                    sm:text-base
                  "
                >
                  ← Back to Planner Selection
                </button>

                <TripPlannerForm />
              </motion.div>
            )}

            {/* Layover Planner */}

            {plannerType === "layover" && (
              <motion.div
                key="layover"
                initial={{
                  opacity: 0,
                  y: 30,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.96,
                }}
                transition={{
                  duration: 0.45,
                }}
              >
                {!editId && (
                  <button
                    onClick={() => setPlannerType(null)}
                    className="
                      mb-6
                      inline-flex
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-border
                      bg-card
                      px-5
                      py-3
                      text-sm
                      font-medium
                      text-foreground
                      shadow-lg
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:bg-accent
                      hover:shadow-xl
                      sm:px-6
                      sm:text-base
                    "
                  >
                    ← Back to Planner Selection
                  </button>
                )}

                <LayoverPlannerForm editId={editId} />
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </div>
    </DashboardLayout>
  );
}

export default function PlannerPage() {
  return (
    <Suspense fallback={null}>
      <PlannerContent />
    </Suspense>
  );
}
"use client";

import PlannerCard from "./PlannerCard";

interface PlannerSelectorProps {
  value: "trip" | "layover" | null;
  onChange: (
    value: "trip" | "layover"
  ) => void;
}

export default function PlannerSelector({
  onChange,
}: PlannerSelectorProps) {
  return (
    <section
      className="
        mt-10

        grid
        gap-8

        lg:grid-cols-2
        lg:items-stretch
      "
    >
      <PlannerCard
        icon="🧳"
        title="Complete Trip Planner"
        description="Generate a complete AI-powered vacation with flights, hotels, sightseeing, restaurants, transport, budget optimization and personalized recommendations."
        features={[
          "Best Flight Selection",
          "Hotel Recommendations",
          "Complete Day-wise Itinerary",
          "Restaurant Suggestions",
          "Local Transport",
          "Budget Optimization",
          "Packing Checklist",
        ]}
        buttonText="Start Planning"
        gradient="
          bg-gradient-to-br
          from-blue-500/20
          via-cyan-500/10
          to-indigo-500/20
        "
        onClick={() => onChange("trip")}
      />

      <PlannerCard
        icon="✈️"
        title="Layover Planner"
        description="Turn long layovers into memorable experiences with AI-powered airport navigation, lounges, nearby attractions and transport planning."
        features={[
          "Airport Navigation",
          "Lounge Suggestions",
          "Nearby Attractions",
          "Taxi / Metro Guidance",
          "Return Timing",
          "Food Recommendations",
          "Safety Tips",
        ]}
        buttonText="Plan Layover"
        gradient="
          bg-gradient-to-br
          from-emerald-500/20
          via-teal-500/10
          to-cyan-500/20
        "
        onClick={() => onChange("layover")}
      />
    </section>
  );
}
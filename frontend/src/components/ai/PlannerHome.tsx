"use client";

import { useState } from "react";

import TripPlannerForm from "./TripPlanner/TripPlannerForm";
import LayoverPlannerForm from "./LayoverPlanner/LayoverPlannerForm";

export default function PlannerHome() {
  const [planner, setPlanner] = useState<
    "home" | "trip" | "layover"
  >("home");

  if (planner === "trip") {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setPlanner("home")}
          className="rounded-2xl bg-white px-6 py-3 font-semibold shadow transition hover:bg-gray-50"
        >
          ← Back to Planner Selection
        </button>

        <TripPlannerForm />
      </div>
    );
  }

  if (planner === "layover") {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setPlanner("home")}
          className="rounded-2xl bg-white px-6 py-3 font-semibold shadow transition hover:bg-gray-50"
        >
          ← Back to Planner Selection
        </button>

        <LayoverPlannerForm />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}

      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          AI Travel Planner
        </h1>

        <p className="mt-3 max-w-3xl text-lg text-gray-500">
          Let AI plan your complete vacation or optimize your airport
          layover with personalized recommendations.
        </p>
      </div>

      {/* Planner Cards */}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Trip Planner */}

        <button
          onClick={() => setPlanner("trip")}
          className="group rounded-3xl border border-gray-200 bg-white p-8 text-left shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
        >
          <div className="text-6xl">✈️</div>

          <h2 className="mt-6 text-3xl font-bold">
            Complete Trip Planner
          </h2>

          <p className="mt-4 leading-8 text-gray-500">
            Build an AI-powered itinerary including flights, hotels,
            sightseeing, transport, restaurants, budget planning and
            day-wise recommendations.
          </p>

          <ul className="mt-8 space-y-3 text-gray-600">
            <li>✅ Flight recommendations</li>
            <li>✅ Hotel suggestions</li>
            <li>✅ Day-wise itinerary</li>
            <li>✅ Restaurants & attractions</li>
            <li>✅ Budget optimization</li>
            <li>✅ Packing checklist</li>
          </ul>

          <div className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition group-hover:bg-blue-700">
            Start Planning →
          </div>
        </button>

        {/* Layover Planner */}

        <button
          onClick={() => setPlanner("layover")}
          className="group rounded-3xl border border-gray-200 bg-white p-8 text-left shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
        >
          <div className="text-6xl">🛫</div>

          <h2 className="mt-6 text-3xl font-bold">
            Layover Planner
          </h2>

          <p className="mt-4 leading-8 text-gray-500">
            Turn long layovers into memorable experiences with AI-powered
            airport navigation, lounges, nearby attractions, restaurants,
            shopping and transport guidance.
          </p>

          <ul className="mt-8 space-y-3 text-gray-600">
            <li>✅ Airport navigation</li>
            <li>✅ Lounge recommendations</li>
            <li>✅ Nearby attractions</li>
            <li>✅ Metro & taxi guidance</li>
            <li>✅ Return timing alerts</li>
            <li>✅ Food & shopping suggestions</li>
          </ul>

          <div className="mt-8 inline-flex rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition group-hover:bg-green-700">
            Plan Layover →
          </div>
        </button>
      </div>
    </div>
  );
}
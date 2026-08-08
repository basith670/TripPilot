"use client";

import { useState } from "react";

import Stepper from "./Stepper";
import FlightStep from "./FlightStep";
import PreferenceStep from "./PreferenceStep";
import ReviewStep from "./ReviewStep";
import GeneratingDialog from "./GeneratingDialog";

export default function LayoverPlannerForm() {
  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);

  const [generating, setGenerating] = useState(false);

  const [showResults, setShowResults] = useState(false);

  const [layoverResult, setLayoverResult] = useState<any>(null);

  const [formData, setFormData] = useState({
    departureAirport: "",
    layoverAirport: "",
    destinationAirport: "",

    arrivalDate: "",
    arrivalTime: "",

    departureDate: "",
    departureTime: "",

    budget: "",

    travelStyle: "RELAX",

    visaRequired: false,
    checkedBaggage: false,
    loungeAccess: false,

    interests: [] as string[],
  });

  // ----------------------------
  // Validation
  // ----------------------------

  const isStep1Valid =
    formData.departureAirport.length === 3 &&
    formData.layoverAirport.length === 3 &&
    formData.destinationAirport.length === 3 &&
    formData.arrivalDate !== "" &&
    formData.arrivalTime !== "" &&
    formData.departureDate !== "" &&
    formData.departureTime !== "" &&
    formData.departureAirport !== formData.layoverAirport &&
    formData.layoverAirport !== formData.destinationAirport;

  const isStep2Valid =
    Number(formData.budget) > 0 &&
    formData.interests.length > 0;

  const canProceed =
    step === 1
      ? isStep1Valid
      : step === 2
      ? isStep2Valid
      : true;

  // ----------------------------
  // Input Handler
  // ----------------------------

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  // ----------------------------
  // AI Generation
  // ----------------------------

  const handleGenerate = async () => {
    try {
      setLoading(true);

      // Backend call comes later

      await new Promise((resolve) =>
        setTimeout(resolve, 2000)
      );

      setLayoverResult({});

      setGenerating(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showResults ? (
        <div>
          <h2 className="text-3xl font-bold">
            AI Layover Results
          </h2>
        </div>
      ) : (
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-2xl">

          <div className="mb-8">
            <h2 className="text-3xl font-bold">
              AI Layover Planner
            </h2>

            <p className="mt-2 text-gray-500">
              Plan your airport layover with AI.
            </p>
          </div>

          <Stepper currentStep={step} />

          <div className="mt-10">

            {step === 1 && (
              <FlightStep
                formData={formData}
                handleChange={handleChange}
                setFormData={setFormData}
              />
            )}

            {step === 2 && (
              <PreferenceStep
                formData={formData}
                setFormData={setFormData}
                handleChange={handleChange}
              />
            )}

            {step === 3 && (
              <ReviewStep
                formData={formData}
              />
            )}

          </div>

          <div className="mt-10 flex justify-between">

            {step > 1 ? (
              <button
                onClick={() =>
                  setStep(step - 1)
                }
                className="rounded-xl border px-6 py-3"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                disabled={!canProceed}
                onClick={() =>
                  setStep(step + 1)
                }
                className={`rounded-xl px-6 py-3 font-semibold text-white ${
                  canProceed
                    ? "bg-blue-600"
                    : "bg-gray-400"
                }`}
              >
                Next →
              </button>
            ) : (
              <button
                disabled={loading}
                onClick={handleGenerate}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white"
              >
                {loading
                  ? "Generating..."
                  : "✨ Generate Plan"}
              </button>
            )}

          </div>

        </div>
      )}

      <GeneratingDialog
        open={generating}
        onComplete={() => {
          setGenerating(false);
          setShowResults(true);
        }}
      />
    </>
  );
}
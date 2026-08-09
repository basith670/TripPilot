"use client";

import { useEffect, useState } from "react";

import Stepper from "./Stepper";
import FlightStep from "./FlightStep";
import PreferenceStep from "./PreferenceStep";
import ReviewStep from "./ReviewStep";
import GeneratingDialog from "./GeneratingDialog";
import LayoverResults from "./LayoverResults";

import { generateLayover } from "@/lib/layoverPlanner";
import {
  getLayoverTrip,
  updateLayoverTrip,
} from "@/services/trips.service";

interface Props {
  editId?: string | null;
}

export default function LayoverPlannerForm({
  editId,
}: Props) {
  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);

  const [generating, setGenerating] = useState(false);

  const [showResults, setShowResults] = useState(false);

  const [layoverResult, setLayoverResult] =
    useState<any>(null);

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

  // ============================================
  // Load existing layover trip while editing
  // ============================================

  useEffect(() => {
    if (!editId) return;

    const loadTrip = async () => {
      try {
        const trip = await getLayoverTrip(editId);

        setFormData({
          departureAirport:
            trip.departure_airport,

          layoverAirport:
            trip.layover_airport,

          destinationAirport:
            trip.destination_airport,

          arrivalDate:
            trip.arrival_date,

          arrivalTime:
            trip.arrival_time,

          departureDate:
            trip.departure_date,

          departureTime:
            trip.departure_time,

          budget:
            String(trip.budget),

          travelStyle:
            trip.travel_style,

          visaRequired: false,

          checkedBaggage: false,

          loungeAccess: false,

          interests: [],
        });
      } catch (err) {
        console.error(err);
      }
    };

    loadTrip();
  }, [editId]);

  // ============================================
  // Validation
  // ============================================

  const isStep1Valid =
    formData.departureAirport.length === 3 &&
    formData.layoverAirport.length === 3 &&
    formData.destinationAirport.length === 3 &&
    formData.arrivalDate !== "" &&
    formData.arrivalTime !== "" &&
    formData.departureDate !== "" &&
    formData.departureTime !== "" &&
    formData.departureAirport !==
      formData.layoverAirport &&
    formData.layoverAirport !==
      formData.destinationAirport;

  const isStep2Valid =
    Number(formData.budget) > 0 &&
    formData.interests.length > 0;

  const canProceed =
    step === 1
      ? isStep1Valid
      : step === 2
      ? isStep2Valid
      : true;

  // ============================================
  // Input Handler
  // ============================================

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
          ? (e.target as HTMLInputElement)
              .checked
          : value,
    }));
  };

  // ============================================
  // Generate AI
  // ============================================

  const handleGenerate = async () => {
    try {
      setLoading(true);

      const payload = {
        departure_airport: formData.departureAirport,
        layover_airport: formData.layoverAirport,
        destination_airport: formData.destinationAirport,

        arrival_date: formData.arrivalDate,
        arrival_time: formData.arrivalTime,

        departure_date: formData.departureDate,
        departure_time: formData.departureTime,

        budget: formData.budget,

        travel_style: formData.travelStyle,

        visa_required: formData.visaRequired,
        checked_baggage: formData.checkedBaggage,
        lounge_access: formData.loungeAccess,

        interests: formData.interests,
      };

      const response = await generateLayover(payload);

      if (!response.success) {
        alert(
          response.error ??
            "Unable to generate layover plan."
        );
        return;
      }

      // Update existing layover trip if editing
      if (editId) {
        await updateLayoverTrip(
          Number(editId),
          {
            departure_airport:
              formData.departureAirport,

            layover_airport:
              formData.layoverAirport,

            destination_airport:
              formData.destinationAirport,

            arrival_date:
              formData.arrivalDate,

            arrival_time:
              formData.arrivalTime,

            departure_date:
              formData.departureDate,

            departure_time:
              formData.departureTime,

            budget:
              formData.budget,

            travel_style:
              formData.travelStyle,

            ai_result:
              response.layover,
          }
        );
      }

      setLayoverResult(response.layover);

      setGenerating(true);
    } catch (error) {
      console.error(error);

      alert(
        "Unable to generate layover plan."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {showResults && layoverResult ? (
        <LayoverResults
          result={layoverResult}
          planner={formData}
          onBack={() => {
            setShowResults(false);
            setStep(1);

            setTimeout(() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }, 150);
          }}
        />
      ) : (
        <div
          className="
            mx-auto
            w-full
            max-w-5xl
            rounded-3xl
            bg-card/80
            shadow-2xl
            backdrop-blur-xl
            p-5
            sm:p-6
            md:p-8
            lg:p-10
          "
        >
          {/* Header */}

          <div className="mb-8">

            <h2 className="text-2xl font-bold sm:text-3xl">

              {editId
                ? "Edit AI Layover Planner"
                : "AI Layover Planner"}

            </h2>

            <p className="mt-2 text-sm text-muted-foreground sm:text-base">

              {editId
                ? "Update your saved layover itinerary."
                : "Plan your airport layover with AI."}

            </p>

          </div>

          <div className="overflow-x-auto pb-2">
            <Stepper currentStep={step} />
          </div>

          {!canProceed && (

            <div className="mt-6 rounded-2xl border border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 p-4">

              <p className="font-semibold text-amber-700 dark:text-amber-400">
                Please complete the required fields.
              </p>

              <p className="mt-2 text-sm text-amber-600 dark:text-amber-300">

                {step === 1 &&
                  "Enter valid airport details, dates and times before continuing."}

                {step === 2 &&
                  "Select a budget and at least one interest."}

              </p>

            </div>

          )}

          <div className="mt-8">
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
                handleChange={handleChange}
                setFormData={setFormData}
              />
            )}

            {step === 3 && (
              <ReviewStep
                formData={formData}
              />
            )}
          </div>

          <div className="mt-10 flex flex-col gap-4">

            <div
              className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              {step > 1 ? (

                <button
                  type="button"
                  onClick={() => {
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });

                    setStep((prev) => prev - 1);
                  }}
                  className="
                    order-2
                    w-full
                    rounded-xl
                    border
                    border-border
                    bg-card
                    px-6
                    py-3
                    font-medium
                    shadow-sm
                    transition-all
                    hover:bg-accent
                    sm:order-1
                    sm:w-auto
                  "
                >
                  ← Back
                </button>

              ) : (

                <div className="hidden sm:block" />

              )}

              {step < 3 ? (

                <button
                  type="button"
                  disabled={!canProceed}
                  onClick={() => {
                    if (!canProceed) return;

                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });

                    setStep((prev) => prev + 1);
                  }}
                  className={`
                    order-1
                    w-full
                    rounded-xl
                    px-6
                    py-3
                    font-semibold
                    transition-all
                    sm:order-2
                    sm:w-auto
                    ${
                      canProceed
                        ? "bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5"
                        : "cursor-not-allowed bg-muted text-muted-foreground"
                    }
                  `}
                >
                  Next →
                </button>

              ) : (

                <button
                  type="button"
                  disabled={loading}
                  onClick={handleGenerate}
                  className="
                    order-1
                    w-full
                    rounded-xl
                    bg-gradient-to-r
                    from-blue-600
                    via-cyan-600
                    to-indigo-600
                    px-6
                    py-3
                    font-semibold
                    text-white
                    shadow-xl
                    transition-all
                    hover:-translate-y-0.5
                    hover:shadow-2xl
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    sm:order-2
                    sm:w-auto
                  "
                >
                  {loading
                    ? "Generating AI Layover..."
                    : editId
                    ? "✨ Update AI Layover"
                    : "✨ Generate AI Layover"}
                </button>

              )}

            </div>

            {!canProceed && (

              <div className="rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">

                {step === 1 &&
                  "Please complete all flight details before continuing."}

                {step === 2 &&
                  "Please choose a budget and at least one interest."}

              </div>

            )}

          </div>

        </div>
      )}

      <GeneratingDialog
        open={generating}
        onComplete={() => {
          setGenerating(false);
          setShowResults(true);

          setTimeout(() => {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }, 150);
        }}
      />
    </>
  );
}
"use client";

import { useState } from "react";

import Stepper from "./Stepper";
import BasicInfoStep from "./BasicInfoStep";
import TravelerStep from "./TravelerStep";
import PreferenceStep from "./PreferenceStep";
import ReviewStep from "./ReviewStep";
import GeneratingDialog from "./GeneratingDialog";

import AIResults from "../AIResults/AIResults";

import { generateTrip } from "@/lib/tripPlanner";

export default function TripPlannerForm() {
  const [step, setStep] = useState(1);

  const [generating, setGenerating] = useState(false);

  const [showResults, setShowResults] = useState(false);

  const [loading, setLoading] = useState(false);

  const [tripResult, setTripResult] = useState<any>(null);

  const [formData, setFormData] = useState({
    sourceAirport: "",
    destinationAirport: "",
    departureDate: "",
    returnDate: "",
    budget: "",

    adults: 1,
    children: 0,
    infants: 0,
    seniors: 0,

    cabinClass: "ECONOMY",

    travelStyle: "MID_RANGE",
    transport: "AI",
    foodPreference: "NONE",

    interests: [] as string[],
    hotelAmenities: [] as string[],
  });

  // =====================================================
  // STEP VALIDATION
  // =====================================================

  const isStep1Valid =
    formData.sourceAirport.trim().length === 3 &&
    formData.destinationAirport.trim().length === 3 &&
    formData.departureDate !== "" &&
    formData.returnDate !== "" &&
    formData.budget !== "" &&
    Number(formData.budget) > 0 &&
    new Date(formData.returnDate) >=
      new Date(formData.departureDate) &&
    formData.sourceAirport.toUpperCase() !==
      formData.destinationAirport.toUpperCase();

  const isStep2Valid =
    formData.adults >= 1 &&
    formData.infants <= formData.adults;

  const isStep3Valid =
    formData.interests.length > 0 &&
    formData.hotelAmenities.length > 0;

  const canProceed =
    step === 1
      ? isStep1Valid
      : step === 2
      ? isStep2Valid
      : step === 3
      ? isStep3Valid
      : true;

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    let finalValue = value;

    if (
      name === "sourceAirport" ||
      name === "destinationAirport"
    ) {
      finalValue = value.toUpperCase();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  // =====================================================
  // TRAVELLERS
  // =====================================================

  const updateCount = (
    field:
      | "adults"
      | "children"
      | "infants"
      | "seniors",
    change: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Math.max(
        field === "adults" ? 1 : 0,
        prev[field] + change
      ),
    }));
  };

  // =====================================================
  // GENERATE AI TRIP
  // =====================================================

  const handleGenerateTrip = async () => {
    try {
      setLoading(true);

      const payload = {
        source_airport: formData.sourceAirport,
        destination_airport: formData.destinationAirport,
        departure_date: formData.departureDate,
        return_date: formData.returnDate,

        budget: formData.budget,

        adults: formData.adults,
        children: formData.children,
        infants: formData.infants,
        seniors: formData.seniors,

        cabin_class: formData.cabinClass,

        travel_style: formData.travelStyle,

        transport: formData.transport,

        food_preference: formData.foodPreference,

        interests: formData.interests,

        hotel_amenities: formData.hotelAmenities,
      };

      const response =
        await generateTrip(payload);

      if (response.success) {
        setTripResult(response.data);
        setGenerating(true);
      } else {
        alert(
          response.error ??
            "Failed to generate trip."
        );
      }
    } catch (error) {
      console.error(error);
      alert("Unable to generate AI trip.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {showResults && tripResult ? (
        <div className="w-full">
          <AIResults
            trip={tripResult}
            planner={formData}
          />
        </div>
      ) : (
        <div
          className="
            mx-auto
            w-full
            max-w-5xl
            rounded-3xl
           border
            border-border
            bg-card
            shadow-2xl
            p-5
            sm:p-6
            md:p-8
            lg:p-10
          "
        >
          {/* Header */}

          <div className="mb-8">

          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              AI Trip Planner
            </h2>

            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Build your perfect trip with AI.
            </p>

          </div>

          {/* Stepper */}

          <div className="overflow-x-auto pb-2">

            <Stepper currentStep={step} />

          </div>

          {/* Validation Banner */}

          {!canProceed && (

            <div className="mt-6 rounded-2xl border border-amber-300
            bg-amber-100/70
            dark:bg-amber-500/10 p-4">

              <p className="font-semibold text-amber-700 dark:text-amber-300">
                Please complete the required fields.
              </p>

              <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">

                {step === 1 &&
                  "Enter valid airports, travel dates and budget before continuing."}

                {step === 2 &&
                  "Infants cannot exceed the number of adults."}

                {step === 3 &&
                  "Choose at least one interest and one hotel amenity."}

              </p>

            </div>

          )}

          {/* Current Step */}

          <div className="mt-8">

            {step === 1 && (

            <BasicInfoStep
            formData={formData}
            handleChange={handleChange}
            setFormData={setFormData}
            />

            )}

            {step === 2 && (

              <TravelerStep
                formData={formData}
                handleChange={handleChange}
                updateCount={updateCount}
              />

            )}

            {step === 3 && (

              <PreferenceStep
                formData={formData}
                setFormData={setFormData}
              />

            )}

            {step === 4 && (

              <ReviewStep
                formData={formData}
              />

            )}

          </div>

          {/* Navigation */}

          <div
            className="
              mt-10
              flex
              flex-col
              gap-4
            "
          >

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
                  onClick={() => setStep((prev) => prev - 1)}
                  className="
                    order-2
                    w-full
                    rounded-xl
                    border
                    border-border
                    bg-card
                    text-foreground
                    hover:bg-accent
                    px-6
                    py-3
                    font-medium
                    shadow-sm
                    transition-all
                    

                    sm:order-1
                    sm:w-auto
                  "
                >
                  ← Back
                </button>

              ) : (

                <div className="hidden sm:block" />

              )}

              {step < 4 ? (

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
                  onClick={handleGenerateTrip}
                  disabled={loading}
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
                    ? "Generating AI Trip..."
                    : "✨ Generate AI Trip"}
                </button>

              )}

            </div>

            {!canProceed && (

              <div className="
              rounded-xl
              border
              border-amber-300
            
              bg-amber-100/70
              dark:bg-amber-500/10
            
              p-4
            
              text-sm
            
              text-amber-700
              dark:text-amber-300
            ">

                {step === 1 &&
                  "Please complete all trip details before continuing."}

                {step === 2 &&
                  "Each infant must travel with an adult."}

                {step === 3 &&
                  "Select at least one interest and one hotel amenity."}

              </div>

            )}

          </div>

        </div>
      )}

      {/* AI Generating Dialog */}

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
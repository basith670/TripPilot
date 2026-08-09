"use client";

import {
  Sparkles,
  Gem,
  Briefcase,
  Wallet,
  Bus,
  Utensils,
  Hotel,
  Heart,
} from "lucide-react";

interface PreferenceStepProps {
  formData: {
    travelStyle: string;
    transport: string;
    foodPreference: string;
    interests: string[];
    hotelAmenities: string[];
  };

  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const travelStyles = [
  {
    title: "Budget",
    value: "BUDGET",
    icon: Wallet,
    color:
      "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300",
  },
  {
    title: "Mid Range",
    value: "MID_RANGE",
    icon: Sparkles,
    color:
      "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  },
  {
    title: "Luxury",
    value: "LUXURY",
    icon: Gem,
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
  },
  {
    title: "Business",
    value: "BUSINESS",
    icon: Briefcase,
    color:
      "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
  },
];

const interests = [
  "Beach",
  "Adventure",
  "Food",
  "Shopping",
  "Nightlife",
  "Culture",
  "Nature",
  "Photography",
  "Theme Parks",
  "Hiking",
];

const transportOptions = [
  {
    label: "🤖 AI Recommendation",
    value: "AI",
  },
  {
    label: "🚕 Taxi",
    value: "TAXI",
  },
  {
    label: "🚇 Metro",
    value: "METRO",
  },
  {
    label: "🚌 Bus",
    value: "BUS",
  },
  {
    label: "🚗 Rental Car",
    value: "RENTAL_CAR",
  },
  {
    label: "🚶 Walking",
    value: "WALKING",
  },
];

const amenities = [
  "Breakfast",
  "WiFi",
  "Pool",
  "Gym",
  "Parking",
  "Refundable",
];

const foodPreferences = [
  "NONE",
  "VEGETARIAN",
  "VEGAN",
  "HALAL",
  "JAIN",
  "SEAFOOD",
];

export default function PreferenceStep({
  formData,
  setFormData,
}: PreferenceStepProps) {

  const toggleInterest = (interest: string) => {

    setFormData((prev: any) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(
            (i: string) => i !== interest
          )
        : [...prev.interests, interest],
    }));

  };

  const toggleAmenity = (amenity: string) => {

    setFormData((prev: any) => ({
      ...prev,
      hotelAmenities:
        prev.hotelAmenities.includes(
          amenity
        )
          ? prev.hotelAmenities.filter(
              (a: string) =>
                a !== amenity
            )
          : [
              ...prev.hotelAmenities,
              amenity,
            ],
    }));

  };

  return (

    <div className="space-y-10">

      {/* Header */}

      <div>

        <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-500/15 px-4 py-2">

          <Sparkles
            size={18}
            className="text-blue-600 dark:text-blue-400"
          />

          <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
            Step 3
          </span>

        </div>

        <h2 className="mt-4 text-2xl font-bold focus:ring-blue-500/20 sm:text-3xl">

          Travel Preferences

        </h2>

        <p className="mt-2 text-muted-foreground">

          Personalize your trip with travel
          style, interests and preferences.

        </p>

      </div>

      {/* Travel Style */}

      <div>

        <h3 className="mb-5 text-xl font-bold">

          Travel Style

        </h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {travelStyles.map((style) => {

            const Icon = style.icon;

            const selected =
              formData.travelStyle === style.value;

            return (

              <button
                key={style.value}
                type="button"
                onClick={() =>
                  setFormData((prev: any) => ({
                    ...prev,
                    travelStyle: style.value,
                  }))
                }
                className={`rounded-2xl border p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  selected
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-border bg-card"
                }`}
              >

                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
                    selected
                      ? "bg-white/20"
                      : style.color
                  }`}
                >

                  <Icon size={24} />

                </div>

                <h4 className="font-bold">

                  {style.title}

                </h4>

              </button>

            );

          })}

        </div>

      </div>

      {/* Interests */}

      <div>

        <div className="mb-5 flex items-center gap-2">

          <Heart
            size={20}
            className="text-red-500"
          />

          <h3 className="text-xl font-bold">

            Interests

          </h3>

        </div>

        <div className="flex flex-wrap gap-3">

          {interests.map((interest) => {

            const selected =
              formData.interests.includes(
                interest
              );

            return (

              <button
                key={interest}
                type="button"
                onClick={() =>
                  toggleInterest(
                    interest
                  )
                }
                className={`rounded-full px-5 py-3 font-medium transition-all ${
                  selected
                    ? "bg-blue-600 text-white shadow-lg"
                    : "border border-border bg-card hover:border-blue-500 hover:bg-accent"
                }`}
              >
                {interest}
              </button>

            );

          })}

        </div>

      </div>

      {/* Transport */}

      <div>

        <div className="mb-4 flex items-center gap-2">

          <Bus
            size={20}
            className="text-green-600"
          />

          <h3 className="text-xl font-bold">

            Preferred Transport

          </h3>

        </div>

        <select
          value={formData.transport}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              transport:
                e.target.value,
            }))
          }
          className="h-14 w-full rounded-2xl border border-border bg-card px-5 text-foreground focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
        >

          {transportOptions.map(
            (transport) => (

              <option
                key={transport.value}
                value={transport.value}
              >
                {transport.label}
              </option>

            )
          )}

        </select>

      </div>

      {/* Hotel Amenities */}

      <div>

        <div className="mb-5 flex items-center gap-2">

          <Hotel
            size={20}
            className="text-indigo-600"
          />

          <h3 className="text-xl font-bold">
            Hotel Amenities
          </h3>

        </div>

        <div className="flex flex-wrap gap-3">

          {amenities.map((amenity) => {

            const selected =
              formData.hotelAmenities.includes(
                amenity
              );

            return (

              <button
                key={amenity}
                type="button"
                onClick={() =>
                  toggleAmenity(amenity)
                }
                className={`rounded-full px-5 py-3 font-medium transition-all ${
                  selected
                    ? "bg-green-600 text-white shadow-lg"
                    : "border border-border bg-card hover:border-green-500 hover:bg-accent"
                }`}
              >
                {amenity}
              </button>

            );

          })}

        </div>

      </div>

      {/* Food Preference */}

      <div>

        <div className="mb-5 flex items-center gap-2">

          <Utensils
            size={20}
            className="text-orange-600"
          />

          <h3 className="text-xl font-bold">
            Food Preference
          </h3>

        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {foodPreferences.map((food) => {

            const selected =
              formData.foodPreference === food;

            return (

              <button
                key={food}
                type="button"
                onClick={() =>
                  setFormData((prev: any) => ({
                    ...prev,
                    foodPreference: food,
                  }))
                }
                className={`rounded-2xl border p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  selected
                    ? "border-orange-500 bg-orange-500 text-white"
                    : "border-border bg-card text-foreground"
                }`}
              >

                <h4 className="font-semibold">

                  {food.replaceAll(
                    "_",
                    " "
                  )}

                </h4>

              </button>

            );

          })}

        </div>

      </div>

      {/* AI Summary */}

      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 p-6 text-white shadow-xl">

        <h3 className="mb-5 text-2xl font-bold">

          🤖 AI Preference Summary

        </h3>

        <div className="grid gap-5 md:grid-cols-2">

          <div>

            <p className="text-sm text-blue-100">
              Travel Style
            </p>

            <p className="mt-1 font-semibold">
              {formData.travelStyle.replaceAll(
                "_",
                " "
              )}
            </p>

          </div>

          <div>

            <p className="text-sm text-blue-100">
              Transport
            </p>

            <p className="mt-1 font-semibold">
              {formData.transport.replaceAll(
                "_",
                " "
              )}
            </p>

          </div>

          <div>

            <p className="text-sm text-blue-100">
              Food
            </p>

            <p className="mt-1 font-semibold">
              {formData.foodPreference.replaceAll(
                "_",
                " "
              )}
            </p>

          </div>

          <div>

            <p className="text-sm text-blue-100">
              Amenities
            </p>

            <p className="mt-1 font-semibold">

              {formData.hotelAmenities.length
                ? formData.hotelAmenities.join(", ")
                : "No preference"}

            </p>

          </div>

        </div>

        <div className="mt-6">

          <p className="text-sm text-blue-100">

            Interests

          </p>

          <div className="mt-3 flex flex-wrap gap-2">

            {formData.interests.length ? (

              formData.interests.map(
                (interest: string) => (

                  <span
                    key={interest}
                    className="rounded-full bg-white/20 px-3 py-1 text-sm"
                  >
                    {interest}
                  </span>

                )
              )

            ) : (

              <span className="rounded-full bg-white/20 px-3 py-1 text-sm">

                No interests selected

              </span>

            )}

          </div>

        </div>

      </div>

    </div>

  );

}
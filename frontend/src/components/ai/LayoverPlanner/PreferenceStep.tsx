"use client";

import {
  Wallet,
  Coffee,
  ShoppingBag,
  Landmark,
  Trees,
  Briefcase,
  Sofa,
} from "lucide-react";

interface PreferenceStepProps {
  formData: {
    budget: string;
    travelStyle: string;

    visaRequired: boolean;
    checkedBaggage: boolean;
    loungeAccess: boolean;

    interests: string[];
  };

  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => void;

  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const styles = [
  {
    label: "Relax",
    value: "RELAX",
    icon: Sofa,
  },
  {
    label: "Food",
    value: "FOOD",
    icon: Coffee,
  },
  {
    label: "Shopping",
    value: "SHOPPING",
    icon: ShoppingBag,
  },
  {
    label: "Explore",
    value: "EXPLORE",
    icon: Landmark,
  },
  {
    label: "Nature",
    value: "NATURE",
    icon: Trees,
  },
  {
    label: "Business",
    value: "BUSINESS",
    icon: Briefcase,
  },
];

const interests = [
  "Local Food",
  "Duty Free",
  "Museums",
  "Photography",
  "Culture",
  "Beaches",
  "Shopping",
  "Nightlife",
  "Parks",
  "Architecture",
];

export default function PreferenceStep({
  formData,
  handleChange,
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

  return (
    <div className="space-y-10">

      {/* Header */}

      <div>

        <h2 className="text-3xl font-bold">
          Preferences
        </h2>

        <p className="mt-2 text-gray-500">
          Tell AI how you'd like to spend your layover.
        </p>

      </div>

      {/* Budget */}

      <div>

        <label className="mb-2 block text-sm font-semibold">

          Budget

        </label>

        <div className="relative">

          <Wallet
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600"
          />

          <input
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="10000"
            className="
              h-14
              w-full
              rounded-2xl
              border
              pl-12
              pr-5
            "
          />

        </div>

      </div>

      {/* Travel Style */}

      <div>

        <h3 className="mb-4 text-xl font-semibold">

          Travel Style

        </h3>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">

          {styles.map((style) => {

            const Icon = style.icon;

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
                className={`rounded-2xl border p-5 transition ${
                  formData.travelStyle === style.value
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "hover:border-blue-400"
                }`}
              >

                <Icon
                  size={28}
                  className="mx-auto mb-3"
                />

                <p className="font-semibold">

                  {style.label}

                </p>

              </button>

            );

          })}

        </div>

      </div>

      {/* Travel Options */}

      <div>

        <h3 className="mb-4 text-xl font-semibold">

          Trip Options

        </h3>

        <div className="space-y-4">

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              name="loungeAccess"
              checked={formData.loungeAccess}
              onChange={handleChange}
            />

            Lounge Access Available

          </label>

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              name="checkedBaggage"
              checked={formData.checkedBaggage}
              onChange={handleChange}
            />

            Checked Baggage

          </label>

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              name="visaRequired"
              checked={formData.visaRequired}
              onChange={handleChange}
            />

            Transit Visa Required

          </label>

        </div>

      </div>

      {/* Interests */}

      <div>

        <h3 className="mb-4 text-xl font-semibold">

          Interests

        </h3>

        <div className="flex flex-wrap gap-3">

          {interests.map((interest) => (

            <button
              key={interest}
              type="button"
              onClick={() =>
                toggleInterest(interest)
              }
              className={`rounded-full border px-5 py-3 transition ${
                formData.interests.includes(
                  interest
                )
                  ? "bg-blue-600 text-white"
                  : "hover:border-blue-500"
              }`}
            >
              {interest}
            </button>

          ))}

        </div>

      </div>

    </div>
  );
}
"use client";

import {
  Wallet,
  Coffee,
  ShoppingBag,
  Landmark,
  Trees,
  Briefcase,
  Sofa,
  Check,
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

  setFormData: React.Dispatch<
    React.SetStateAction<any>
  >;
}

const styles = [
  {
    label: "Relax",
    value: "RELAX",
    icon: Sofa,
    color: "bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/30",
  },
  {
    label: "Food",
    value: "FOOD",
    icon: Coffee,
    color: "bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30",
  },
  {
    label: "Shopping",
    value: "SHOPPING",
    icon: ShoppingBag,
    color: "bg-pink-50 dark:bg-pink-500/10 border-pink-200 dark:border-pink-500/30",
  },
  {
    label: "Explore",
    value: "EXPLORE",
    icon: Landmark,
    color: "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30",
  },
  {
    label: "Nature",
    value: "NATURE",
    icon: Trees,
    color: "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30",
  },
  {
    label: "Business",
    value: "BUSINESS",
    icon: Briefcase,
    color: "bg-slate-50 dark:bg-slate-500/10 border-slate-200 dark:border-slate-500/30",
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

      interests: prev.interests.includes(
        interest
      )
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

        <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-500/15 px-4 py-2">

          <Coffee
            size={18}
            className="text-blue-600 dark:text-blue-400"
          />

          <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
            Step 2 of 3
          </span>

        </div>

        <h2 className="mt-5 text-3xl font-bold">
          Travel Preferences
        </h2>

        <p className="mt-2 text-muted-foreground">
          Personalize your layover experience.
        </p>

      </div>

      {/* Budget */}

      <div className="rounded-3xl border border-emerald-100 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 p-6">

        <h3 className="mb-5 text-lg font-semibold text-emerald-900 dark:text-emerald-300">
          Budget
        </h3>

        <div className="relative">

          <Wallet
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400"
          />

          <span className="absolute left-12 top-1/2 -translate-y-1/2 font-semibold text-muted-foreground">
            ₹
          </span>

          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="5000"
            className="
              h-14
              w-full
              rounded-2xl
              border
              border-border
              bg-card
              pl-16
              pr-5
              transition
              focus:border-emerald-500
              focus:ring-4
              focus:ring-emerald-500/20
            "
          />

        </div>

      </div>

      {/* Travel Style */}

      <div className="rounded-3xl border border-border bg-muted p-6">

        <h3 className="mb-6 text-lg font-semibold">
          Travel Style
        </h3>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {styles.map((style) => {

            const Icon = style.icon;

            const selected =
              formData.travelStyle ===
              style.value;

            return (

              <button
                key={style.value}
                type="button"
                onClick={() =>
                  setFormData((prev: any) => ({
                    ...prev,
                    travelStyle:
                      style.value,
                  }))
                }
                className={`
                  relative
                  rounded-3xl
                  border-2
                  p-6
                  transition-all
                  duration-300

                  ${
                    selected
                      ? "border-blue-600 bg-blue-600 text-white shadow-xl"
                      : `${style.color} hover:-translate-y-1 hover:shadow-lg`
                  }
                `}
              >

                {selected && (

                  <Check
                    size={18}
                    className="absolute right-4 top-4"
                  />

                )}

                <Icon
                  size={34}
                  className="mx-auto mb-4"
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

      <div className="rounded-3xl border border-border bg-muted p-6">

        <h3 className="mb-6 text-lg font-semibold">
          Travel Options
        </h3>

        <div className="space-y-5">

          <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-border bg-card p-5 transition hover:border-blue-400">

            <div>

              <p className="font-semibold">
                Lounge Access
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                AI will include lounge recommendations.
              </p>

            </div>

            <input
              type="checkbox"
              name="loungeAccess"
              checked={formData.loungeAccess}
              onChange={handleChange}
              className="h-5 w-5 accent-blue-600"
            />

          </label>

          <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-border bg-card p-5 transition hover:border-blue-400">

            <div>

              <p className="font-semibold">
                Checked Baggage
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Include baggage collection time.
              </p>

            </div>

            <input
              type="checkbox"
              name="checkedBaggage"
              checked={formData.checkedBaggage}
              onChange={handleChange}
              className="h-5 w-5 accent-blue-600"
            />

          </label>

          <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-border bg-card p-5 transition hover:border-blue-400">

            <div>

              <p className="font-semibold">
                Transit Visa Required
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Reserve time for immigration.
              </p>

            </div>

            <input
              type="checkbox"
              name="visaRequired"
              checked={formData.visaRequired}
              onChange={handleChange}
              className="h-5 w-5 accent-blue-600"
            />

          </label>

        </div>

      </div>

      {/* Interests */}

      <div className="rounded-3xl border border-border bg-muted p-6">

        <h3 className="mb-2 text-lg font-semibold">
          Interests
        </h3>

        <p className="mb-6 text-sm text-muted-foreground">
          Select everything you'd like AI to include.
        </p>

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
                  toggleInterest(interest)
                }
                className={`
                  rounded-full
                  border
                  border-border
                  px-5
                  py-3
                  font-medium
                  transition-all

                  ${
                    selected
                      ? "border-blue-600 bg-blue-600 text-white shadow-lg"
                      : "bg-card hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                  }
                `}
              >
                {interest}
              </button>

            );

          })}

        </div>

      </div>

    </div>
  );
}
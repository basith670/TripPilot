"use client";

import {
  Plane,
  CalendarDays,
  Wallet,
  Users,
  Star,
  Utensils,
  Car,
  Hotel,
  Sparkles,
  MapPin,
} from "lucide-react";

interface ReviewStepProps {
  formData: {
    sourceAirport: string;
    destinationAirport: string;
    departureDate: string;
    returnDate: string;
    budget: string;

    adults: number;
    children: number;
    infants: number;
    seniors: number;

    cabinClass: string;

    travelStyle: string;
    transport: string;
    foodPreference: string;

    interests: string[];
    hotelAmenities: string[];
  };
}

export default function ReviewStep({
  formData,
}: ReviewStepProps) {
  const totalTravellers =
    formData.adults +
    formData.children +
    formData.infants +
    formData.seniors;

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="text-center">

        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-500/15 px-4 py-2 text-blue-700 dark:text-blue-300">

          <Sparkles size={18} />

          <span className="font-semibold">
            AI Trip Summary
          </span>

        </div>

        <h2 className="text-3xl font-black md:text-4xl">

          Review Your Journey

        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">

          Everything looks good. Review your travel
          preferences before our AI builds the perfect
          itinerary.

        </p>

      </div>

      {/* Top Cards */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Route */}

        <div className="rounded-3xl border border-blue-100 dark:border-blue-500/20 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10 p-7 shadow-sm">

          <div className="flex items-center gap-3">

            <Plane className="text-blue-600 dark:text-blue-400" />

            <h3 className="text-xl font-bold">

              Flight Route

            </h3>

          </div>

          <div className="mt-6">

            <p className="text-4xl font-black text-blue-700 dark:text-blue-300">

              {formData.sourceAirport || "--"}

              <span className="mx-3">

                →

              </span>

              {formData.destinationAirport || "--"}

            </p>

          </div>

          <div className="mt-6 flex flex-wrap gap-4">

            <div className="flex items-center gap-2">

              <CalendarDays
                size={18}
                className="text-blue-500 dark:text-blue-400"
              />

              <span>

                {formData.departureDate || "--"}

              </span>

            </div>

            <div className="flex items-center gap-2">

              <CalendarDays
                size={18}
                className="text-blue-500 dark:text-blue-400"
              />

              <span>

                {formData.returnDate || "--"}

              </span>

            </div>

          </div>

        </div>

        {/* Budget */}

        <div className="rounded-3xl border border-green-100 dark:border-green-500/20 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 p-7 shadow-sm">

          <div className="flex items-center gap-3">

            <Wallet className="text-green-600 dark:text-green-400" />

            <h3 className="text-xl font-bold">

              Trip Budget

            </h3>

          </div>

          <p className="mt-6 text-5xl font-black text-green-700 dark:text-green-300">

            ₹
            {Number(
              formData.budget || 0
            ).toLocaleString("en-IN")}

          </p>

          <p className="mt-3 text-muted-foreground">

            AI will optimize your flights,
            accommodation, food and activities
            within this budget.

          </p>

        </div>

      </div>

      {/* Middle Cards */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Travellers */}

        <div className="rounded-3xl border border-border bg-card p-7 shadow-sm">

          <div className="flex items-center gap-3">

            <Users className="text-purple-600 dark:text-purple-400" />

            <h3 className="text-xl font-bold">

              Travellers

            </h3>

          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">

            <InfoCard
              label="Adults"
              value={formData.adults}
            />

            <InfoCard
              label="Children"
              value={formData.children}
            />

            <InfoCard
              label="Infants"
              value={formData.infants}
            />

            <InfoCard
              label="Seniors"
              value={formData.seniors}
            />

          </div>

          <div className="mt-6 rounded-2xl bg-purple-50 dark:bg-purple-500/15 p-4">

            <p className="text-sm text-purple-700 dark:text-purple-300">

              Total Travellers

            </p>

            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">

              {totalTravellers}

            </p>

          </div>

        </div>

        {/* Preferences */}

        <div className="rounded-3xl border border-border bg-card p-7 shadow-sm">

          <div className="flex items-center gap-3">

            <Star className="text-yellow-500 dark:text-yellow-400" />

            <h3 className="text-xl font-bold">

              Preferences

            </h3>

          </div>

          <div className="mt-6 space-y-5">

            <PreferenceRow
              icon={<Plane size={18} />}
              title="Cabin Class"
              value={formData.cabinClass.replaceAll(
                "_",
                " "
              )}
            />

            <PreferenceRow
              icon={<MapPin size={18} />}
              title="Travel Style"
              value={formData.travelStyle.replaceAll(
                "_",
                " "
              )}
            />

            <PreferenceRow
              icon={<Car size={18} />}
              title="Transport"
              value={formData.transport.replaceAll(
                "_",
                " "
              )}
            />

            <PreferenceRow
              icon={<Utensils size={18} />}
              title="Food"
              value={formData.foodPreference.replaceAll(
                "_",
                " "
              )}
            />

          </div>

        </div>

      </div>

      {/* Interests */}

      <div className="rounded-3xl border border-border bg-card p-7 shadow-sm">

        <h3 className="mb-6 text-xl font-bold">

          🎯 Interests

        </h3>

        <div className="flex flex-wrap gap-3">

          {formData.interests.length ? (

            formData.interests.map((interest) => (

              <span
                key={interest}
                className="rounded-full bg-blue-100 dark:bg-blue-500/15 px-4 py-2 font-medium text-blue-700 dark:text-blue-300"
              >
                {interest}
              </span>

            ))

          ) : (

            <p className="text-muted-foreground">

              No interests selected.

            </p>

          )}

        </div>

      </div>

      {/* Hotel */}

      <div className="rounded-3xl border border-border bg-card p-7 shadow-sm">

        <div className="mb-6 flex items-center gap-3">

          <Hotel className="text-indigo-600 dark:text-indigo-400" />

          <h3 className="text-xl font-bold">

            Preferred Hotel Amenities

          </h3>

        </div>

        <div className="flex flex-wrap gap-3">

          {formData.hotelAmenities.length ? (

            formData.hotelAmenities.map((item) => (

              <span
                key={item}
                className="rounded-full bg-green-100 dark:bg-green-500/15 px-4 py-2 font-medium text-green-700 dark:text-green-300"
              >
                {item}
              </span>

            ))

          ) : (

            <p className="text-muted-foreground">

              No hotel preferences selected.

            </p>

          )}

        </div>

      </div>

      {/* AI Summary */}

      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 p-8 text-white shadow-xl">

        <div className="flex items-center gap-3">

          <Sparkles />

          <h3 className="text-2xl font-bold">

            AI Ready

          </h3>

        </div>

        <p className="mt-5 text-blue-100 leading-8">

          TripPilot AI has collected all your
          preferences and is ready to generate a
          personalized itinerary with flights,
          hotels, restaurants, attractions,
          transportation, budget optimization,
          travel tips and packing recommendations.

        </p>

      </div>

    </div>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-muted p-4">

      <p className="text-sm text-muted-foreground">

        {label}

      </p>

      <p className="mt-2 text-2xl font-bold">

        {value}

      </p>

    </div>
  );
}

function PreferenceRow({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-muted p-4">

      <div className="flex items-center gap-3">

        <div className="text-blue-600 dark:text-blue-400">

          {icon}

        </div>

        <span className="font-medium">

          {title}

        </span>

      </div>

      <span className="font-semibold text-foreground">

        {value}

      </span>

    </div>
  );
}
"use client";

import {
  Users,
  User,
  Baby,
  PersonStanding,
  Plane,
  Minus,
  Plus,
} from "lucide-react";

interface TravelerStepProps {
  formData: {
    adults: number;
    children: number;
    infants: number;
    seniors: number;
    cabinClass: string;
  };

  handleChange: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void;

  updateCount: (
    field:
      | "adults"
      | "children"
      | "infants"
      | "seniors",
    change: number
  ) => void;
}

export default function TravelerStep({
  formData,
  handleChange,
  updateCount,
}: TravelerStepProps) {
  const travellers = [
    {
      title: "Adults",
      field: "adults",
      subtitle: "Age 12+",
      icon: User,
    },
    {
      title: "Children",
      field: "children",
      subtitle: "Age 2 - 11",
      icon: Users,
    },
    {
      title: "Infants",
      field: "infants",
      subtitle: "Below 2 years",
      icon: Baby,
    },
    {
      title: "Senior Citizens",
      field: "seniors",
      subtitle: "Age 60+",
      icon: PersonStanding,
    },
  ];

  const totalTravellers =
    formData.adults +
    formData.children +
    formData.infants +
    formData.seniors;

  return (
    <div>
      {/* Header */}

      <div className="mb-8">

        <div
          className="
            inline-flex
            items-center
            gap-2

            rounded-full

            bg-blue-100
            dark:bg-blue-500/15

            px-4
            py-2
          "
        >
          <Users
            size={18}
            className="text-blue-600 dark:text-blue-400"
          />

          <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
            Step 2
          </span>

        </div>

        <h3 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
          Travellers
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
          Tell AI who will be travelling on this trip.
        </p>

      </div>

      {/* Total */}

      <div
        className="
          mb-8

          rounded-2xl

          bg-gradient-to-r
          from-blue-600
          to-cyan-500

          p-5

          text-white

          shadow-xl
        "
      >
        <p className="text-sm opacity-90">
          Total Travellers
        </p>

        <h2 className="mt-2 text-4xl font-black">
          {totalTravellers}
        </h2>

      </div>

      {/* Traveller Cards */}

      <div className="space-y-5">

        {travellers.map((item) => {

          const Icon = item.icon;

          return (
            <div
              key={item.field}
              className="
                flex
                flex-col
                gap-5

                rounded-2xl

                border
                border-border

                bg-card

                p-5

                shadow-sm

                transition-all
                duration-300

                hover:shadow-lg

                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <div className="flex items-center gap-4">

                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center

                    rounded-2xl

                    bg-blue-100
                    dark:bg-blue-500/15
                  "
                >
                  <Icon
                    size={24}
                    className="text-blue-600 dark:text-blue-400"
                  />

                </div>

                <div>

                  <h4 className="text-lg font-bold text-foreground">
                    {item.title}
                  </h4>

                  <p className="text-sm text-muted-foreground">
                    {item.subtitle}
                  </p>

                </div>

              </div>

              {/* Counter */}

              <div className="flex items-center justify-center gap-5">

                <button
                  type="button"
                  onClick={() =>
                    updateCount(
                      item.field as
                        | "adults"
                        | "children"
                        | "infants"
                        | "seniors",
                      -1
                    )
                  }
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center

                    rounded-full

                    border
                    border-border

                    bg-background

                    text-foreground

                    transition-all

                    hover:bg-accent
                  "
                >
                  <Minus size={18} />
                </button>

                <span className="w-10 text-center text-2xl font-bold text-foreground">
                  {
                    formData[
                      item.field as keyof typeof formData
                    ]
                  }
                </span>

                <button
                  type="button"
                  onClick={() =>
                    updateCount(
                      item.field as
                        | "adults"
                        | "children"
                        | "infants"
                        | "seniors",
                      1
                    )
                  }
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center

                    rounded-full

                    bg-blue-600

                    text-white

                    transition-all

                    hover:scale-105
                    hover:bg-blue-700
                  "
                >
                  <Plus size={18} />
                </button>

              </div>

            </div>
          );

        })}

      </div>

      {/* Cabin Class */}

      <div className="mt-10">

        <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">

          <Plane
            size={18}
            className="text-blue-600 dark:text-blue-400"
          />

          Cabin Class

        </label>

        <select
          name="cabinClass"
          value={formData.cabinClass}
          onChange={handleChange}
          className="
            h-14
            w-full

            rounded-2xl

            border
            border-border

            bg-background

            px-5

            text-base
            text-foreground

            transition-all
            duration-300

            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-500/20
            focus:outline-none
          "
        >
          <option value="ECONOMY">
            Economy
          </option>

          <option value="PREMIUM_ECONOMY">
            Premium Economy
          </option>

          <option value="BUSINESS">
            Business
          </option>

          <option value="FIRST">
            First Class
          </option>

        </select>

      </div>

    </div>
  );
}
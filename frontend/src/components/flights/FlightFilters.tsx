"use client";

import {
  Search,
  Filter,
} from "lucide-react";

interface FlightFiltersProps {
  search: string;
  setSearch: (value: string) => void;

  trip: string;
  setTrip: (value: string) => void;

  status: string;
  setStatus: (value: string) => void;

  sort: string;
  setSort: (value: string) => void;

  trips: {
    id: number;
    label: string;
  }[];
}

export default function FlightFilters({
  search,
  setSearch,
  trip,
  setTrip,
  status,
  setStatus,
  sort,
  setSort,
  trips,
}: FlightFiltersProps) {
  return (
    <section
      className="
        rounded-[32px]

        border
        border-border

        bg-card

        p-7

        shadow-xl
      "
    >
      <div
        className="
          grid
          gap-5

          lg:grid-cols-[2fr,1.3fr,1fr,1fr,auto]
        "
      >
        {/* Search */}

        <div className="relative">

          <Search
            size={18}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-muted-foreground
            "
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search airline, flight number..."
            className="
              w-full

              rounded-2xl

              border
              border-border

              bg-background

              py-4
              pl-12
              pr-4

              text-foreground

              outline-none

              transition-all
              duration-300

              focus:border-cyan-500
              focus:ring-2
              focus:ring-cyan-500/20
            "
          />

        </div>

        {/* Trip */}

        <select
          value={trip}
          onChange={(e) =>
            setTrip(e.target.value)
          }
          className="
            rounded-2xl

            border
            border-border

            bg-background

            px-4
            py-4

            text-foreground

            outline-none

            transition-all
            duration-300

            focus:border-cyan-500
            focus:ring-2
            focus:ring-cyan-500/20
          "
        >
          <option value="all">
            All Trips
          </option>

          {trips.map((item) => (
            <option
              key={item.id}
              value={String(item.id)}
            >
              {item.label}
            </option>
          ))}
        </select>

        {/* Status */}

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
          className="
            rounded-2xl

            border
            border-border

            bg-background

            px-4
            py-4

            text-foreground

            outline-none

            transition-all
            duration-300

            focus:border-cyan-500
            focus:ring-2
            focus:ring-cyan-500/20
          "
        >
          <option value="all">
            All Status
          </option>

          <option value="scheduled">
            Scheduled
          </option>

          <option value="boarding">
            Boarding
          </option>

          <option value="delayed">
            Delayed
          </option>

          <option value="landed">
            Landed
          </option>

          <option value="cancelled">
            Cancelled
          </option>

        </select>

        {/* Sort */}

        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
          className="
            rounded-2xl

            border
            border-border

            bg-background

            px-4
            py-4

            text-foreground

            outline-none

            transition-all
            duration-300

            focus:border-cyan-500
            focus:ring-2
            focus:ring-cyan-500/20
          "
        >
          <option value="latest">
            Latest
          </option>

          <option value="oldest">
            Oldest
          </option>

          <option value="price">
            Highest Price
          </option>

          <option value="duration">
            Duration
          </option>

        </select>

        {/* Filter Button */}

        <button
          className="
            inline-flex

            items-center
            justify-center
            gap-2

            rounded-2xl

            border
            border-border

            bg-background

            px-6
            py-4

            font-semibold

            text-foreground

            transition-all
            duration-300

            hover:bg-muted
          "
        >
          <Filter size={18} />

          Filters

        </button>

      </div>
    </section>
  );
}
"use client";

import {
  Search,
  SlidersHorizontal,
} from "lucide-react";

interface Props {
  search: string;
  setSearch: (value: string) => void;

  status: string;
  setStatus: (value: string) => void;

  sort: string;
  setSort: (value: string) => void;
}

export default function ItineraryFilters({
  search,
  setSearch,
  status,
  setStatus,
  sort,
  setSort,
}: Props) {
  return (
    <div
      className="
        rounded-[32px]

        border
        border-border

        bg-card/90

        p-7

        shadow-xl

        backdrop-blur-xl
      "
    >
      <div className="flex flex-col gap-5 xl:flex-row">
        {/* Search */}

        <div className="relative flex-1">

          <Search
            size={18}
            className="
              absolute
              left-5
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
            placeholder="Search itineraries..."
            className="
              w-full

              rounded-2xl

              border
              border-border

              bg-background

              py-3.5
              pl-12
              pr-5

              text-foreground

              outline-none

              transition-all

              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-500/10
            "
          />

        </div>

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

            px-5
            py-3.5

            text-foreground

            outline-none

            transition

            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-500/10
          "
        >
          <option value="all">
            All Status
          </option>

          <option value="planning">
            Planning
          </option>

          <option value="confirmed">
            Confirmed
          </option>

          <option value="completed">
            Completed
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

            px-5
            py-3.5

            text-foreground

            outline-none

            transition

            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-500/10
          "
        >
          <option value="latest">
            Latest
          </option>

          <option value="oldest">
            Oldest
          </option>

          <option value="budget">
            Highest Budget
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

            bg-gradient-to-r
            from-blue-600
            via-cyan-600
            to-indigo-600

            px-6
            py-3.5

            font-semibold

            text-white

            shadow-lg

            transition-all

            hover:-translate-y-0.5
            hover:shadow-xl
          "
        >
          <SlidersHorizontal size={18} />

          Filters

        </button>

      </div>
    </div>
  );
}
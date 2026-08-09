"use client";

import { Search, SlidersHorizontal } from "lucide-react";

interface TripsFiltersProps {
  search: string;
  setSearch: (value: string) => void;

  status: string;
  setStatus: (value: string) => void;

  sort: string;
  setSort: (value: string) => void;
}

export default function TripsFilters({
  search,
  setSearch,
  status,
  setStatus,
  sort,
  setSort,
}: TripsFiltersProps) {
  return (
    <section
      className="
        mt-10
        rounded-[28px]
        border
        border-border
        bg-card/80
        p-6
        shadow-xl
        backdrop-blur-xl
      "
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        {/* Search */}

        <div className="relative w-full lg:max-w-md">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search destination, airport..."
            className="
              w-full
              rounded-2xl
              border
              border-border
              bg-muted
              py-3
              pl-12
              pr-4
              text-foreground
              placeholder:text-muted-foreground
              outline-none
              transition-all
              duration-300
              focus:border-blue-500
              focus:bg-card
              focus:ring-4
              focus:ring-blue-500/20
            "
          />

        </div>

        {/* Filters */}

        <div className="flex flex-wrap items-center gap-4">

          {/* Status */}

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="
              rounded-2xl
              border
              border-border
              bg-card
              px-5
              py-3
              text-foreground
              outline-none
              transition-all
              duration-300
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-500/20
            "
          >
            <option value="all">All Status</option>
            <option value="planning">Planning</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Sort */}

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="
              rounded-2xl
              border
              border-border
              bg-card
              px-5
              py-3
              text-foreground
              outline-none
              transition-all
              duration-300
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-500/20
            "
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
            <option value="budget">Budget</option>
          </select>

          {/* Filter Button */}

          <button
            type="button"
            className="
              flex
              items-center
              gap-2
              rounded-2xl
              border
              border-border
              bg-muted
              px-5
              py-3
              text-foreground
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:border-blue-500
              hover:bg-blue-500/10
              hover:text-blue-600
              dark:hover:text-blue-400
            "
          >
            <SlidersHorizontal size={18} />

            Filters
          </button>

        </div>

      </div>
    </section>
  );
}
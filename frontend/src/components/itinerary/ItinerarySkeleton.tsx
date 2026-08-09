"use client";

export default function ItinerarySkeleton() {
  return (
    <div className="space-y-8">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="
            overflow-hidden

            rounded-[32px]

            border
            border-border

            bg-card

            shadow-xl
          "
        >
          {/* Top Accent */}

          <div
            className="
              h-2

              animate-pulse

              bg-gradient-to-r
              from-blue-600
              via-cyan-500
              to-indigo-600
            "
          />

          <div
            className="
              animate-pulse

              p-8
            "
          >
            {/* Header */}

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

              <div className="space-y-4">

                <div className="h-10 w-72 rounded-2xl bg-muted" />

                <div className="h-5 w-96 max-w-full rounded-xl bg-muted/70" />

              </div>

              <div className="h-11 w-32 rounded-full bg-muted" />

            </div>

            {/* Statistics */}

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4].map((card) => (
                <div
                  key={card}
                  className="
                    rounded-2xl

                    border
                    border-border

                    bg-background

                    p-5
                  "
                >
                  <div className="flex items-center gap-4">

                    <div className="h-12 w-12 rounded-2xl bg-muted" />

                    <div className="flex-1 space-y-3">

                      <div className="h-3 w-20 rounded bg-muted" />

                      <div className="h-5 w-24 rounded bg-muted" />

                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* Notes */}

            <div
              className="
                mt-8

                rounded-2xl

                border
                border-border

                bg-background

                p-6
              "
            >
              <div className="space-y-3">

                <div className="h-4 w-full rounded bg-muted" />

                <div className="h-4 w-5/6 rounded bg-muted" />

                <div className="h-4 w-3/4 rounded bg-muted" />

              </div>
            </div>

            {/* Footer */}

            <div
              className="
                mt-8

                flex
                flex-col
                gap-5

                border-t
                border-border

                pt-6

                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div className="space-y-3">

                <div className="h-3 w-16 rounded bg-muted" />

                <div className="h-5 w-28 rounded bg-muted" />

              </div>

              <div className="h-12 w-44 rounded-2xl bg-muted" />

            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
"use client";

export default function FlightSkeleton() {
  return (
    <div className="space-y-8">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="
            animate-pulse

            rounded-[32px]

            border
            border-slate-200

            bg-white

            p-8

            shadow-lg
          "
        >
          {/* Header */}

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-5">

              <div className="h-16 w-16 rounded-2xl bg-slate-200" />

              <div>

                <div className="h-6 w-44 rounded bg-slate-200" />

                <div className="mt-3 h-4 w-28 rounded bg-slate-200" />

              </div>

            </div>

            <div className="h-8 w-24 rounded-full bg-slate-200" />

          </div>

          {/* Timeline */}

          <div className="my-10 grid grid-cols-3 items-center">

            <div>

              <div className="h-10 w-20 rounded bg-slate-200" />

              <div className="mt-3 h-5 w-14 rounded bg-slate-200" />

            </div>

            <div className="flex items-center">

              <div className="h-px flex-1 bg-slate-200" />

              <div className="mx-4 h-10 w-10 rounded-full bg-slate-200" />

              <div className="h-px flex-1 bg-slate-200" />

            </div>

            <div className="text-right">

              <div className="ml-auto h-10 w-20 rounded bg-slate-200" />

              <div className="mt-3 ml-auto h-5 w-14 rounded bg-slate-200" />

            </div>

          </div>

          {/* Footer */}

          <div className="flex items-center justify-between border-t pt-6">

            <div className="flex gap-4">

              <div className="h-16 w-28 rounded-xl bg-slate-200" />

              <div className="h-16 w-28 rounded-xl bg-slate-200" />

              <div className="h-16 w-28 rounded-xl bg-slate-200" />

            </div>

            <div className="flex gap-3">

              <div className="h-12 w-24 rounded-xl bg-slate-200" />

              <div className="h-12 w-24 rounded-xl bg-slate-200" />

              <div className="h-12 w-24 rounded-xl bg-slate-200" />

            </div>

          </div>

        </div>
      ))}
    </div>
  );
}
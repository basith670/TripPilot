"use client";

import { useRef } from "react";
import { createPortal } from "react-dom";
import { useReactToPrint } from "react-to-print";

import BoardingPass from "./BoardingPass";

import { Flight } from "@/types/flight";

interface BoardingPassModalProps {
  isOpen: boolean;
  flight: Flight | null;
  onClose: () => void;
}

export default function BoardingPassModal({
  isOpen,
  flight,
  onClose,
}: BoardingPassModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: flight
      ? `${flight.airline_name}-${flight.flight_number}`
      : "Boarding-Pass",
  });

  if (!isOpen || !flight) {
    return null;
  }

  return createPortal(
    <div
      onClick={onClose}
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center

        bg-black/70

        p-4

        backdrop-blur-md
      "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          flex

          h-[95vh]
          w-full
          max-w-6xl

          flex-col

          overflow-hidden

          rounded-[32px]

          border
          border-slate-200
          dark:border-slate-800

          bg-white
          dark:bg-slate-950

          shadow-2xl
        "
      >
        {/* Header */}

        <div
          className="
            flex
            items-center
            justify-between

            border-b
            border-slate-200
            dark:border-slate-800

            bg-white
            dark:bg-slate-950

            px-6
            py-5
          "
        >
          <div>

            <h2
              className="
                text-2xl
                font-bold

                text-slate-900
                dark:text-white
              "
            >
              Boarding Pass
            </h2>

            <p
              className="
                mt-1

                text-sm

                text-slate-500
                dark:text-slate-400
              "
            >
              Print or save your boarding pass as a PDF.
            </p>

          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={handlePrint}
              className="
                rounded-xl

                bg-blue-600

                px-5
                py-3

                font-semibold
                text-white

                transition-all

                hover:bg-blue-700
                hover:shadow-lg
              "
            >
              🖨 Print
            </button>

            <button
              onClick={onClose}
              className="
                rounded-xl

                border
                border-slate-300
                dark:border-slate-700

                bg-white
                dark:bg-slate-900

                px-5
                py-3

                font-semibold

                text-slate-700
                dark:text-slate-200

                transition-all

                hover:bg-slate-100
                dark:hover:bg-slate-800
              "
            >
              Close
            </button>

          </div>

        </div>

        {/* Printable Area */}

        <div
          className="
            flex-1

            overflow-y-auto

            bg-slate-100
            dark:bg-slate-900

            p-6
          "
        >
          <div
            ref={printRef}
            className="mx-auto max-w-5xl"
          >
            <BoardingPass flight={flight} />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
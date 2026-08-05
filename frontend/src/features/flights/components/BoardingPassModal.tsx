"use client";

import { useRef } from "react";
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

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b bg-white px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Boarding Pass
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Print or save your boarding pass as a PDF.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              🖨 Print
            </button>

            <button
              onClick={onClose}
              className="rounded-xl border border-gray-300 px-5 py-3 font-medium transition hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </div>

        {/* Printable Area */}

        <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <div
            ref={printRef}
            className="mx-auto max-w-5xl"
          >
            <BoardingPass flight={flight} />
          </div>
        </div>
      </div>
    </div>
  );
}
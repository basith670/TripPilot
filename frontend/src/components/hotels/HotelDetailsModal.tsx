"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { Hotel } from "@/types/hotel";

interface HotelDetailsModalProps {
  isOpen: boolean;

  hotel: Hotel | null;

  onClose: () => void;

  onSelect?: () => void;
}

export default function HotelDetailsModal({
  isOpen,
  hotel,
  onClose,
  onSelect,
}: HotelDetailsModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  if (!mounted || !isOpen || !hotel) {
    return null;
  }

  const checkIn = new Date(
    hotel.check_in
  );

  const checkOut = new Date(
    hotel.check_out
  );

  const getStatusColor = () => {
    switch (hotel.status) {
      case "RESERVED":
        return "bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300";

      case "CHECKED_IN":
        return "bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-300";

      case "CHECKED_OUT":
        return "bg-muted text-muted-foreground";

      default:
        return "bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-300";
    }
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-card shadow-2xl"
      >
        {/* Header */}

        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-card px-6 py-5">

          <div>

            <h2 className="text-2xl font-bold text-foreground">
              Hotel Details
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              View your hotel reservation details.
            </p>

          </div>

          <button
            onClick={onClose}
            className="text-3xl text-muted-foreground transition hover:text-red-600 dark:hover:text-red-400"
          >
            ×
          </button>

        </div>

        {/* Scroll Body */}

        <div className="flex-1 overflow-y-auto p-6">

          {/* Hotel Overview */}

          <div className="mb-8 overflow-hidden rounded-3xl border border-border">

            <img
              src={hotel.image}
              alt={hotel.name}
              className="h-72 w-full object-cover"
            />

            <div className="p-6">

              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                <div>

                  <h3 className="text-3xl font-bold text-foreground">
                    {hotel.name}
                  </h3>

                  <p className="mt-2 text-lg text-amber-500 dark:text-amber-400">
                    ⭐ {hotel.rating} / 5
                  </p>

                  <p className="mt-4 text-muted-foreground">
                    {hotel.address}
                  </p>

                  <p className="text-muted-foreground">
                    {hotel.city}, {hotel.country}
                  </p>

                </div>

                <span
                  className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor()}`}
                >
                  {hotel.status.replaceAll(
                    "_",
                    " "
                  )}
                </span>

              </div>

            </div>

          </div>

          {/* Stay Information */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

            <div className="rounded-2xl border border-border p-5">

              <p className="text-sm text-muted-foreground">
                Check In
              </p>

              <p className="mt-2 text-lg font-semibold text-foreground">
                {checkIn.toLocaleString([], {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

            </div>

            <div className="rounded-2xl border border-border p-5">

              <p className="text-sm text-muted-foreground">
                Check Out
              </p>

              <p className="mt-2 text-lg font-semibold text-foreground">
                {checkOut.toLocaleString([], {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

            </div>

            <div className="rounded-2xl border border-border p-5">

              <p className="text-sm text-muted-foreground">
                Room Type
              </p>

              <p className="mt-2 text-lg font-semibold text-foreground">
                {hotel.room_type.replaceAll(
                  "_",
                  " "
                )}
              </p>

            </div>

            <div className="rounded-2xl border border-border p-5">

              <p className="text-sm text-muted-foreground">
                Guests
              </p>

              <p className="mt-2 text-lg font-semibold text-foreground">
                {hotel.guests}
              </p>

            </div>

            <div className="rounded-2xl border border-border p-5">

              <p className="text-sm text-muted-foreground">
                Rooms
              </p>

              <p className="mt-2 text-lg font-semibold text-foreground">
                {hotel.rooms}
              </p>

            </div>

            <div className="rounded-2xl border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 p-5">

              <p className="text-sm text-blue-600 dark:text-blue-400">
                Total Price
              </p>

              <p className="mt-2 text-2xl font-bold text-blue-700 dark:text-blue-300">
                ₹
                {Number(
                  hotel.price
                ).toLocaleString("en-IN")}
              </p>

            </div>

          </div>

          {/* Booking Information */}

          <div className="mt-8 rounded-2xl border border-border p-6">

            <h3 className="mb-5 text-xl font-bold text-foreground">
              Booking Information
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div>

                <p className="text-sm text-muted-foreground">
                  Booking Reference
                </p>

                <p className="mt-2 font-mono text-lg font-bold text-foreground">
                  {hotel.booking_reference || "--"}
                </p>

              </div>

              <div>

                <p className="text-sm text-muted-foreground">
                  Coordinates
                </p>

                <p className="mt-2 text-lg font-semibold text-foreground">
                  {hotel.latitude && hotel.longitude
                    ? `${hotel.latitude}, ${hotel.longitude}`
                    : "--"}
                </p>

              </div>

            </div>

          </div>

          {/* Amenities */}

          <div className="mt-8 rounded-2xl border border-border p-6">

            <h3 className="mb-5 text-xl font-bold text-foreground">
              Amenities & Features
            </h3>

            <div className="flex flex-wrap gap-3">

              {hotel.breakfast_included && (
                <span className="rounded-full bg-amber-100 dark:bg-amber-500/15 px-4 py-2 font-medium text-amber-700 dark:text-amber-300">
                  🍳 Breakfast Included
                </span>
              )}

              {hotel.wifi_included && (
                <span className="rounded-full bg-green-100 dark:bg-green-500/15 px-4 py-2 font-medium text-green-700 dark:text-green-300">
                  📶 Free WiFi
                </span>
              )}

              {hotel.parking_available && (
                <span className="rounded-full bg-indigo-100 dark:bg-indigo-500/15 px-4 py-2 font-medium text-indigo-700 dark:text-indigo-300">
                  🚗 Parking Available
                </span>
              )}

              {hotel.refundable && (
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-500/15 px-4 py-2 font-medium text-emerald-700 dark:text-emerald-300">
                  ✅ Refundable
                </span>
              )}

            </div>

            {hotel.amenities && (

              <div className="mt-6">

                <p className="mb-2 text-sm text-muted-foreground">
                  Amenities
                </p>

                <p className="rounded-xl bg-muted p-4 text-foreground">
                  {hotel.amenities}
                </p>

              </div>

            )}

            {hotel.notes && (

              <div className="mt-6">

                <p className="mb-2 text-sm text-muted-foreground">
                  Notes
                </p>

                <p className="rounded-xl bg-muted p-4 text-foreground">
                  {hotel.notes}
                </p>

              </div>

            )}

          </div>

        </div>

        {/* Footer */}

        <div className="sticky bottom-0 border-t border-border bg-card px-6 py-5">

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

            <button
              onClick={onClose}
              className="rounded-xl border border-border px-6 py-3 font-medium text-foreground transition hover:bg-accent"
            >
              Close
            </button>

            <button
              onClick={onSelect}
              className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Select Hotel
            </button>

          </div>

        </div>

      </div>

    </div>,
    document.body
  );
}
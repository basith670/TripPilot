"use client";

import {
  useEffect,
  useState,
} from "react";

import { createPortal } from "react-dom";

import {
  updateHotel,
} from "@/services/hotel.service";

import { Hotel } from "@/types/hotel";

import { toast } from "sonner";

interface Props {
  isOpen: boolean;

  hotel: Hotel | null;

  onClose: () => void;

  onSuccess: () => void | Promise<void>;
}

export default function EditHotelModal({
  isOpen,
  hotel,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  const [form, setForm] =
    useState({
      name: "",

      image: "",

      rating: 5,

      address: "",

      city: "",

      country: "",

      latitude: "",

      longitude: "",

      check_in: "",

      check_out: "",

      room_type: "STANDARD" as
        | "STANDARD"
        | "DELUXE"
        | "SUITE"
        | "EXECUTIVE"
        | "FAMILY",

      guests: 2,

      rooms: 1,

      price: "",

      booking_reference: "",

      refundable: false,

      breakfast_included: false,

      wifi_included: true,

      parking_available: false,

      amenities: "",

      notes: "",

      status: "RESERVED" as
        | "RESERVED"
        | "CHECKED_IN"
        | "CHECKED_OUT"
        | "CANCELLED",
    });

  useEffect(() => {
    if (!hotel || !isOpen) return;

    setForm({
      name: hotel.name,

      image: hotel.image,

      rating: hotel.rating,

      address: hotel.address,

      city: hotel.city,

      country: hotel.country,

      latitude:
        hotel.latitude?.toString() ?? "",

      longitude:
        hotel.longitude?.toString() ?? "",

      check_in:
        hotel.check_in.slice(0, 16),

      check_out:
        hotel.check_out.slice(0, 16),

      room_type:
        hotel.room_type,

      guests: hotel.guests,

      rooms: hotel.rooms,

      price:
        hotel.price.toString(),

      booking_reference:
        hotel.booking_reference,

      refundable:
        hotel.refundable,

      breakfast_included:
        hotel.breakfast_included,

      wifi_included:
        hotel.wifi_included,

      parking_available:
        hotel.parking_available,

      amenities:
        hotel.amenities,

      notes:
        hotel.notes,

      status:
        hotel.status,
    });
  }, [hotel, isOpen]);

  const handleClose = () => {
    if (loading) return;

    onClose();
  };

  const handleSubmit = async () => {
    if (!hotel) return;

    try {
      setLoading(true);

      await updateHotel(
        hotel.id,
        {
          trip: hotel.trip,

          name: form.name,

          image: form.image,

          rating: Number(
            form.rating
          ),

          address:
            form.address,

          city: form.city,

          country:
            form.country,

          latitude:
            form.latitude
              ? Number(
                  form.latitude
                )
              : null,

          longitude:
            form.longitude
              ? Number(
                  form.longitude
                )
              : null,

          check_in: new Date(
            form.check_in
          ).toISOString(),

          check_out: new Date(
            form.check_out
          ).toISOString(),

          room_type:
            form.room_type,

          guests: Number(
            form.guests
          ),

          rooms: Number(
            form.rooms
          ),

          price: Number(
            form.price
          ),

          booking_reference:
            form.booking_reference,

          refundable:
            form.refundable,

          breakfast_included:
            form.breakfast_included,

          wifi_included:
            form.wifi_included,

          parking_available:
            form.parking_available,

          amenities:
            form.amenities,

          notes:
            form.notes,

          status:
            form.status,
        }
      );

      toast.success(
        "Hotel updated successfully."
      );

      await onSuccess();

      handleClose();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to update hotel."
      );
    } finally {
      setLoading(false);
    }
  };

  if (
    !mounted ||
    !isOpen ||
    !hotel
  )
    return null;

  return createPortal(
    <div
      onClick={handleClose}
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
              Edit Hotel
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Update hotel reservation details.
            </p>

          </div>

          <button
            onClick={handleClose}
            disabled={loading}
            className="text-3xl text-muted-foreground transition hover:text-red-600 dark:hover:text-red-400"
          >
            ×
          </button>

        </div>

        {/* Scroll Body */}

        <div className="flex-1 overflow-y-auto px-6 py-6">

          <div className="space-y-8">

            {/* Hotel Information */}

            <div>

              <h3 className="mb-5 text-xl font-bold text-foreground">
                Hotel Information
              </h3>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                {/* Hotel Name */}

                <div>

                  <label className="mb-2 block font-medium text-foreground">
                    Hotel Name
                  </label>

                  <input
                    type="text"
                    placeholder="Taj Bangalore"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-border bg-card p-3 text-foreground focus:border-blue-500 focus:outline-none"
                  />

                </div>

                {/* Image */}

                <div>

                  <label className="mb-2 block font-medium text-foreground">
                    Image URL
                  </label>

                  <input
                    type="text"
                    placeholder="https://..."
                    value={form.image}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        image: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-border bg-card p-3 text-foreground focus:border-blue-500 focus:outline-none"
                  />

                </div>

                {/* Rating */}

                <div>

                  <label className="mb-2 block font-medium text-foreground">
                    Rating
                  </label>

                  <input
                    type="number"
                    min={0}
                    max={5}
                    step="0.1"
                    value={form.rating}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        rating: Number(
                          e.target.value
                        ),
                      }))
                    }
                    className="w-full rounded-xl border border-border bg-card p-3 text-foreground focus:border-blue-500 focus:outline-none"
                  />

                </div>

                {/* Address */}

                <div>

                  <label className="mb-2 block font-medium text-foreground">
                    Address
                  </label>

                  <input
                    type="text"
                    placeholder="MG Road"
                    value={form.address}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-border bg-card p-3 text-foreground focus:border-blue-500 focus:outline-none"
                  />

                </div>

                {/* City */}

                <div>

                  <label className="mb-2 block font-medium text-foreground">
                    City
                  </label>

                  <input
                    type="text"
                    placeholder="Bangalore"
                    value={form.city}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-border bg-card p-3 text-foreground focus:border-blue-500 focus:outline-none"
                  />

                </div>

                {/* Country */}

                <div>

                  <label className="mb-2 block font-medium text-foreground">
                    Country
                  </label>

                  <input
                    type="text"
                    placeholder="India"
                    value={form.country}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        country: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-border bg-card p-3 text-foreground focus:border-blue-500 focus:outline-none"
                  />

                </div>

              </div>

            </div>

            {/* Stay Information */}

            <div>

              <h3 className="mb-5 text-xl font-bold text-foreground">
                Stay Information
              </h3>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                {/* Check In */}

                <div>

                  <label className="mb-2 block font-medium text-foreground">
                    Check In
                  </label>

                  <input
                    type="datetime-local"
                    value={form.check_in}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        check_in: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-border bg-card p-3 text-foreground focus:border-blue-500 focus:outline-none"
                  />

                </div>

                {/* Check Out */}

                <div>

                  <label className="mb-2 block font-medium text-foreground">
                    Check Out
                  </label>

                  <input
                    type="datetime-local"
                    value={form.check_out}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        check_out: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-border bg-card p-3 text-foreground focus:border-blue-500 focus:outline-none"
                  />

                </div>

                {/* Room Type */}

                <div>

                  <label className="mb-2 block font-medium text-foreground">
                    Room Type
                  </label>

                  <select
                    value={form.room_type}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        room_type: e.target.value as
                          | "STANDARD"
                          | "DELUXE"
                          | "SUITE"
                          | "EXECUTIVE"
                          | "FAMILY",
                      }))
                    }
                    className="w-full rounded-xl border border-border bg-card p-3 text-foreground focus:border-blue-500 focus:outline-none"
                  >

                    <option value="STANDARD">
                      Standard
                    </option>

                    <option value="DELUXE">
                      Deluxe
                    </option>

                    <option value="SUITE">
                      Suite
                    </option>

                    <option value="EXECUTIVE">
                      Executive
                    </option>

                    <option value="FAMILY">
                      Family
                    </option>

                  </select>

                </div>

                {/* Guests */}

                <div>

                  <label className="mb-2 block font-medium text-foreground">
                    Guests
                  </label>

                  <input
                    type="number"
                    min={1}
                    value={form.guests}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        guests: Number(
                          e.target.value
                        ),
                      }))
                    }
                    className="w-full rounded-xl border border-border bg-card p-3 text-foreground focus:border-blue-500 focus:outline-none"
                  />

                </div>

                {/* Rooms */}

                <div>

                  <label className="mb-2 block font-medium text-foreground">
                    Rooms
                  </label>

                  <input
                    type="number"
                    min={1}
                    value={form.rooms}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        rooms: Number(
                          e.target.value
                        ),
                      }))
                    }
                    className="w-full rounded-xl border border-border bg-card p-3 text-foreground focus:border-blue-500 focus:outline-none"
                  />

                </div>

                {/* Total Price */}

                <div>

                  <label className="mb-2 block font-medium text-foreground">
                    Total Price
                  </label>

                  <input
                    type="number"
                    placeholder="15000"
                    value={form.price}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-border bg-card p-3 text-foreground focus:border-blue-500 focus:outline-none"
                  />

                </div>

              </div>

            </div>

            {/* Booking & Amenities */}

            <div>

              <h3 className="mb-5 text-xl font-bold text-foreground">
                Booking & Amenities
              </h3>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                {/* Booking Reference */}

                <div>

                  <label className="mb-2 block font-medium text-foreground">
                    Booking Reference
                  </label>

                  <input
                    type="text"
                    placeholder="HTL123456"
                    value={form.booking_reference}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        booking_reference:
                          e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-border bg-card p-3 text-foreground focus:border-blue-500 focus:outline-none"
                  />

                </div>

                {/* Status */}

                <div>

                  <label className="mb-2 block font-medium text-foreground">
                    Status
                  </label>

                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        status: e.target.value as
                          | "RESERVED"
                          | "CHECKED_IN"
                          | "CHECKED_OUT"
                          | "CANCELLED",
                      }))
                    }
                    className="w-full rounded-xl border border-border bg-card p-3 text-foreground focus:border-blue-500 focus:outline-none"
                  >

                    <option value="RESERVED">
                      Reserved
                    </option>

                    <option value="CHECKED_IN">
                      Checked In
                    </option>

                    <option value="CHECKED_OUT">
                      Checked Out
                    </option>

                    <option value="CANCELLED">
                      Cancelled
                    </option>

                  </select>

                </div>

                {/* Latitude */}

                <div>

                  <label className="mb-2 block font-medium text-foreground">
                    Latitude
                  </label>

                  <input
                    type="number"
                    step="any"
                    value={form.latitude}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        latitude: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-border bg-card p-3 text-foreground focus:border-blue-500 focus:outline-none"
                  />

                </div>

                {/* Longitude */}

                <div>

                  <label className="mb-2 block font-medium text-foreground">
                    Longitude
                  </label>

                  <input
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        longitude: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-border bg-card p-3 text-foreground focus:border-blue-500 focus:outline-none"
                  />

                </div>

              </div>

              {/* Amenities */}

              <div className="mt-8">

                <label className="mb-2 block font-medium text-foreground">
                  Amenities
                </label>

                <textarea
                  rows={4}
                  placeholder="Swimming Pool, Gym, Spa, Restaurant..."
                  value={form.amenities}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      amenities:
                        e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-border bg-card p-3 text-foreground focus:border-blue-500 focus:outline-none"
                />

              </div>

              {/* Notes */}

              <div className="mt-6">

                <label className="mb-2 block font-medium text-foreground">
                  Notes
                </label>

                <textarea
                  rows={4}
                  placeholder="Special requests..."
                  value={form.notes}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      notes:
                        e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-border bg-card p-3 text-foreground focus:border-blue-500 focus:outline-none"
                />

              </div>

              {/* Features */}

              <div className="mt-8">

                <label className="mb-4 block font-medium text-foreground">
                  Features
                </label>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <label className="flex items-center gap-3 text-foreground">

                    <input
                      type="checkbox"
                      checked={form.refundable}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          refundable:
                            e.target.checked,
                        }))
                      }
                    />

                    Refundable

                  </label>

                  <label className="flex items-center gap-3 text-foreground">

                    <input
                      type="checkbox"
                      checked={form.breakfast_included}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          breakfast_included:
                            e.target.checked,
                        }))
                      }
                    />

                    Breakfast Included

                  </label>

                  <label className="flex items-center gap-3 text-foreground">

                    <input
                      type="checkbox"
                      checked={form.wifi_included}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          wifi_included:
                            e.target.checked,
                        }))
                      }
                    />

                    Free WiFi

                  </label>

                  <label className="flex items-center gap-3 text-foreground">

                    <input
                      type="checkbox"
                      checked={form.parking_available}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          parking_available:
                            e.target.checked,
                        }))
                      }
                    />

                    Parking Available

                  </label>

                </div>

              </div>

            </div>
          </div>

        </div>

        {/* Footer */}

        <div className="border-t border-border bg-card px-6 py-5">

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-xl border border-border px-6 py-3 font-medium text-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Updating..."
                : "Update Hotel"}
            </button>

          </div>

        </div>

      </div>

    </div>,
    document.body
  );
}
"use client";

import { Hotel } from "@/types/hotel";

interface HotelCardProps {
  hotel: Hotel;
  isSelected?: boolean;
  onView?: (hotel: Hotel) => void;
  onEdit?: (hotel: Hotel) => void;
  onDelete?: (hotel: Hotel) => void;
  onSelect?: (hotel: Hotel) => void;
}

export default function HotelCard({
  hotel,
  isSelected = false,
  onView,
  onEdit,
  onDelete,
  onSelect,
}: HotelCardProps) {
  const checkIn = new Date(hotel.check_in).toLocaleDateString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const checkOut = new Date(hotel.check_out).toLocaleDateString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const getStatusColor = () => {
    switch (hotel.status) {
      case "RESERVED":
        return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300";

      case "CHECKED_IN":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300";

      case "CHECKED_OUT":
        return "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200";

      case "CANCELLED":
        return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300";

      default:
        return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300";
    }
  };

  return (
    <div
      className={`
        rounded-[30px]
        border
        bg-card
        p-7
        shadow-lg
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-2xl

        ${
          isSelected
            ? "border-cyan-500 ring-2 ring-cyan-500/20"
            : "border-border"
        }
      `}
    >
      {/* Header */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-5">

          {hotel.image ? (
            <img
              src={hotel.image}
              alt={hotel.name}
              className="h-24 w-24 rounded-2xl object-cover shadow-lg"
            />
          ) : (
            <div
              className="
                flex
                h-24
                w-24
                items-center
                justify-center
                rounded-2xl
                bg-cyan-500/10
                text-4xl
              "
            >
              🏨
            </div>
          )}

          <div>

            <h2 className="text-3xl font-bold text-foreground">
              {hotel.name}
            </h2>

            <p className="mt-2 text-muted-foreground">
              ⭐ {hotel.rating} • {hotel.city}, {hotel.country}
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              {hotel.address}
            </p>

          </div>

        </div>

        <div className="flex items-center gap-3">

          {isSelected && (
            <span
              className="
                rounded-full
                bg-cyan-500
                px-4
                py-2
                text-sm
                font-semibold
                text-white
              "
            >
              ✓ Selected
            </span>
          )}

          <span
            className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor()}`}
          >
            {hotel.status.replaceAll("_", " ")}
          </span>

        </div>

      </div>

      {/* Details */}

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <InfoCard
          title="Check In"
          value={checkIn}
        />

        <InfoCard
          title="Check Out"
          value={checkOut}
        />

        <InfoCard
          title="Room"
          value={hotel.room_type.replaceAll("_", " ")}
          subtitle={`${hotel.rooms} Room${
            hotel.rooms > 1 ? "s" : ""
          } • ${hotel.guests} Guest${
            hotel.guests > 1 ? "s" : ""
          }`}
        />

        <div
          className="
            rounded-2xl
            border
            border-cyan-500/20
            bg-cyan-500/10
            p-5
          "
        >
          <p className="text-sm text-cyan-500">
            Total Price
          </p>

          <h3 className="mt-3 text-3xl font-bold text-cyan-400">
            ₹{Number(hotel.price).toLocaleString("en-IN")}
          </h3>

        </div>

      </div>

      {/* Features */}

      <div className="mt-8 flex flex-wrap gap-3">

        {hotel.breakfast_included && (
          <FeatureBadge
            color="amber"
            label="🍳 Breakfast"
          />
        )}

        {hotel.wifi_included && (
          <FeatureBadge
            color="green"
            label="📶 Free WiFi"
          />
        )}

        {hotel.parking_available && (
          <FeatureBadge
            color="indigo"
            label="🚗 Parking"
          />
        )}

        {hotel.refundable && (
          <FeatureBadge
            color="emerald"
            label="✅ Refundable"
          />
        )}

      </div>

      {/* Footer */}

      <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-border pt-6">

        <button
          onClick={() => onView?.(hotel)}
          className="
            rounded-xl
            border
            border-border
            px-5
            py-3
            font-medium
            transition
            hover:bg-accent
          "
        >
          Details
        </button>

        <button
          onClick={() => onEdit?.(hotel)}
          className="
            rounded-xl
            bg-amber-500
            px-5
            py-3
            font-medium
            text-white
            transition
            hover:bg-amber-600
          "
        >
          Edit
        </button>

        <button
          onClick={() => onDelete?.(hotel)}
          className="
            rounded-xl
            bg-red-500
            px-5
            py-3
            font-medium
            text-white
            transition
            hover:bg-red-600
          "
        >
          Delete
        </button>

        <button
          disabled={isSelected}
          onClick={() => onSelect?.(hotel)}
          className={`
            rounded-xl
            px-5
            py-3
            font-medium
            text-white
            transition

            ${
              isSelected
                ? "cursor-not-allowed bg-emerald-600"
                : "bg-cyan-500 hover:bg-cyan-600"
            }
          `}
        >
          {isSelected ? "✓ Selected" : "Select Hotel"}
        </button>

      </div>

    </div>
  );
}

interface InfoCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
}

function InfoCard({
  title,
  value,
  subtitle,
}: InfoCardProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-border
        bg-card
        p-5
      "
    >
      <p className="text-sm text-muted-foreground">
        {title}
      </p>

      <h3 className="mt-3 text-lg font-semibold text-foreground">
        {value}
      </h3>

      {subtitle && (
        <p className="mt-2 text-sm text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  );
}

interface FeatureBadgeProps {
  label: string;
  color:
    | "amber"
    | "green"
    | "indigo"
    | "emerald";
}

function FeatureBadge({
  label,
  color,
}: FeatureBadgeProps) {
  const colors = {
    amber:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",

    green:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",

    indigo:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300",

    emerald:
      "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300",
  };

  return (
    <span
      className={`rounded-full px-4 py-2 text-sm font-semibold ${colors[color]}`}
    >
      {label}
    </span>
  );
}
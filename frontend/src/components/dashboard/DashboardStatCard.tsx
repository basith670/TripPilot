"use client";

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

export default function DashboardStatCard({
  title,
  value,
  icon,
  color,
}: DashboardStatCardProps) {
  return (
    <div
      className="
        group

        rounded-3xl

        border
        border-white/40

        bg-white/80

        p-6

        shadow-lg

        backdrop-blur-xl

        transition-all
        duration-300

        hover:-translate-y-1
        hover:shadow-2xl
      "
    >
      <div
        className={`
          flex
          h-14
          w-14
          items-center
          justify-center

          rounded-2xl

          text-2xl
          text-white

          shadow-lg

          ${color}
        `}
      >
        {icon}
      </div>

      <p className="mt-6 text-sm font-medium text-gray-500">
        {title}
      </p>

      <h3 className="mt-2 text-4xl font-bold text-gray-900">
        {value}
      </h3>
    </div>
  );
}
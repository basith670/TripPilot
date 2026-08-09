"use client";

interface DashboardSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function DashboardSection({
  title,
  subtitle,
  children,
}: DashboardSectionProps) {
  return (
    <section
      className="
        rounded-[30px]

        border
        border-white/40

        bg-white/80

        p-8

        shadow-xl

        backdrop-blur-xl
      "
    >
      <div className="mb-8">

        <h2 className="text-3xl font-bold">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-2 text-gray-500">
            {subtitle}
          </p>
        )}

      </div>

      {children}

    </section>
  );
}
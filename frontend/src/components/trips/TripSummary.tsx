interface TripSummaryProps {
    days: number;
    activities: number;
    totalCost: number;
    travelers: number;
  }
  
  export default function TripSummary({
    days,
    activities,
    totalCost,
    travelers,
  }: TripSummaryProps) {
    const cards = [
      {
        title: "Days",
        value: days,
        icon: "📅",
      },
      {
        title: "Activities",
        value: activities,
        icon: "📍",
      },
      {
        title: "Estimated Cost",
        value: `₹${totalCost.toLocaleString("en-IN")}`,
        icon: "💰",
      },
      {
        title: "Travelers",
        value: travelers,
        icon: "👥",
      },
    ];
  
    return (
      <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-3xl">
              {card.icon}
            </div>
  
            <p className="mt-4 text-sm text-gray-500">
              {card.title}
            </p>
  
            <h3 className="mt-1 text-3xl font-bold text-gray-900">
              {card.value}
            </h3>
          </div>
        ))}
      </div>
    );
  }
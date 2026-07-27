"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  FaHome,
  FaSuitcase,
  FaCalendarAlt,
  FaPlane,
  FaHotel,
  FaRobot,
  FaUser,
  FaCog,
} from "react-icons/fa";

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: FaHome,
  },
  {
    name: "My Trips",
    href: "/trips",
    icon: FaSuitcase,
  },
  {
    name: "Itinerary",
    href: "/itinerary",
    icon: FaCalendarAlt,
  },
  {
    name: "Flights",
    href: "/flights",
    icon: FaPlane,
  },
  {
    name: "Hotels",
    href: "/hotels",
    icon: FaHotel,
  },
  {
    name: "AI Planner",
    href: "/planner",
    icon: FaRobot,
  },
];

const bottomItems = [
  {
    name: "Profile",
    href: "/profile",
    icon: FaUser,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: FaCog,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 flex-col border-r bg-white">
      <div className="border-b p-6">
        <h1 className="text-2xl font-bold text-blue-600">
          ✈️ TripPilot
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          AI Travel Planner
        </p>
      </div>

      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const active = pathname === item.href;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 transition
                  ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="text-lg" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t p-4">
        <ul className="space-y-2">
          {bottomItems.map((item) => {
            const Icon = item.icon;

            const active = pathname === item.href;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 transition
                  ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="text-lg" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
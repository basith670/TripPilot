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

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export default function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50
        w-64 bg-white border-r shadow-lg
        transform transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0 lg:shadow-none
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="border-b p-6">
          <h1 className="text-2xl font-bold text-blue-600">
            ✈️ TripPilot
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            AI Travel Planner
          </p>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href;

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all
                    ${
                      active
                        ? "bg-blue-600 text-white shadow"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="text-lg" />

                    <span className="font-medium">
                      {item.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Menu */}
        <div className="border-t p-4">
          <ul className="space-y-2">
            {bottomItems.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href;

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all
                    ${
                      active
                        ? "bg-blue-600 text-white shadow"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="text-lg" />

                    <span className="font-medium">
                      {item.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
}
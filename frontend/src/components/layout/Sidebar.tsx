"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

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
    name: "AI Planner",
    href: "/planner",
    icon: FaRobot,
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
        fixed
        inset-y-0
        left-0
        z-50

        w-72

        transform
        transition-transform
        duration-300

        lg:static
        lg:translate-x-0

        ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }
      `}
    >
      <div
        className="
          flex
          h-full
          flex-col

          border-r
          border-slate-200

          bg-white/90
          backdrop-blur-xl

          shadow-xl

          transition-colors
          duration-300

          dark:border-slate-800
          dark:bg-slate-900/90
        "
      >
        {/* Logo */}

        <div
          className="
            border-b
            border-slate-200
            p-7

            dark:border-slate-800
          "
        >
          <div className="flex items-center gap-4">

            <Image
              src="/logo/trippilot-logo.png"
              alt="TripPilot"
              width={190}
              height={48}
              priority
              className="h-12 w-auto"
            />

            <div>

              <h1 className="text-3xl font-bold text-blue-600">
                TripPilot
              </h1>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                AI Travel Planner
              </p>

            </div>

          </div>
        </div>

        {/* Navigation */}

        <nav className="flex-1 overflow-y-auto px-5 py-7">

          <ul className="space-y-3">

            {menuItems.map((item) => {

              const Icon = item.icon;

              const active =
                pathname === item.href;

              return (
                <li key={item.name}>

                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`
                      group

                      flex
                      items-center
                      gap-4

                      rounded-2xl

                      px-5
                      py-3.5

                      font-medium

                      transition-all
                      duration-300

                      ${
                        active
                          ? `
                              bg-gradient-to-r
                              from-blue-600
                              via-cyan-500
                              to-indigo-500

                              text-white

                              shadow-lg
                            `
                          : `
                              text-slate-700

                              hover:bg-blue-50
                              hover:text-blue-700

                              dark:text-slate-300
                              dark:hover:bg-slate-800
                              dark:hover:text-cyan-400
                            `
                      }
                    `}
                  >
                    <Icon
                      className={`text-lg ${
                        active
                          ? "text-white"
                          : "group-hover:text-blue-600 dark:group-hover:text-cyan-400"
                      }`}
                    />

                    {item.name}

                  </Link>

                </li>
              );

            })}

          </ul>

        </nav>

        {/* Bottom */}

        <div
          className="
            border-t
            border-slate-200
            p-5

            dark:border-slate-800
          "
        >
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
                    className={`
                      group

                      flex
                      items-center
                      gap-4

                      rounded-2xl

                      px-5
                      py-3

                      transition-all
                      duration-300

                      ${
                        active
                          ? `
                              bg-gradient-to-r
                              from-blue-600
                              to-cyan-500

                              text-white

                              shadow-lg
                            `
                          : `
                              text-slate-700

                              hover:bg-blue-50
                              hover:text-blue-700

                              dark:text-slate-300
                              dark:hover:bg-slate-800
                              dark:hover:text-cyan-400
                            `
                      }
                    `}
                  >
                    <Icon
                      className={`${
                        active
                          ? "text-white"
                          : "group-hover:text-blue-600 dark:group-hover:text-cyan-400"
                      }`}
                    />

                    {item.name}

                  </Link>

                </li>
              );

            })}

          </ul>

          {/* Footer */}

          <div
            className="
              mt-8

              rounded-2xl

              border

              border-blue-100

              bg-gradient-to-r
              from-blue-50
              via-cyan-50
              to-indigo-50

              p-4

              transition-colors

              dark:border-slate-700
              dark:from-slate-800
              dark:via-slate-850
              dark:to-slate-800
            "
          >
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Powered by
            </p>

            <p className="font-semibold text-blue-700 dark:text-cyan-400">
              TripPilot AI
            </p>

            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
              Version 1.0
            </p>

          </div>

        </div>

      </div>
    </aside>
  );
}
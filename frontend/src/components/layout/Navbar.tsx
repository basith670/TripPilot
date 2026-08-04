"use client";

import {
  FaBars,
  FaBell,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({
  onMenuClick,
}: NavbarProps) {
  return (
    <header className="flex h-16 sm:h-20 items-center justify-between border-b bg-white px-4 sm:px-6 lg:px-8">

      {/* Left */}
      <div className="flex items-center gap-4">

        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 transition hover:bg-gray-100 lg:hidden"
        >
          <FaBars className="text-xl text-gray-700" />
        </button>

        <div>
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Dashboard
          </h2>

          <p className="hidden text-sm text-gray-500 sm:block">
            Welcome back to TripPilot
          </p>
        </div>

      </div>

      {/* Right */}
      <div className="flex items-center gap-3 sm:gap-5">

        {/* Search - Desktop Only */}
        <div className="relative hidden lg:block">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search trips..."
            className="w-72 rounded-lg border border-gray-300 py-2 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Notification */}
        <button className="relative rounded-full p-2 transition hover:bg-gray-100">
          <FaBell className="text-xl text-gray-600" />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* User */}
        <div className="flex items-center gap-3 rounded-lg border px-3 py-2">

          <FaUserCircle className="text-3xl text-blue-600" />

          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-900">
              Muhammad Basith
            </p>

            <p className="text-xs text-gray-500">
              Software Engineer
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}
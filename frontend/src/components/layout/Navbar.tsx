"use client";

import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  return (
    <header className="flex h-20 items-center justify-between border-b bg-white px-8">
      {/* Left */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h2>

        <p className="text-sm text-gray-500">
          Welcome back to TripPilot
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative">
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

          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* User */}
        <div className="flex items-center gap-3 rounded-lg border px-3 py-2">
          <FaUserCircle className="text-3xl text-blue-600" />

          <div>
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
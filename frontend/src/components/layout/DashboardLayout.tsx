"use client";

import { ReactNode, useState } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div
      className="
        relative
        flex
        h-screen
        overflow-hidden

        bg-slate-50
        text-slate-900

        transition-colors
        duration-300

        dark:bg-slate-950
        dark:text-white
      "
    >
      {/* Background Decorations */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div
          className="
            absolute
            -left-24
            -top-24
            h-80
            w-80
            rounded-full
            bg-blue-400/20
            blur-3xl

            dark:bg-blue-600/10
          "
        />

        <div
          className="
            absolute
            right-0
            top-1/3
            h-96
            w-96
            rounded-full
            bg-cyan-300/20
            blur-3xl

            dark:bg-cyan-500/10
          "
        />

        <div
          className="
            absolute
            bottom-0
            left-1/3
            h-72
            w-72
            rounded-full
            bg-indigo-300/20
            blur-3xl

            dark:bg-indigo-600/10
          "
        />

      </div>

      {/* Mobile Overlay */}

      {sidebarOpen && (
        <div
          onClick={() =>
            setSidebarOpen(false)
          }
          className="
            fixed
            inset-0
            z-40
            bg-black/50
            backdrop-blur-sm
            lg:hidden
          "
        />
      )}

      {/* Sidebar */}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      {/* Main Content */}

      <div
        className="
          relative
          z-10
          flex
          flex-1
          flex-col
          overflow-hidden
        "
      >
        <Navbar
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />

        <main
          className="
            flex-1
            overflow-y-auto

            p-4
            sm:p-6
            lg:p-8
            xl:p-10
          "
        >
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
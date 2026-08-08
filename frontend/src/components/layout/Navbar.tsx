"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useTheme } from "next-themes";

import { Switch } from "@/components/ui/switch";

import {
  FaBars,
  FaUserCircle,
  FaChevronDown,
  FaUser,
  FaCog,
  FaLock,
  FaSignOutAlt,
  FaMoon,
} from "react-icons/fa";

import { toast } from "sonner";

import { getProfile } from "@/services/profile.service";
import { logout } from "@/services/auth.service";

import { UserProfile } from "@/types/profile";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({
  onMenuClick,
}: NavbarProps) {
  const router = useRouter();

  const {
    resolvedTheme,
    theme,
    setTheme,
  } = useTheme();
  
  const isDark = resolvedTheme === "dark";
  
  console.log({
    theme,
    resolvedTheme,
  });

  const [open, setOpen] =
    useState(false);

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const handleLogout = async () => {
    try {
      setOpen(false);

      await logout();

      toast.success(
        "Logged out successfully."
      );

      router.push("/");

      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to logout."
      );
    }
  };

  return (
    <header
      className="
        sticky
        top-0
        z-30

        border-b
        border-slate-200

        bg-white/80
        backdrop-blur-xl

        px-4
        py-4

        transition-colors

        dark:border-slate-800
        dark:bg-slate-900/80

        sm:px-6
        lg:px-8
      "
    >
      <div className="flex items-center justify-between">

        {/* Left */}

        <div className="flex items-center gap-4">

          <button
            onClick={onMenuClick}
            className="
              rounded-2xl
              bg-white
              p-3
              shadow-md
              transition-all
              hover:-translate-y-0.5
              hover:shadow-lg
              dark:bg-slate-800
              lg:hidden
            "
          >
            <FaBars className="text-slate-700 dark:text-white" />
          </button>

          <h2 className="hidden text-xl font-bold text-slate-900 dark:text-white lg:block">
            TripPilot
          </h2>

        </div>

        {/* Right */}

        <div
          ref={dropdownRef}
          className="relative"
        >
          <button
            onClick={() =>
              setOpen(!open)
            }
            className="
              flex
              items-center
              gap-3

              rounded-2xl

              bg-white

              px-3
              py-2

              shadow-md

              transition-all

              hover:-translate-y-0.5
              hover:shadow-lg

              dark:bg-slate-800
            "
          >
            {profile?.profile_picture ? (
              <img
                src={
                  profile.profile_picture
                }
                alt="Profile"
                className="h-11 w-11 rounded-full object-cover"
              />
            ) : (
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center

                  rounded-full

                  bg-blue-100

                  dark:bg-slate-700
                "
              >
                <FaUserCircle
                  size={26}
                  className="text-slate-500 dark:text-slate-300"
                />
              </div>
            )}

            <div className="hidden text-left md:block">

              <p className="font-semibold text-slate-900 dark:text-white">
                {profile
                  ? `${profile.first_name} ${profile.last_name}`
                  : "Loading..."}
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                @{profile?.username}
              </p>

            </div>

            <FaChevronDown
              className={`hidden text-slate-400 transition-transform md:block ${
                open
                  ? "rotate-180"
                  : ""
              }`}
            />
          </button>

          {open && (
            <div
              className="
                absolute
                right-0
                mt-3

                w-64

                overflow-hidden

                rounded-3xl

                border
                border-slate-200

                bg-white

                shadow-2xl

                dark:border-slate-700
                dark:bg-slate-900
              "
            >
              <Link
                href="/profile"
                onClick={() =>
                  setOpen(false)
                }
                className="
                  flex
                  items-center
                  gap-4

                  px-6
                  py-4

                  transition

                  hover:bg-slate-50

                  dark:hover:bg-slate-800
                "
              >
                <FaUser />

                My Profile
              </Link>

              <Link
                href="/settings"
                onClick={() =>
                  setOpen(false)
                }
                className="
                  flex
                  items-center
                  gap-4

                  px-6
                  py-4

                  transition

                  hover:bg-slate-50

                  dark:hover:bg-slate-800
                "
              >
                <FaCog />

                Settings
              </Link>

              <Link
                href="/settings"
                onClick={() =>
                  setOpen(false)
                }
                className="
                  flex
                  items-center
                  gap-4

                  px-6
                  py-4

                  transition

                  hover:bg-slate-50

                  dark:hover:bg-slate-800
                "
              >
                <FaLock />

                Change Password
              </Link>

              {/* Theme Toggle */}

<div className="border-t border-slate-200 dark:border-slate-700">

<div
  className="
    flex
    items-center
    justify-between

    px-6
    py-4
  "
>

  <div className="flex items-center gap-4">

    <FaMoon className="text-slate-500" />

    <div>

      <p className="font-medium text-slate-900 dark:text-white">
        Dark Mode
      </p>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        {isDark ? "Enabled" : "Disabled"}
      </p>

    </div>

  </div>

  <Switch
    checked={isDark}
    onCheckedChange={(checked) =>
      setTheme(
        checked
          ? "dark"
          : "light"
      )
    }
  />

</div>

</div>

              <div className="border-t border-slate-200 dark:border-slate-700" />

              <button
                onClick={
                  handleLogout
                }
                className="
                  flex
                  w-full
                  items-center
                  gap-4

                  px-6
                  py-4

                  text-red-600

                  transition

                  hover:bg-red-50

                  dark:hover:bg-red-950/40
                "
              >
                <FaSignOutAlt />

                Logout
              </button>

            </div>
          )}
        </div>

      </div>
    </header>
  );
}
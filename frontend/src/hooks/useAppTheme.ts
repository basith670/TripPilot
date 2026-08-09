"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import {
  getProfile,
  updateProfile,
} from "@/services/profile.service";

export function useAppTheme() {
  const {
    theme,
    resolvedTheme,
    setTheme,
  } = useTheme();

  const [loading, setLoading] =
    useState(false);

  const isDark =
    resolvedTheme === "dark";

  const changeTheme = async (
    value: "light" | "dark" | "system"
  ) => {
    try {
      setLoading(true);

      setTheme(value);

      await updateProfile({
        theme: value,
      });

      toast.success(
        `Theme changed to ${
          value.charAt(0).toUpperCase() +
          value.slice(1)
        } Mode`
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to update theme."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () =>
    changeTheme(
      isDark ? "light" : "dark"
    );

  return {
    theme,
    resolvedTheme,
    isDark,
    loading,
    changeTheme,
    toggleTheme,
  };
}
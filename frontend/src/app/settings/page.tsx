"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";

import ChangePasswordCard from "@/components/settings/ChangePasswordCard";
import AppearanceCard from "@/components/settings/AppearanceCard";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Page Header */}

        <div>

          <h1
            className="
              text-4xl
              font-bold
              text-slate-900
              dark:text-white
            "
          >
            Settings
          </h1>

          <p
            className="
              mt-2
              text-slate-500
              dark:text-slate-400
            "
          >
            Manage your account security and appearance.
          </p>

        </div>

        {/* Change Password */}

        <ChangePasswordCard />

        {/* Theme Selection */}

        <AppearanceCard />

      </div>
    </DashboardLayout>
  );
}
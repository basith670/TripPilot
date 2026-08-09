"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";

import ProfileCard from "@/components/profile/ProfileCard";
import AvatarUploader from "@/components/profile/AvatarUploader";
import ProfileForm from "@/components/profile/ProfileForm";

import {
  getProfile,
  updateProfile,
} from "@/services/profile.service";

import { UserProfile } from "@/types/profile";

import { toast } from "sonner";

export default function ProfilePage() {
  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const data =
        await getProfile();

      setProfile(data);
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      setSaving(true);

      const updated =
        await updateProfile(profile);

      setProfile(updated);

      // Tell any other mounted component (e.g. Navbar) that the
      // profile changed, so they can refetch and stay in sync
      // without requiring a full page reload.
      window.dispatchEvent(
        new Event("profile-updated")
      );

      toast.success(
        "Profile updated successfully."
      );

      setEditing(false);
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>

      {/* Header */}

      <section className="mb-10">

        <span
          className="
            inline-flex
            items-center
            rounded-full
            border
            border-cyan-500/20
            bg-cyan-500/10
            px-4
            py-2
            text-sm
            font-semibold
            text-cyan-700
            dark:text-cyan-300
          "
        >
          Personal Information
        </span>

        <h1
          className="
            mt-5
            text-4xl
            font-bold
            text-slate-900
            dark:text-white
          "
        >
          My Profile
        </h1>

        <p
          className="
            mt-3
            max-w-2xl
            text-slate-600
            dark:text-slate-400
          "
        >
          View and manage your personal information,
          profile picture and account details.
        </p>

      </section>

      {loading ? (

        <div
          className="
            rounded-[32px]
            border
            border-border
            bg-card
            p-20
            shadow-xl
          "
        >

          <div
            className="
              mx-auto
              h-14
              w-14
              animate-spin
              rounded-full
              border-4
              border-cyan-500
              border-t-transparent
            "
          />

          <p
            className="
              mt-6
              text-center
              text-muted-foreground
            "
          >
            Loading your profile...
          </p>

        </div>

      ) : profile ? (

        <div className="space-y-8">

          {editing ? (

            <>

              <AvatarUploader
                profile={profile}
                setProfile={setProfile}
              />

              <ProfileForm
                profile={profile}
                setProfile={setProfile}
                onSave={handleSave}
                loading={saving}
                onCancel={() =>
                  setEditing(false)
                }
              />

            </>

          ) : (

            <ProfileCard
              profile={profile}
              onEdit={() =>
                setEditing(true)
              }
            />

          )}

        </div>

      ) : (

        <div
          className="
            rounded-[32px]
            border
            border-border
            bg-card
            p-20
            text-center
            shadow-xl
          "
        >

          <h2
            className="
              text-4xl
              font-bold
              text-foreground
            "
          >
            Profile Not Found
          </h2>

          <p
            className="
              mt-4
              text-muted-foreground
            "
          >
            We couldn't find your profile information.
          </p>

        </div>

      )}

    </DashboardLayout>
  );
}
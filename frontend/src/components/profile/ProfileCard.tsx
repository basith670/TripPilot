"use client";

import {
  User,
  Mail,
  MapPin,
  Calendar,
  Pencil,
} from "lucide-react";

import { UserProfile } from "@/types/profile";

interface ProfileCardProps {
  profile: UserProfile;
  onEdit: () => void;
}

export default function ProfileCard({
  profile,
  onEdit,
}: ProfileCardProps) {
  return (
    <div
      className="
        rounded-[32px]
        border
        border-border
        bg-card
        p-8
        shadow-xl
      "
    >
      {/* Header */}

      <div
        className="
          flex
          flex-col
          gap-8

          lg:flex-row
          lg:items-start
          lg:justify-between
        "
      >
        {/* Left */}

        <div
          className="
            flex
            flex-col
            items-center
            gap-6
            text-center

            sm:flex-row
            sm:text-left
          "
        >
          {profile.profile_picture ? (
            <img
              src={profile.profile_picture}
              alt="Profile"
              className="
                h-32
                w-32
                rounded-full
                border-4
                border-cyan-500/20
                object-cover
                shadow-xl
              "
            />
          ) : (
            <div
              className="
                flex
                h-32
                w-32
                items-center
                justify-center

                rounded-full

                bg-gradient-to-br
                from-blue-600
                via-cyan-500
                to-indigo-600

                text-5xl
                font-bold
                text-white

                shadow-xl
              "
            >
              {profile.first_name
                ? profile.first_name[0].toUpperCase()
                : "?"}
            </div>
          )}

          <div>

            <h2
              className="
                text-4xl
                font-bold
                text-foreground
              "
            >
              {profile.first_name}{" "}
              {profile.last_name}
            </h2>

            <p
              className="
                mt-2
                text-lg
                text-muted-foreground
              "
            >
              @{profile.username}
            </p>

          </div>
        </div>

        {/* Edit */}

        <button
          onClick={onEdit}
          className="
            inline-flex
            items-center
            gap-2

            self-center
            lg:self-start

            rounded-2xl

            bg-gradient-to-r
            from-blue-600
            via-cyan-500
            to-indigo-600

            px-7
            py-3

            font-semibold
            text-white

            shadow-lg

            transition-all
            duration-300

            hover:-translate-y-1
            hover:shadow-xl
          "
        >
          <Pencil size={18} />
          Edit Profile
        </button>
      </div>

      {/* Information */}

      <div className="mt-12 grid gap-6 md:grid-cols-2">

        <Info
          icon={<Mail size={18} />}
          title="Email"
          value={profile.email}
        />

        <Info
          icon={<User size={18} />}
          title="Phone"
          value={profile.phone_number || "--"}
        />

        <Info
          icon={<MapPin size={18} />}
          title="Country"
          value={profile.country || "--"}
        />

        <Info
          icon={<MapPin size={18} />}
          title="City"
          value={profile.city || "--"}
        />

        <Info
          icon={<Calendar size={18} />}
          title="Date of Birth"
          value={profile.date_of_birth || "--"}
        />

        <Info
          icon={<Calendar size={18} />}
          title="Preferred Currency"
          value={profile.preferred_currency}
        />

      </div>

      {/* Bio */}

      <div className="mt-12">

        <p
          className="
            mb-4
            text-sm
            font-semibold
            uppercase
            tracking-wider
            text-muted-foreground
          "
        >
          About
        </p>

        <div
          className="
            rounded-3xl
            border
            border-border
            bg-muted
            p-6

            leading-8

            text-foreground
          "
        >
          {profile.bio || "No bio added yet."}
        </div>

      </div>
    </div>
  );
}

interface InfoProps {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
}

function Info({
  icon,
  title,
  value,
}: InfoProps) {
  return (
    <div
      className="
        rounded-3xl

        border
        border-border

        bg-muted/30

        p-6

        transition-all
        duration-300

        hover:-translate-y-1
        hover:bg-muted
      "
    >
      <div
        className="
          flex
          items-center
          gap-3

          text-muted-foreground
        "
      >
        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center

            rounded-xl

            bg-muted
          "
        >
          {icon}
        </div>

        <span className="text-sm font-medium">
          {title}
        </span>
      </div>

      <p
        className="
          mt-5

          break-words

          text-lg
          font-semibold

          text-foreground
        "
      >
        {value}
      </p>
    </div>
  );
}
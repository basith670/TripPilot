"use client";

import { UserProfile } from "@/types/profile";

interface ProfileFormProps {
  profile: UserProfile;

  setProfile: React.Dispatch<
    React.SetStateAction<UserProfile | null>
  >;

  onSave: () => void;

  onCancel: () => void;

  loading: boolean;
}

export default function ProfileForm({
  profile,
  setProfile,
  onSave,
  onCancel,
  loading,
}: ProfileFormProps) {
  const updateField = (
    field: keyof UserProfile,
    value: any
  ) => {
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            [field]: value,
          }
        : prev
    );
  };

  return (
    <section
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

      <div>

        <h2
          className="
            text-3xl
            font-bold
            text-foreground
          "
        >
          Personal Information
        </h2>

        <p
          className="
            mt-2
            text-muted-foreground
          "
        >
          Update your profile details.
        </p>

      </div>

      {/* Form */}

      <div className="mt-10 grid gap-6 md:grid-cols-2">

        {/* First Name */}

        <div>

          <label
            className="
              mb-2
              block
              font-medium
              text-foreground
            "
          >
            First Name
          </label>

          <input
            value={profile.first_name}
            onChange={(e) =>
              updateField(
                "first_name",
                e.target.value
              )
            }
            className="
              w-full

              rounded-2xl

              border
              border-border

              bg-background

              p-3

              text-foreground

              outline-none

              transition-all
              duration-300

              focus:border-cyan-500
              focus:ring-2
              focus:ring-cyan-500/20
            "
          />

        </div>

        {/* Last Name */}

        <div>

          <label
            className="
              mb-2
              block
              font-medium
              text-foreground
            "
          >
            Last Name
          </label>

          <input
            value={profile.last_name}
            onChange={(e) =>
              updateField(
                "last_name",
                e.target.value
              )
            }
            className="
              w-full
              rounded-2xl
              border
              border-border
              bg-background
              p-3
              text-foreground
              outline-none
              transition-all
              duration-300
              focus:border-cyan-500
              focus:ring-2
              focus:ring-cyan-500/20
            "
          />

        </div>

        {/* Email */}

        <div>

          <label
            className="
              mb-2
              block
              font-medium
              text-foreground
            "
          >
            Email
          </label>

          <input
            type="email"
            value={profile.email}
            onChange={(e) =>
              updateField(
                "email",
                e.target.value
              )
            }
            className="
              w-full
              rounded-2xl
              border
              border-border
              bg-background
              p-3
              text-foreground
              outline-none
              transition-all
              duration-300
              focus:border-cyan-500
              focus:ring-2
              focus:ring-cyan-500/20
            "
          />

        </div>

        {/* Phone */}

        <div>

          <label
            className="
              mb-2
              block
              font-medium
              text-foreground
            "
          >
            Phone Number
          </label>

          <input
            value={profile.phone_number}
            onChange={(e) =>
              updateField(
                "phone_number",
                e.target.value
              )
            }
            className="
              w-full
              rounded-2xl
              border
              border-border
              bg-background
              p-3
              text-foreground
              outline-none
              transition-all
              duration-300
              focus:border-cyan-500
              focus:ring-2
              focus:ring-cyan-500/20
            "
          />

        </div>

        {/* Date */}

        <div>

          <label
            className="
              mb-2
              block
              font-medium
              text-foreground
            "
          >
            Date of Birth
          </label>

          <input
            type="date"
            value={profile.date_of_birth ?? ""}
            onChange={(e) =>
              updateField(
                "date_of_birth",
                e.target.value
              )
            }
            className="
              w-full
              rounded-2xl
              border
              border-border
              bg-background
              p-3
              text-foreground
              outline-none
              transition-all
              duration-300
              focus:border-cyan-500
              focus:ring-2
              focus:ring-cyan-500/20
            "
          />

        </div>

        {/* Country */}

        <div>

          <label
            className="
              mb-2
              block
              font-medium
              text-foreground
            "
          >
            Country
          </label>

          <input
            value={profile.country}
            onChange={(e) =>
              updateField(
                "country",
                e.target.value
              )
            }
            className="
              w-full
              rounded-2xl
              border
              border-border
              bg-background
              p-3
              text-foreground
              outline-none
              transition-all
              duration-300
              focus:border-cyan-500
              focus:ring-2
              focus:ring-cyan-500/20
            "
          />

        </div>
                {/* City */}

                <div>

<label
  className="
    mb-2
    block
    font-medium
    text-foreground
  "
>
  City
</label>

<input
  value={profile.city}
  onChange={(e) =>
    updateField(
      "city",
      e.target.value
    )
  }
  className="
    w-full
    rounded-2xl
    border
    border-border
    bg-background
    p-3
    text-foreground
    outline-none
    transition-all
    duration-300
    focus:border-cyan-500
    focus:ring-2
    focus:ring-cyan-500/20
  "
/>

</div>

{/* Currency */}

<div>

<label
  className="
    mb-2
    block
    font-medium
    text-foreground
  "
>
  Preferred Currency
</label>

<select
  value={profile.preferred_currency}
  onChange={(e) =>
    updateField(
      "preferred_currency",
      e.target.value
    )
  }
  className="
    w-full
    rounded-2xl
    border
    border-border
    bg-background
    p-3
    text-foreground
    outline-none
    transition-all
    duration-300
    focus:border-cyan-500
    focus:ring-2
    focus:ring-cyan-500/20
  "
>
  <option value="INR">INR</option>
  <option value="USD">USD</option>
  <option value="EUR">EUR</option>
  <option value="AED">AED</option>
  <option value="GBP">GBP</option>
</select>

</div>

{/* Language */}

<div className="md:col-span-2">

<label
  className="
    mb-2
    block
    font-medium
    text-foreground
  "
>
  Preferred Language
</label>

<select
  value={profile.preferred_language}
  onChange={(e) =>
    updateField(
      "preferred_language",
      e.target.value
    )
  }
  className="
    w-full
    rounded-2xl
    border
    border-border
    bg-background
    p-3
    text-foreground
    outline-none
    transition-all
    duration-300
    focus:border-cyan-500
    focus:ring-2
    focus:ring-cyan-500/20
  "
>
  <option value="en">
    English
  </option>

  <option value="hi">
    Hindi
  </option>

  <option value="ar">
    Arabic
  </option>

  <option value="fr">
    French
  </option>

</select>

</div>

{/* Bio */}

<div className="md:col-span-2">

<label
  className="
    mb-2
    block
    font-medium
    text-foreground
  "
>
  Bio
</label>

<textarea
  rows={6}
  value={profile.bio}
  onChange={(e) =>
    updateField(
      "bio",
      e.target.value
    )
  }
  placeholder="Tell everyone about yourself..."
  className="
    w-full
    rounded-2xl
    border
    border-border
    bg-background
    p-4
    text-foreground
    outline-none
    transition-all
    duration-300
    focus:border-cyan-500
    focus:ring-2
    focus:ring-cyan-500/20
  "
/>

</div>

</div>

{/* Footer */}

<div
className="
mt-10

flex
justify-end
gap-4

border-t
border-border

pt-8
"
>

<button
type="button"
onClick={onCancel}
disabled={loading}
className="
  rounded-2xl

  border
  border-border

  bg-background

  px-8
  py-3

  font-semibold

  text-foreground

  transition-all
  duration-300

  hover:bg-muted

  disabled:cursor-not-allowed
  disabled:opacity-60
"
>
Cancel
</button>

<button
type="button"
onClick={onSave}
disabled={loading}
className="
  rounded-2xl

  bg-gradient-to-r
  from-blue-600
  via-cyan-500
  to-indigo-600

  px-8
  py-3

  font-semibold
  text-white

  shadow-lg

  transition-all
  duration-300

  hover:-translate-y-1
  hover:shadow-xl

  disabled:cursor-not-allowed
  disabled:opacity-60
  disabled:hover:translate-y-0
"
>
{loading
  ? "Saving..."
  : "Save Changes"}
</button>

</div>

</section>
);
}
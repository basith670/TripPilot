"use client";

import {
  Dispatch,
  SetStateAction,
} from "react";

import { Camera } from "lucide-react";

import { UserProfile } from "@/types/profile";


interface AvatarUploaderProps {
  profile: UserProfile;

  setProfile: Dispatch<
    SetStateAction<UserProfile | null>
  >;
}


export default function AvatarUploader({
  profile,
  setProfile,
}: AvatarUploaderProps) {

  const handleImageChange = (
    file: File
  ) => {

    // ==================================================
    // FILE TYPE VALIDATION
    // ==================================================

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      alert(
        "Please select a JPG, PNG, or WEBP image."
      );

      return;
    }


    // ==================================================
    // FILE SIZE VALIDATION
    // ==================================================

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert(
        "Profile picture must be smaller than 5 MB."
      );

      return;
    }


    // ==================================================
    // CREATE LOCAL PREVIEW
    // ==================================================

    const preview =
      URL.createObjectURL(file);


    // ==================================================
    // UPDATE PROFILE STATE
    // ==================================================

    setProfile((prev) =>
      prev
        ? {
            ...prev,

            // Temporary browser preview
            profile_picture:
              preview,

            // Actual file that will be
            // uploaded to Django/Cloudinary
            profilePictureFile:
              file,
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

      <div
        className="
          flex
          flex-col
          items-center
        "
      >

        {/* ==================================================
            AVATAR
        ================================================== */}

        <div className="relative">

          {profile.profile_picture ? (

            <img
              src={
                profile.profile_picture
              }
              alt="Profile"
              className="
                h-40
                w-40

                rounded-full

                border-4
                border-cyan-500/20

                object-cover

                shadow-2xl
              "
            />

          ) : (

            <div
              className="
                flex

                h-40
                w-40

                items-center
                justify-center

                rounded-full

                bg-gradient-to-br
                from-blue-600
                via-cyan-500
                to-indigo-600

                text-5xl
                font-black
                text-white

                shadow-2xl
              "
            >
              {profile.first_name
                ? profile.first_name[0]
                    .toUpperCase()
                : "?"}
            </div>

          )}


          {/* ==================================================
              UPLOAD BUTTON
          ================================================== */}

          <label
            className="
              absolute

              bottom-2
              right-2

              flex

              h-12
              w-12

              cursor-pointer

              items-center
              justify-center

              rounded-full

              bg-gradient-to-r
              from-blue-600
              via-cyan-500
              to-indigo-600

              text-white

              shadow-lg

              transition-all
              duration-300

              hover:scale-110
              hover:shadow-xl
            "
          >

            <Camera size={18} />

            <input
              hidden
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => {

                const file =
                  event.target.files?.[0];

                if (file) {
                  handleImageChange(file);
                }

                // Allow selecting the same
                // image again later.
                event.target.value = "";
              }}
            />

          </label>

        </div>


        {/* ==================================================
            USER NAME
        ================================================== */}

        <h2
          className="
            mt-7

            text-3xl
            font-bold

            text-foreground
          "
        >
          {profile.first_name}{" "}
          {profile.last_name}
        </h2>


        {/* ==================================================
            USERNAME
        ================================================== */}

        <p
          className="
            mt-2

            text-lg

            text-muted-foreground
          "
        >
          @{profile.username}
        </p>


        {/* ==================================================
            FILE INFORMATION
        ================================================== */}

        <div
          className="
            mt-6

            rounded-2xl

            border
            border-border

            bg-muted

            px-5
            py-3

            text-sm

            text-muted-foreground
          "
        >
          JPG, PNG or WEBP • Maximum 5 MB
        </div>

      </div>

    </section>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";

import {
  Copy,
  Edit3,
  MoreVertical,
  Trash2,
} from "lucide-react";

interface Props {
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export default function DayActionsMenu({
  onEdit,
  onDuplicate,
  onDelete,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const menuRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (
      event: MouseEvent
    ) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handler
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handler
      );
  }, []);

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      {/* Menu Button */}

      <button
        onClick={() =>
          setOpen(!open)
        }
        className="
          flex
          h-11
          w-11
          items-center
          justify-center

          rounded-2xl

          border
          border-border

          bg-background

          text-muted-foreground

          transition-all

          hover:border-blue-500
          hover:bg-blue-500/10
          hover:text-blue-500
        "
      >
        <MoreVertical size={18} />
      </button>

      {/* Dropdown */}

      {open && (
        <div
          className="
            absolute
            right-0
            top-14
            z-50

            w-60

            overflow-hidden

            rounded-3xl

            border
            border-border

            bg-card

            p-2

            shadow-2xl

            backdrop-blur-xl
          "
        >
          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="
              flex
              w-full
              items-center
              gap-3

              rounded-2xl

              px-4
              py-3

              text-left

              text-foreground

              transition

              hover:bg-muted
            "
          >
            <Edit3
              size={18}
              className="text-blue-500"
            />

            <span className="font-medium">
              Edit Day
            </span>
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onDuplicate();
            }}
            className="
              mt-1

              flex
              w-full
              items-center
              gap-3

              rounded-2xl

              px-4
              py-3

              text-left

              text-foreground

              transition

              hover:bg-muted
            "
          >
            <Copy
              size={18}
              className="text-cyan-500"
            />

            <span className="font-medium">
              Duplicate Day
            </span>
          </button>

          <div className="my-2 border-t border-border" />

          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="
              flex
              w-full
              items-center
              gap-3

              rounded-2xl

              px-4
              py-3

              text-left

              text-red-500

              transition

              hover:bg-red-500/10
            "
          >
            <Trash2 size={18} />

            <span className="font-medium">
              Delete Day
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
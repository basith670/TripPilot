"use client";

import { useEffect, useRef, useState } from "react";

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
  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
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
      <button
        onClick={() => setOpen(!open)}
        className="rounded-lg p-2 transition hover:bg-gray-100"
      >
        ⋮
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl border bg-white py-2 shadow-xl">
          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gray-100"
          >
            ✏ Edit Day
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onDuplicate();
            }}
            className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gray-100"
          >
            📄 Duplicate Day
          </button>

          <hr className="my-2" />

          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="flex w-full items-center gap-3 px-4 py-2 text-left text-red-600 hover:bg-red-50"
          >
            🗑 Delete Day
          </button>
        </div>
      )}
    </div>
  );
}
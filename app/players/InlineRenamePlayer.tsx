"use client";

import { useRef, useState } from "react";
import { Pencil } from "lucide-react";

type Props = {
  playerName: string;
  action: (formData: FormData) => void;
};

export default function InlineRenamePlayer({
  playerName,
  action,
}: Props) {
  const [editing, setEditing] =
    useState(false);

  const inputRef =
    useRef<HTMLInputElement>(null);

  if (!editing) {
    return (
      <div className="flex items-center gap-3">
        <h1 className="font-display text-3xl font-bold text-mj-green">
          {playerName}
        </h1>

        <button
          type="button"
          onClick={() => {
            setEditing(true);

            setTimeout(() => {
              inputRef.current?.select();
            }, 0);
          }}
          className="text-gray-500 hover:text-black"
        >
          <Pencil size={18} />
        </button>
      </div>
    );
  }

  return (
    <form
  action={async (formData) => {
    await action(formData);
    setEditing(false);
  }}
  className="inline-block"
>
      <input

  ref={inputRef}

  name="name"

  defaultValue={playerName}

  className="w-[10ch] bg-transparent text-3xl font-bold text-mj-green outline-none"

  autoFocus

  onKeyDown={(event) => {

    if (event.key === "Escape") {

      event.preventDefault();

      setEditing(false);

    }

  }}

/>

<button

  type="submit"

  className="hidden"

  aria-hidden

/>
    </form>
  );
}
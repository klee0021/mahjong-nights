"use client";

import {
  useRef,
  useState,
} from "react";
import {
  Pencil,
} from "lucide-react";

type Props = {
  sessionName: string;
  action: (formData: FormData) => void;
};

export default function InlineRenameSession({
  sessionName,
  action,
}: Props) {
  const [editing, setEditing] =
  useState(false);

const inputRef =
  useRef<HTMLInputElement>(
    null
  );

  if (!editing) {
  return (
    <div className="flex items-center gap-3">
      <h1 className="text-4xl font-bold">
        {sessionName}
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
  aria-label="Rename Session"
  title="Rename Session"
>
  <Pencil size={18} />
</button>
    </div>
  );
}

  return (
  <form
    action={action}
    className="mt-2 flex items-center gap-3"
  >
    <input
      ref={inputRef}
      name="name"
      defaultValue={sessionName}
      className="w-full bg-transparent px-0 text-4xl font-bold outline-none"
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
  aria-label="Save Session Name"
  title="Save Session Name"
/>
  </form>
  );
}
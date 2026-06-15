"use client";

import { useState } from "react";

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

  if (!editing) {
  return (
    <div className="flex items-center gap-3">
      <h1 className="text-4xl font-bold">
        {sessionName}
      </h1>

      <button
  type="button"
  onClick={() =>
    setEditing(true)
  }
  className="text-2xl text-gray-500 hover:text-black"
  aria-label="Rename Session"
  title="Rename Session"
>
  ✏️
</button>
    </div>
  );
}

  return (
    <form
      action={action}
      className="mt-2 flex flex-col gap-2"
    >
      <input
        name="name"
        defaultValue={sessionName}
        className="w-full rounded border px-3 py-2 text-4xl font-bold"
        autoFocus
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded border px-4 py-2"
        >
          Save
        </button>

        <button
          type="button"
          onClick={() =>
            setEditing(false)
          }
          className="rounded border px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
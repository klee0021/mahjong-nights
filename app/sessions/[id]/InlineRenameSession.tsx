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
      <button
        type="button"
        onClick={() =>
          setEditing(true)
        }
        className="rounded border px-4 py-2"
      >
        Rename Session
      </button>
    );
  }

  return (
    <form
  action={action}
  className="flex flex-col gap-2 md:flex-row"
>
      <input
  name="name"
  defaultValue={sessionName}
  className="w-full rounded border px-3 py-2 md:w-auto"
/>

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
    </form>
  );
}
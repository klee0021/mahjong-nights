"use client";

export default function DeleteSessionButton() {
  return (
    <button
      type="submit"
      className="rounded border border-red-500 px-4 py-2 text-red-600"
      onClick={(event) => {
        if (
          !confirm(
            "Delete this session? This cannot be undone."
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      Delete Session
    </button>
  );
}
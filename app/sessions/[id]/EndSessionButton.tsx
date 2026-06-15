"use client";

export default function EndSessionButton() {
  return (
    <button
      type="submit"
      className="rounded border px-4 py-2"
      onClick={(e) => {
        if (
          !window.confirm(
            "Are you sure you want to end this session?\n\nYou can still view scores and hand history, but no new games can be recorded."
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      End Session
    </button>
  );
}
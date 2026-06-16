"use client";

export default function DeleteHandButton() {
  return (
    <button
      type="submit"
      className="font-medium text-red-600 hover:text-red-800"
      onClick={(event) => {
        if (
          !confirm(
            "Delete this hand?"
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      Delete
    </button>
  );
}
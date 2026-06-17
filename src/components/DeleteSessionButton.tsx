"use client";

export default function DeleteSessionButton() {
  return (
    <button
      type="submit"
      className="w-full rounded-2xl border border-[#e5b5b5] bg-[#fff2f2] px-4 py-3 font-semibold text-[#b34242] transition hover:bg-[#ffe8e8]"
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
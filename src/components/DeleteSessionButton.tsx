"use client";
import { TapButton } from "@/src/components/ui/TapButton";

export default function DeleteSessionButton() {
  return (
  <TapButton
    custom
    type="submit"
    className="w-full rounded-2xl border border-[#e5b5b5] bg-[#fff2f2] px-4 py-3 font-semibold text-[#b34242] transition"
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
  </TapButton>
);
}
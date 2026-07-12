"use client";

import { useFormStatus } from "react-dom";
import { TapButton } from "@/src/components/ui/TapButton";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <>
      <TapButton
        custom
        type="submit"
        disabled={pending}
        className="w-full rounded-2xl border border-[#e5b5b5] bg-[#fff2f2] px-4 py-3 font-semibold text-[#b34242] transition disabled:opacity-60"
        onClick={(event) => {
          if (
            !pending &&
            !confirm(
              "Delete this session? This cannot be undone."
            )
          ) {
            event.preventDefault();
          }
        }}
      >
        {pending
          ? "Deleting..."
          : "Delete Session"}
      </TapButton>

      {pending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm">
          <div className="rounded-3xl bg-white px-8 py-7 shadow-xl">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-mj-line border-t-mj-green" />

            <div className="text-center font-extrabold text-mj-green">
              Deleting session...
            </div>

            <div className="mt-1 text-center text-sm text-mj-muted">
              Updating leaderboards and player statistics
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function DeleteSessionButton() {
  return <SubmitButton />;
}
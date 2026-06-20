"use client";

import { useRouter } from "next/navigation";
import { TapCard } from "@/src/components/ui/TapCard";

export default function HomeCreateSessionButton() {
  const router = useRouter();

  return (
    <TapCard
  onClick={() => router.push("/sessions")}
  className="mt-3 rounded-2xl border-[1.5px] border-dashed border-[#c4bca6] py-3 text-[13px] font-extrabold tracking-wide text-mj-green"
>
  <div className="w-full text-center">
    + CREATE SESSION
  </div>
</TapCard>
  );
}
"use client";

import { useRouter } from "next/navigation";
import { MahjongTile } from "@/src/components/mj/MahjongTile";
import { TapCard } from "@/src/components/ui/TapCard";
import type { SessionSummary } from "@/src/lib/types";

export default function SessionRow({
  s,
}: {
  s: SessionSummary;
}) {
  const router = useRouter();

  return (
    <TapCard
      onClick={() =>
        router.push(`/sessions/${s.id}`)
      }
      className="flex items-center gap-3 rounded-2xl border border-mj-line bg-mj-card px-3.5 py-3.5 hover:bg-mj-paper"
    >
      <MahjongTile
        char={(s as any).tile ?? "🀄"}
        size="sm"
      />

      <div className="flex-1">
        <div className="text-[15px] font-extrabold">
          {s.name}
        </div>

        <div className="text-xs text-mj-muted">
          {[
            new Date(
              s.created_at
            ).toLocaleDateString(
              "en-GB"
            ),
            `${s.player_count ?? 0} players`,
            `${s.hand_count ?? 0} hands`,
          ].join(" · ")}
        </div>
      </div>

      <span className="text-lg text-[#b6ad97]">
        ›
      </span>
    </TapCard>
  );
}
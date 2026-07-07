"use client";

import { useRouter } from "next/navigation";
import { MahjongTile } from "@/src/components/mj/MahjongTile";
import { TapCard } from "@/src/components/ui/TapCard";
import type { SessionSummary } from "@/src/lib/types";

export default function HomeSessionCard({
  session,
}: {
  session: SessionSummary;
}) {
  const router = useRouter();

  return (
    <TapCard
      onClick={() =>
        router.push(`/sessions/${session.id}`)
      }
      className="rounded-2xl border border-mj-line bg-mj-paper px-3.5 py-3"
    >
      <div className="flex items-center gap-3">
        <MahjongTile
          char={(session as any).tile ?? "🀄"}
          size="sm"
        />

        <div className="flex-1">
          <div className="text-[15px] font-extrabold">
            {session.name}
          </div>

          <div className="text-xs text-mj-muted">
            {[
              new Date(
                session.created_at
              ).toLocaleDateString("en-GB"),
              `${session.player_count ?? 0} players`,
              `${session.hand_count ?? 0} hands`,
            ].join(" · ")}
          </div>
        </div>

        <span className="text-xl font-bold text-mj-green">
          →
        </span>
      </div>
    </TapCard>
  );
}
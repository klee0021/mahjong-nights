"use client";

import { useRouter } from "next/navigation";
import { Medal, ScoreValue } from "@/src/components/ui/primitives";
import { TapCard } from "@/src/components/ui/TapCard";
import type { Player } from "@/src/lib/types";

export default function PlayerCard({
  player,
  rank,
}: {
  player: Player;
  rank: number;
}) {
  const router = useRouter();

  return (
    <TapCard
      onClick={() => router.push(`/players/${player.id}`)}
      className="rounded-2xl border border-mj-line bg-mj-card px-4 py-3"
    >
      <div className="flex items-center gap-3">
        <Medal rank={rank} />

        <span className="flex-1 text-[15px] font-extrabold text-mj-green">
          {player.name}
        </span>

        <span className="text-xs font-bold text-mj-muted">
          {player.wins}W
        </span>

        <ScoreValue
          value={player.total_score}
          className="w-14 text-right text-[16px]"
        />
      </div>
    </TapCard>
  );
}
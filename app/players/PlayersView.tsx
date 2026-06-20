"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Medal,
  ScoreValue,
} from "@/src/components/ui/primitives";
import { TapCard } from "@/src/components/ui/TapCard";
import type { Player } from "@/src/lib/types";

export default function PlayersView({
  players,
}: {
  players: Player[];
}) {
const router = useRouter();
  const [orderBy, setOrderBy] =
    useState<"score" | "wins" | "name">(
      "score"
    );
const scoreRanks = new Map<string, number>();

[...players]
  .sort((a, b) => {
    if (
      b.total_score !==
      a.total_score
    ) {
      return (
        b.total_score -
        a.total_score
      );
    }

    return a.name.localeCompare(
      b.name
    );
  })
  .forEach((player, index, arr) => {
    let currentRank = 0;

[...players]
  .sort((a, b) => {
    if (b.total_score !== a.total_score) {
      return b.total_score - a.total_score;
    }

    return a.name.localeCompare(b.name);
  })
  .forEach((player, index, arr) => {
    if (
      index === 0 ||
      player.total_score !==
        arr[index - 1].total_score
    ) {
      currentRank++;
    }

    scoreRanks.set(
      player.id,
      currentRank
    );
  });
  });

  const sortedPlayers = useMemo(() => {
    const copy = [...players];

    switch (orderBy) {
      case "wins":
  return copy.sort((a, b) => {
    if (b.wins !== a.wins) {
      return b.wins - a.wins;
    }

    return a.name.localeCompare(
      b.name
    );
  });

      case "name":
        return copy.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

      default:
  return copy.sort((a, b) => {
    if (
      b.total_score !==
      a.total_score
    ) {
      return (
        b.total_score -
        a.total_score
      );
    }

    return a.name.localeCompare(
      b.name
    );
  });
    }
  }, [players, orderBy]);

  return (
    <>
      <div className="mb-4">
        <div className="mb-3 flex items-center gap-3">
  <span className="text-sm font-bold text-mj-muted">
    Sort:
  </span>

  <div className="inline-flex rounded-2xl border border-mj-line bg-mj-card p-1">
    {[
            ["score", "Score"],
            ["wins", "Wins"],
            ["name", "Name"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                setOrderBy(
                  value as
                    | "score"
                    | "wins"
                    | "name"
                )
              }
              className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
  orderBy === value
    ? "bg-mj-green text-white"
    : "text-mj-muted hover:text-mj-green"
}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
</div>

      <ul className="flex flex-col gap-2.5">
        {sortedPlayers.map((p, i) => (
          <TapCard
  key={p.id}
  onClick={() =>
    router.push(`/players/${p.id}`)
  }
  className="flex w-full items-center gap-3 rounded-2xl border border-mj-line bg-mj-card px-4 py-3 text-left shadow-[0_14px_30px_-24px_rgba(20,18,12,.3)]"
>
            <Medal
  rank={
    scoreRanks.get(p.id) ??
    i + 1
  }
/>

            <span className="flex-1 text-[15px] font-extrabold text-mj-green">
  {p.name}
</span>

            <span className="text-xs font-bold text-mj-muted">
              {p.wins}W
            </span>

            <ScoreValue
              value={p.total_score}
              className="w-14 text-right text-[16px]"
            />
          </TapCard>
        ))}
      </ul>
    </>
  );
}
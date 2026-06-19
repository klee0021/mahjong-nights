import { Medal, ScoreValue } from "./primitives";
import type { Standing } from "@/src/lib/types";

export function Leaderboard({ rows }: { rows: Standing[] }) {
  if (!rows.length)
    return (
      <p className="px-4 py-6 text-center text-mj-muted">
        No games recorded yet.
      </p>
    );

  const sortedRows = [...rows].sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }

    return a.name.localeCompare(b.name);
  });

  let currentRank = 0;

  const ranks = new Map<string, number>();

  sortedRows.forEach((row, index, arr) => {
    if (
      index === 0 ||
      row.points !== arr[index - 1].points
    ) {
      currentRank++;
    }

    ranks.set(row.name, currentRank);
  });

  return (
    <ul className="divide-y divide-mj-line/70">
      {sortedRows.map((r, i) => (
        <li
          key={r.name}
          className={`flex items-center gap-3 px-4 py-3 ${
            i === 0
              ? "bg-gradient-to-r from-[#fbf6ea] to-transparent"
              : ""
          }`}
        >
          <Medal rank={ranks.get(r.name)!} />

          <div className="flex-1">
            <div className="text-[15px] font-extrabold">
              {r.name}
            </div>

            {(r.wins != null || r.wind) && (
              <div className="text-xs text-mj-muted">
                {[r.wind, r.wins != null ? `${r.wins} wins` : null]
                  .filter(Boolean)
                  .join(" · ")}
              </div>
            )}
          </div>

          <ScoreValue
            value={r.points}
            className="text-[18px]"
          />
        </li>
      ))}
    </ul>
  );
}

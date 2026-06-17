import { Medal, ScoreValue } from "./primitives";
import type { Standing } from "@/src/lib/types";

export function Leaderboard({ rows }: { rows: Standing[] }) {
  if (!rows.length) return <p className="px-4 py-6 text-center text-mj-muted">No games recorded yet.</p>;
  return (
    <ul className="divide-y divide-mj-line/70">
      {rows.map((r, i) => (
        <li key={r.name} className={`flex items-center gap-3 px-4 py-3 ${i === 0 ? "bg-gradient-to-r from-[#fbf6ea] to-transparent" : ""}`}>
          <Medal rank={i + 1} />
          <div className="flex-1">
            <div className="text-[15px] font-extrabold">{r.name}</div>
            {(r.wins != null || r.wind) && (
              <div className="text-xs text-mj-muted">{[r.wind, r.wins != null ? `${r.wins} wins` : null].filter(Boolean).join(" · ")}</div>
            )}
          </div>
          <ScoreValue value={r.points} className="text-[18px]" />
        </li>
      ))}
    </ul>
  );
}

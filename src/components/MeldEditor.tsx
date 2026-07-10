"use client";

// app/sessions/[id]/record-game/MeldEditor.tsx
// ---------------------------------------------------------------------------
// Concept 09 — Meld Editor.
// Opened inside the Record-a-Hand wizard (Step 3) when a meld/pair is tapped.
// Fully controlled: holds no state of its own — the wizard owns the tiles and
// passes handlers, so the same editor serves every meld and the pair.
// Safari-safe: every tap target is a real <button> via the shared primitives.
// ---------------------------------------------------------------------------
import { useState } from "react";
import { Card, Button, SegButton, TAP } from "@/src/components/ui/primitives";
import { MahjongTile } from "@/src/components/mj/MahjongTile";
import { TilePalette } from "@/src/components/mj/TilePalette";

export type MeldEditorProps = {
  title: string;
  tiles: string[];
  max: number;
  showMethod: boolean;
  source: string;
  others: string[];
 onCancel: () => void;
onSave: (
  tiles: string[],
  source: string
) => void;
};

export function MeldEditor({
title,
  tiles,
  max,
  showMethod,
  source,
  others,
  onCancel,
  onSave,
}: MeldEditorProps) {

const [localTiles, setLocalTiles] = useState(tiles);
const [localSource, setLocalSource] = useState<string>(source ?? "");

  return (
    <>
      {/* Header — ‹ · Editing · Meld N · Save (matches Concept 09) */}
      <div className="mb-3 flex items-center justify-between">
        <button
  type="button"
  onClick={onCancel}
  aria-label="Back"
  className={`${TAP} flex h-[34px] w-[34px] items-center justify-center rounded-xl border border-mj-line bg-mj-card text-[17px] text-mj-green`}
>
  ‹
</button>
        <span className="font-display text-lg font-bold text-mj-green">{title}</span>
        <button
  type="button"
  disabled={showMethod && localSource === ""}
  onClick={() => onSave(localTiles, localSource)}
  className={`${TAP} bg-transparent text-[13px] font-extrabold ${
    showMethod && localSource === ""
      ? "text-mj-muted opacity-50"
      : "text-mj-pos"
  }`}
>
  Save
</button>
      </div>

      {/* Selected-tiles counter */}
      <div className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-mj-gold">Selected Tiles · {localTiles.length} / {max}</div>

      {/* Tray — tap a chosen tile to remove */}
      <div className="mb-3.5 flex min-h-[77px] flex-wrap items-center gap-2.5 rounded-2xl border border-dashed border-[#d3cab3] bg-mj-card p-2.5">
        {localTiles.length ? (
          <>
            {localTiles.map((t, i) => (
  <MahjongTile
    key={i}
    char={t}
    size="lg"
    onClick={() =>
      setLocalTiles(
        localTiles.filter((_, idx) => idx !== i)
      )
    }
  />
))}
            <span className="ml-1 text-xs text-mj-muted">Tap to remove</span>
          </>
        ) : (
          <span className="pl-1 text-xs text-mj-muted">Select tiles below</span>
        )}
      </div>

      {/* Method (melds only — pair carries no claim) */}
      {showMethod && (
        <Card className="mb-3.5 p-3.5">
          <div className="mb-2.5 text-sm font-extrabold">Method</div>
          <div className="flex flex-wrap gap-2">
            <SegButton active={localSource === "self-draw"}
onClick={() => setLocalSource("self-draw")} className="rounded-[10px] px-3.5 py-2.5 text-xs">Self-Draw</SegButton>
            {others.map((name) => (
              <SegButton
  key={name}
  active={localSource === name}
onClick={() => setLocalSource(name)}
  className="rounded-[10px] px-3.5 py-2.5 text-xs"
>
  Claimed from {name}
</SegButton>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-3.5"><TilePalette
  onPick={(tile) => {
    if (localTiles.length < max) {
      setLocalTiles([...localTiles, tile]);
    }
  }}
/></Card>
    </>
  );
}

export default MeldEditor;

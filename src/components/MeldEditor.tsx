"use client";

import { useState } from "react";

type Props = {
  title: string;
  maxTiles: number;
  initialTiles?: string[];
availableTiles?: string[];
  initialSource?: string;
  sourceOptions?: string[];
  onSave: (
    tiles: string[],
    source?: string
  ) => void;
};

export default function MeldEditor({
  title,
  maxTiles,
  initialTiles = [],
availableTiles,
initialSource = "self-draw",
  sourceOptions = [],
  onSave,
}: Props) {
  const [selectedTiles, setSelectedTiles] =
  useState<string[]>(initialTiles);
const [source, setSource] =
  useState(initialSource);

  const characters = [
    "🀇", "🀈", "🀉", "🀊", "🀋", "🀌", "🀍", "🀎", "🀏",
  ];

  const bamboo = [
    "🀐", "🀑", "🀒", "🀓", "🀔", "🀕", "🀖", "🀗", "🀘",
  ];

  const dots = [
    "🀙", "🀚", "🀛", "🀜", "🀝", "🀞", "🀟", "🀠", "🀡",
  ];

  const winds = [
    "🀀", "🀁", "🀂", "🀃",
  ];

  const dragons = [
    "🀄", "🀅", "🀆",
  ];
function detectMeldType(
  tiles: string[]
) {
  if (tiles.length === 2) {
    if (tiles[0] === tiles[1]) {
      return "Pair";
    }

    return "Incomplete";
  }

  if (tiles.length === 3) {
    if (
      tiles[0] === tiles[1] &&
      tiles[1] === tiles[2]
    ) {
      return "Pung";
    }

    const allSuitTiles = [
      ...characters,
      ...bamboo,
      ...dots,
    ];

    const indexes = tiles
      .map((tile) =>
        allSuitTiles.indexOf(tile)
      )
      .sort((a, b) => a - b);

    if (
      indexes.every(
        (index) => index !== -1
      ) &&
      indexes[1] === indexes[0] + 1 &&
      indexes[2] === indexes[1] + 1
    ) {
      return "Chow";
    }
  }

  if (tiles.length === 4) {
    if (
      tiles.every(
        (tile) => tile === tiles[0]
      )
    ) {
      return "Kong";
    }
  }

    return "Incomplete";
}

function normalizeTiles(
  tiles: string[]
) {
  if (
    detectMeldType(tiles) !== "Chow"
  ) {
    return tiles;
  }

  const allSuitTiles = [
    ...characters,
    ...bamboo,
    ...dots,
  ];

  return [...tiles].sort(
    (a, b) =>
      allSuitTiles.indexOf(a) -
      allSuitTiles.indexOf(b)
  );
}

function addTile(tile: string) {
  setSelectedTiles((current) => {
    if (current.length >= maxTiles) {
      return current;
    }

    return [...current, tile];
  });
}
function undoLastTile() {
  setSelectedTiles((current) =>
    current.slice(0, -1)
  );
}

  function renderTiles(
    sectionTitle: string,
    tiles: string[]
  ) {
    return (
      <div className="mb-6">
        <h3 className="mb-2 font-semibold">
          {sectionTitle}
        </h3>

        <div className="grid grid-cols-4 gap-2">
          {tiles.map((tile) => {

            return (
              <button
                key={tile}
                onClick={() =>
  addTile(tile)
}
                className="h-16 rounded-xl border bg-white text-4xl"
              >
                {tile}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white p-6 shadow">
    

      <div className="mb-6">
        <h3 className="mb-2 font-semibold">
          Selected Tiles
        </h3>

        <div className="min-h-[60px] text-5xl">
          {selectedTiles.join(" ")}
        </div>
<p className="mt-2 text-sm text-gray-500">
  {selectedTiles.length}/{maxTiles} tiles selected
</p>
<div className="mt-4">
  <p className="mb-2 font-semibold">
  Method
</p>

  <label className="block">
  <input
    type="radio"
    checked={source === "self-draw"}
    onChange={() =>
      setSource("self-draw")
    }
  />
  {" "}Self-Draw
</label>

  {sourceOptions.map((option) => (
  <label
    key={option}
    className="block"
  >
    <input
      type="radio"
      checked={source === option}
      onChange={() =>
        setSource(option)
      }
    />
    {" "}Claimed from {option}
  </label>
))}
</div>

        <div className="mt-3 flex gap-2">
  <button
    onClick={undoLastTile}
    className="rounded border px-3 py-1 text-sm"
  >
    Undo Last
  </button>

  <button
    onClick={() =>
      setSelectedTiles([])
    }
    className="rounded border px-3 py-1 text-sm"
  >
    Clear
  </button>

  <button
  disabled={
    (maxTiles === 4 &&
      selectedTiles.length < 3) ||
    (maxTiles !== 4 &&
      selectedTiles.length !== maxTiles)
  }
  onClick={() =>
    onSave(
  normalizeTiles(
    selectedTiles
  ),
  source
)
  }
  className="rounded border px-3 py-1 text-sm disabled:opacity-50"
>
  Save
</button>
</div>
      </div>

      {availableTiles ? (
  renderTiles(
    "Possible Winning Tiles",
    [...new Set(availableTiles)]
  )
) : (
  <>
    {renderTiles(
      "Characters",
      characters
    )}

    {renderTiles(
      "Bamboo",
      bamboo
    )}

    {renderTiles(
      "Dots",
      dots
    )}

    {renderTiles(
      "Winds",
      winds
    )}

    {renderTiles(
      "Dragons",
      dragons
    )}
  </>
)}
    </div>
  );
}
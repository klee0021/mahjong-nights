"use client";

import { useState } from "react";

const tiles = [
  // Characters
  "🀇","🀈","🀉","🀊","🀋","🀌","🀍","🀎","🀏",

  // Bamboo
  "🀐","🀑","🀒","🀓","🀔","🀕","🀖","🀗","🀘",

  // Dots
  "🀙","🀚","🀛","🀜","🀝","🀞","🀟","🀠","🀡",

  // Winds
  "🀀","🀁","🀂","🀃",

  // Dragons
  "🀄","🀅","🀆",
];

export default function TilePickerPage() {
  const [selectedTiles, setSelectedTiles] = useState<string[]>([]);

  function addTile(tile: string) {
    setSelectedTiles((current) => [...current, tile]);
  }

  function clearTiles() {
    setSelectedTiles([]);
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4">
      <h1 className="mb-6 text-3xl font-bold">
        Tile Picker Prototype
      </h1>

      <div className="mb-6 rounded-xl bg-white p-4 shadow">
        <h2 className="mb-4 text-xl font-semibold">
          Selected Tiles
        </h2>

        <div className="mb-4 min-h-[80px] rounded-lg border bg-slate-50 p-3 text-center text-5xl">
          {selectedTiles.length
            ? selectedTiles.join(" ")
            : "Tap tiles below"}
        </div>

        <button
          onClick={clearTiles}
          className="rounded-lg border px-4 py-2"
        >
          Clear
        </button>
      </div>

      <div className="rounded-xl bg-white p-4 shadow">
        <h2 className="mb-4 text-xl font-semibold">
          Available Tiles
        </h2>

        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          {tiles.map((tile, index) => (
            <button
              key={index}
              onClick={() => addTile(tile)}
              className="
                flex
                h-20
                items-center
                justify-center
                rounded-xl
                border-2
                bg-white
                text-5xl
                shadow-sm
                active:scale-95
              "
            >
              {tile}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
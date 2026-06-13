"use client";

import { useState } from "react";

const tiles = [
  "🀇","🀈","🀉","🀊","🀋","🀌","🀍","🀎","🀏",
  "🀐","🀑","🀒","🀓","🀔","🀕","🀖","🀗","🀘",
  "🀙","🀚","🀛","🀜","🀝","🀞","🀟","🀠","🀡",
  "🀀","🀁","🀂","🀃",
  "🀄","🀅","🀆",
];

export default function MeldBuilderPage() {
  const [selectedTiles, setSelectedTiles] = useState<string[]>([]);
  const [status, setStatus] = useState("concealed");

  function addTile(tile: string) {
    if (selectedTiles.length >= 4) return;

    setSelectedTiles((current) => [
      ...current,
      tile,
    ]);
  }

  function removeTile(index: number) {
    setSelectedTiles((current) =>
      current.filter((_, i) => i !== index)
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4">
      <h1 className="mb-6 text-3xl font-bold">
        Meld Builder Prototype
      </h1>

      <div className="mb-6 rounded-xl bg-white p-4 shadow">
        <h2 className="mb-3 text-xl font-semibold">
          Meld 1
        </h2>

        <div className="mb-4 flex min-h-[90px] flex-wrap gap-2 rounded-lg border bg-slate-50 p-3">
          {selectedTiles.length === 0 ? (
            <p className="text-gray-500">
              Tap tiles below
            </p>
          ) : (
            selectedTiles.map((tile, index) => (
              <button
                key={index}
                onClick={() => removeTile(index)}
                className="rounded border bg-white p-2 text-5xl"
              >
                {tile}
              </button>
            ))
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">
            Status
          </h3>

          <label className="flex gap-2">
            <input
              type="radio"
              checked={status === "concealed"}
              onChange={() =>
                setStatus("concealed")
              }
            />
            Concealed
          </label>

          <label className="flex gap-2">
            <input
              type="radio"
              checked={status === "exposed"}
              onChange={() =>
                setStatus("exposed")
              }
            />
            Exposed
          </label>
        </div>
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
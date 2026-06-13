"use client";

import { useState } from "react";

type Meld = {
  tiles: string[];
  status: "concealed" | "exposed";
  takenFrom: string;
};

type ActiveSection =
  | "meld1"
  | "meld2"
  | "meld3"
  | "meld4"
  | "pair";

export default function HandBuilderPage() {
  const [melds, setMelds] = useState<Meld[]>([
    {
      tiles: [],
      status: "concealed",
      takenFrom: "",
    },
    {
      tiles: [],
      status: "concealed",
      takenFrom: "",
    },
    {
      tiles: [],
      status: "concealed",
      takenFrom: "",
    },
    {
      tiles: [],
      status: "concealed",
      takenFrom: "",
    },
  ]);

  const [pair, setPair] = useState<string[]>([]);

  const [activeSection, setActiveSection] =
    useState<ActiveSection>("meld1");

  // Test players for now
  const players = [
    "Kenny",
    "Rudi",
    "Shine",
    "Andy",
  ];

  const characters = [
    "🀇","🀈","🀉","🀊","🀋","🀌","🀍","🀎","🀏",
  ];

  const bamboo = [
    "🀐","🀑","🀒","🀓","🀔","🀕","🀖","🀗","🀘",
  ];

  const dots = [
    "🀙","🀚","🀛","🀜","🀝","🀞","🀟","🀠","🀡",
  ];

  const winds = [
    "🀀","🀁","🀂","🀃",
  ];

  const dragons = [
    "🀄","🀅","🀆",
  ];

  function getActiveMeldIndex() {
    switch (activeSection) {
      case "meld1":
        return 0;
      case "meld2":
        return 1;
      case "meld3":
        return 2;
      case "meld4":
        return 3;
      default:
        return -1;
    }
  }

  function addTile(tile: string) {
    if (activeSection === "pair") {
      if (pair.length >= 2) return;

      setPair((current) => [
        ...current,
        tile,
      ]);

      return;
    }

    const meldIndex =
      getActiveMeldIndex();

    setMelds((current) =>
      current.map((meld, index) => {
        if (index !== meldIndex) {
          return meld;
        }

        if (meld.tiles.length >= 4) {
          return meld;
        }

        return {
          ...meld,
          tiles: [...meld.tiles, tile],
        };
      })
    );
  }

  function removeTile(tileIndex: number) {
    if (activeSection === "pair") {
      setPair((current) =>
        current.filter(
          (_, index) =>
            index !== tileIndex
        )
      );

      return;
    }

    const meldIndex =
      getActiveMeldIndex();

    setMelds((current) =>
      current.map((meld, index) => {
        if (index !== meldIndex) {
          return meld;
        }

        return {
          ...meld,
          tiles: meld.tiles.filter(
            (_, tilePos) =>
              tilePos !== tileIndex
          ),
        };
      })
    );
  }

  function updateStatus(
    status: "concealed" | "exposed"
  ) {
    const meldIndex =
      getActiveMeldIndex();

    if (meldIndex < 0) return;

    setMelds((current) =>
      current.map((meld, index) => {
        if (index !== meldIndex) {
          return meld;
        }

        return {
          ...meld,
          status,
        };
      })
    );
  }

  function updateTakenFrom(
    takenFrom: string
  ) {
    const meldIndex =
      getActiveMeldIndex();

    if (meldIndex < 0) return;

    setMelds((current) =>
      current.map((meld, index) => {
        if (index !== meldIndex) {
          return meld;
        }

        return {
          ...meld,
          takenFrom,
        };
      })
    );
  }

  const activeMeld =
    activeSection === "pair"
      ? null
      : melds[getActiveMeldIndex()];

  function renderTileGroup(
    title: string,
    tiles: string[]
  ) {
    return (
      <div className="mb-6">
        <h3 className="mb-2 font-semibold">
          {title}
        </h3>

        <div className="grid grid-cols-4 gap-2">
          {tiles.map((tile) => (
            <button
              key={tile}
              onClick={() =>
                addTile(tile)
              }
              className="h-16 rounded-xl border bg-white text-4xl active:scale-95"
            >
              {tile}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const selectedTiles =
    activeSection === "pair"
      ? pair
      : activeMeld?.tiles ?? [];

  return (
    <main className="min-h-screen bg-slate-100 p-4">
      <h1 className="mb-6 text-3xl font-bold">
        Winning Hand Builder
      </h1>

      <div className="mb-6 rounded-xl bg-white p-4 shadow">
        <h2 className="mb-4 text-xl font-semibold">
          Hand Overview
        </h2>

        {melds.map((meld, index) => (
          <button
            key={index}
            onClick={() =>
              setActiveSection(
                `meld${index + 1}` as ActiveSection
              )
            }
            className={`mb-3 block w-full rounded border p-3 text-left ${
              activeSection ===
              `meld${index + 1}`
                ? "border-2"
                : ""
            }`}
          >
            <strong>
              Meld {index + 1}
            </strong>

            <div className="mt-2 text-3xl">
              {meld.tiles.join(" ") ||
                "(empty)"}
            </div>

            <div className="mt-2 text-sm text-gray-500">
              {meld.status}
            </div>
          </button>
        ))}

        <button
          onClick={() =>
            setActiveSection("pair")
          }
          className={`block w-full rounded border p-3 text-left ${
            activeSection === "pair"
              ? "border-2"
              : ""
          }`}
        >
          <strong>Pair</strong>

          <div className="mt-2 text-3xl">
            {pair.join(" ") ||
              "(empty)"}
          </div>
        </button>
      </div>

      <div className="mb-6 rounded-xl bg-white p-4 shadow">
        <h2 className="mb-4 text-xl font-semibold">
          Editing: {activeSection}
        </h2>

        <div className="mb-4 min-h-[90px] rounded border bg-slate-50 p-3">
          <div className="flex flex-wrap gap-2">
            {selectedTiles.length === 0 ? (
              <p className="text-gray-500">
                Tap tiles below
              </p>
            ) : (
              selectedTiles.map(
                (tile, index) => (
                  <button
                    key={`${tile}-${index}`}
                    onClick={() =>
                      removeTile(index)
                    }
                    className="rounded border bg-white p-2 text-5xl"
                  >
                    {tile}
                  </button>
                )
              )
            )}
          </div>

          <p className="mt-3 text-sm text-gray-500">
            Tap a selected tile to remove it
          </p>
        </div>

        {activeMeld && (
          <>
            <div className="mb-4">
              <h3 className="mb-2 font-semibold">
                Status
              </h3>

              <div className="flex gap-4">
                <label className="flex gap-2">
                  <input
                    type="radio"
                    checked={
                      activeMeld.status ===
                      "concealed"
                    }
                    onChange={() =>
                      updateStatus(
                        "concealed"
                      )
                    }
                  />
                  Concealed
                </label>

                <label className="flex gap-2">
                  <input
                    type="radio"
                    checked={
                      activeMeld.status ===
                      "exposed"
                    }
                    onChange={() =>
                      updateStatus(
                        "exposed"
                      )
                    }
                  />
                  Exposed
                </label>
              </div>
            </div>

            {activeMeld.status ===
              "exposed" && (
              <div className="mb-4">
                <h3 className="mb-2 font-semibold">
                  Taken From
                </h3>

                <select
                  value={
                    activeMeld.takenFrom
                  }
                  onChange={(e) =>
                    updateTakenFrom(
                      e.target.value
                    )
                  }
                  className="rounded border px-3 py-2"
                >
                  <option value="">
                    Select Player
                  </option>

                  {players.map(
                    (player) => (
                      <option
                        key={player}
                        value={player}
                      >
                        {player}
                      </option>
                    )
                  )}
                </select>
              </div>
            )}
          </>
        )}
      </div>

      <div className="rounded-xl bg-white p-4 shadow">
        <h2 className="mb-4 text-xl font-semibold">
          Available Tiles
        </h2>

        {renderTileGroup(
          "Characters",
          characters
        )}

        {renderTileGroup(
          "Bamboo",
          bamboo
        )}

        {renderTileGroup(
          "Dots",
          dots
        )}

        {renderTileGroup(
          "Winds",
          winds
        )}

        {renderTileGroup(
          "Dragons",
          dragons
        )}
      </div>
    </main>
  );
}
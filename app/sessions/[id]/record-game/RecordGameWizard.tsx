"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveGame } from "../actions/saveGame";
import { updateGame } from "../actions/updateGame";
import MeldEditor from "@/src/components/MeldEditor";
import { recalculateStats } from "@/app/players/actions/recalculateStats";
import {
  Button,
  OptionButton,
  Indicator,
} from "@/src/components/ui/primitives";

type Participant = {
player_id: string;
players: {
id: string;
name: string;
};
};

type Props = {
  sessionId: string;
  participants: Participant[];
  initialGame?: any;
};

const Stepper = ({
  step,
  total,
}: {
  step: number;
  total: number;
}) => (
  <div className="mb-4 flex gap-1.5">
    {Array.from(
      { length: total },
      (_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full ${
            i < step
              ? "bg-mj-green"
              : "bg-[#ddd5c2]"
          }`}
        />
      )
    )}
  </div>
);

const StepHead = ({
  n,
  title,
  right,
}: {
  n: string;
  title: string;
  right?: string;
}) => (
  <div className="mb-3.5 flex items-end justify-between">
    <div>
      <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-mj-neg">
        Step {n} of 4
      </div>

      <div className="font-display text-xl font-bold text-mj-green">
        {title}
      </div>
    </div>

    {right && (
      <span className="text-[13px] font-extrabold text-mj-green">
        {right}
      </span>
    )}
  </div>
);
export default function RecordGameWizard({
  sessionId,
  participants,
  initialGame,
}: Props) {
const router = useRouter();
const [step, setStep] = useState(
  initialGame ? 3 : 1
);
const [isSaving, setIsSaving] =
  useState(false);

const [selectedPlayers, setSelectedPlayers] =
  useState<string[]>(
    initialGame
      ? participants.map(
          (p) => p.player_id
        )
      : []
  );

const [winner, setWinner] =
  useState(
    initialGame?.winner_id ?? ""
  );
const [flowers, setFlowers] =
  useState(
    initialGame?.flowers ?? 0
  );

const [melds] = useState([
null,
null,
null,
null,
]);

const [pair] = useState(null);
const [editingSection, setEditingSection] =
  useState<string | null>(null);

const [meld1Tiles, setMeld1Tiles] =
  useState<string[]>(
    initialGame?.hand_data
      ?.meld1Tiles ?? []
  );

const [meld2Tiles, setMeld2Tiles] =
  useState<string[]>(
    initialGame?.hand_data
      ?.meld2Tiles ?? []
  );

const [meld3Tiles, setMeld3Tiles] =
  useState<string[]>(
    initialGame?.hand_data
      ?.meld3Tiles ?? []
  );

const [meld4Tiles, setMeld4Tiles] =
  useState<string[]>(
    initialGame?.hand_data
      ?.meld4Tiles ?? []
  );

const [meld1Source, setMeld1Source] =
  useState(
    initialGame?.hand_data
      ?.meld1Source ??
      "self-draw"
  );

const [meld2Source, setMeld2Source] =
  useState(
    initialGame?.hand_data
      ?.meld2Source ??
      "self-draw"
  );

const [meld3Source, setMeld3Source] =
  useState(
    initialGame?.hand_data
      ?.meld3Source ??
      "self-draw"
  );

const [meld4Source, setMeld4Source] =
  useState(
    initialGame?.hand_data
      ?.meld4Source ??
      "self-draw"
  );

const [pairSource, setPairSource] =
  useState(
    initialGame?.hand_data
      ?.pairSource ??
      "self-draw"
  );

const [pairTiles, setPairTiles] =
  useState<string[]>(
    initialGame?.hand_data
      ?.pairTiles ?? []
  );

const [winType, setWinType] =
  useState<
    "self-draw" | "claimed"
  >(
    initialGame?.hand_data
      ?.winType ??
      "self-draw"
  );

const [discarder, setDiscarder] =
  useState(
    initialGame?.hand_data
      ?.discarder ?? ""
  );

function togglePlayer(playerId: string) {
setSelectedPlayers((current) => {
if (current.includes(playerId)) {
return current.filter(
(id) => id !== playerId
);
}


  if (current.length >= 4) {
    return current;
  }

  return [...current, playerId];
});


}

const selectedParticipants =
  participants
    .filter((participant) =>
      selectedPlayers.includes(
        participant.player_id
      )
    )
    .sort((a, b) =>
      a.players.name.localeCompare(
        b.players.name
      )
    );
console.log(
  "HAND PLAYERS:",
  initialGame?.hand_data?.settlement?.map(
    (s: any) => s.player
  )
);

console.log(
  "SELECTED PLAYER IDS:",
  selectedPlayers
);

console.log(
  "SELECTED PARTICIPANTS:",
  selectedParticipants.map(
    (p) => p.players.name
  )
);

console.log(
  "SELECTED PLAYERS IDS:",
  selectedPlayers
);

console.log(
  "SELECTED PARTICIPANTS:",
  selectedParticipants.map(
    (p) => p.players.name
  )
);

const otherPlayers =
  selectedParticipants
    .filter(
      (p) => p.player_id !== winner
    )
    .sort((a, b) =>
      a.players.name.localeCompare(
        b.players.name
      )
    );
function formatSource(
  source: string
) {
  return source === "self-draw"
    ? "Concealed: Self-Draw"
    : `Exposed: ${source}`;
}
function detectMeldType(
  tiles: string[]
) {
  if (
    tiles.length >= 3 &&
    tiles.every(
      (tile) => tile === tiles[0]
    )
  ) {
    return tiles.length === 4
      ? "Kong"
      : "Pung";
  }

  const allSuitTiles = [
    "🀇", "🀈", "🀉", "🀊", "🀋", "🀌", "🀍", "🀎", "🀏",
    "🀐", "🀑", "🀒", "🀓", "🀔", "🀕", "🀖", "🀗", "🀘",
    "🀙", "🀚", "🀛", "🀜", "🀝", "🀞", "🀟", "🀠", "🀡",
  ];

  const indexes = tiles
    .map((tile) =>
      allSuitTiles.indexOf(tile)
    )
    .sort((a, b) => a - b);

  if (
    tiles.length === 3 &&
    indexes.every(
      (index) => index !== -1
    ) &&
    indexes[1] === indexes[0] + 1 &&
    indexes[2] === indexes[1] + 1
  ) {
    return "Chow";
  }

    return "";
}

const meld1Valid =
  detectMeldType(meld1Tiles) !== "";

const meld2Valid =
  detectMeldType(meld2Tiles) !== "";

const meld3Valid =
  detectMeldType(meld3Tiles) !== "";

const meld4Valid =
  detectMeldType(meld4Tiles) !== "";

const pairValid =
  pairTiles.length === 2 &&
  pairTiles[0] === pairTiles[1];

const winningMethodValid =
  winType === "self-draw" ||
  discarder !== "";

const handValid =
  meld1Valid &&
  meld2Valid &&
  meld3Valid &&
  meld4Valid &&
  pairValid &&
  winningMethodValid;
const allPungs =
  ["Pung", "Kong"].includes(
    detectMeldType(meld1Tiles)
  ) &&
  ["Pung", "Kong"].includes(
    detectMeldType(meld2Tiles)
  ) &&
  ["Pung", "Kong"].includes(
    detectMeldType(meld3Tiles)
  ) &&
  ["Pung", "Kong"].includes(
    detectMeldType(meld4Tiles)
  );
const allTiles = [
  ...meld1Tiles,
  ...meld2Tiles,
  ...meld3Tiles,
  ...meld4Tiles,
  ...pairTiles,
];

const characterTiles = [
  "🀇", "🀈", "🀉", "🀊", "🀋",
  "🀌", "🀍", "🀎", "🀏",
];

const bambooTiles = [
  "🀐", "🀑", "🀒", "🀓", "🀔",
  "🀕", "🀖", "🀗", "🀘",
];

const dotTiles = [
  "🀙", "🀚", "🀛", "🀜", "🀝",
  "🀞", "🀟", "🀠", "🀡",
];

const suitsPresent = new Set<string>();

allTiles.forEach((tile) => {
  if (characterTiles.includes(tile)) {
    suitsPresent.add("characters");
  }

  if (bambooTiles.includes(tile)) {
    suitsPresent.add("bamboo");
  }

  if (dotTiles.includes(tile)) {
    suitsPresent.add("dots");
  }
});

const oneSuit =
  suitsPresent.size === 1;
const honorTiles = [
  "🀀", "🀁", "🀂", "🀃",
  "🀄", "🀅", "🀆",
];

const hasHonors =
  allTiles.some((tile) =>
    honorTiles.includes(tile)
  );
let scoringCategory =
  "No Category Detected";

let categoryMultiplier = 1;

if (
  allPungs &&
  oneSuit &&
  !hasHonors
) {
  scoringCategory =
    "Qing Yi Se (One Suit) + All Pungs";

  categoryMultiplier = 8;
} else if (
  allPungs &&
  oneSuit &&
  hasHonors
) {
  scoringCategory =
    "Qing Yi Se (One Suit) + All Pungs + Dragons/Directionals";

  categoryMultiplier = 4;
} else if (
  !allPungs &&
  oneSuit &&
  !hasHonors
) {
  scoringCategory =
    "Qing Yi Se (One Suit)";

  categoryMultiplier = 4;
} else if (
  !allPungs &&
  oneSuit &&
  hasHonors
) {
  scoringCategory =
    "Qing Yi Se (One Suit) + Dragons/Directionals";

  categoryMultiplier = 2;
} else if (
  allPungs &&
  !oneSuit &&
  hasHonors
) {
  scoringCategory =
    "All Pungs + Dragons/Directionals";

  categoryMultiplier = 2;
}

const baseWin = 10;

const flowerPoints =
  flowers * 5;

const kongCount = [
  meld1Tiles,
  meld2Tiles,
  meld3Tiles,
  meld4Tiles,
].filter(
  (meld) =>
    detectMeldType(meld) === "Kong"
).length;

const kongPoints =
  kongCount * 5;

const subtotal =
  baseWin +
  flowerPoints +
  kongPoints;

const concealedSelfDraw =
  winType === "self-draw" &&
  meld1Source === "self-draw" &&
  meld2Source === "self-draw" &&
  meld3Source === "self-draw" &&
  meld4Source === "self-draw" &&
  pairSource === "self-draw";

const concealedMultiplier =
  concealedSelfDraw ? 2 : 1;

const rawScore =
  subtotal *
  categoryMultiplier *
  concealedMultiplier;

const handValue =
  Math.min(
    rawScore,
    200
  );
const winnerName =
  selectedParticipants.find(
    (p) =>
      p.player_id === winner
  )?.players.name ?? "";
const meldSources = [
  meld1Source,
  meld2Source,
  meld3Source,
  meld4Source,
].filter(
  (source) =>
    source !== "self-draw"
);

const sourceCounts:
  Record<string, number> = {};

meldSources.forEach(
  (source) => {
    sourceCounts[source] =
      (sourceCounts[source] ?? 0) + 1;
  }
);

const penaltyPayer =
  Object.entries(sourceCounts).find(
    ([, count]) => count >= 3
  )?.[0];

const settlement =
  penaltyPayer
    ? [
        {
          player: winnerName,
          points: handValue,
        },
        ...otherPlayers.map(
          (player) => ({
            player:
              player.players.name,
            points:
              player.players.name ===
              penaltyPayer
                ? -handValue
                : 0,
          })
        ),
      ]
    : winType === "self-draw"
    ? [
        {
          player: winnerName,
          points:
            handValue * 3,
        },
        ...otherPlayers.map(
          (player) => ({
            player:
              player.players.name,
            points: -handValue,
          })
        ),
      ]
    : [
        {
          player: winnerName,
          points: handValue,
        },
        ...otherPlayers.map(
          (player) => ({
            player:
              player.players.name,
            points:
              player.players.name ===
              discarder
                ? -handValue
                : 0,
          })
        ),
      ];

return (
  <div className="mx-auto max-w-3xl px-4 pb-24 pt-4">

    <div className="mb-3 flex items-center justify-between">
      <h1 className="font-display text-lg font-bold text-mj-green">
        {initialGame
          ? "Edit Hand"
          : "Record a Hand"}
      </h1>

      <button
        onClick={() =>
          router.push(
            initialGame
              ? `/sessions/${sessionId}/history`
              : `/sessions/${sessionId}`
          )
        }
        className="text-sm font-bold text-mj-muted"
      >
        Cancel
      </button>
    </div>

    <Stepper
      step={initialGame ? step - 2 : step}
      total={initialGame ? 2 : 4}
    />

 {step === 1 && (
  <>
    <StepHead
  n="1"
  title="Select Players"
  right={`${selectedPlayers.length} / 4`}
/>

    <div className="flex flex-col gap-2.5">
      {participants
        .slice()
        .sort((a, b) =>
          a.players.name.localeCompare(
            b.players.name
          )
        )
        .map((participant) => {
          const selected =
            selectedPlayers.includes(
              participant.player_id
            );

          return (
            <OptionButton
  key={participant.player_id}
  onClick={() =>
    togglePlayer(
      participant.player_id
    )
  }
  className={`gap-3 rounded-2xl px-4 py-3.5 ${
    selected
      ? "border-[1.5px] border-mj-green bg-mj-card"
      : "border border-mj-line bg-mj-paper opacity-70"
  }`}
>
  <Indicator
    className={`h-6 w-6 rounded-lg text-sm text-white ${
      selected
        ? "bg-mj-green"
        : "border-[1.5px] border-[#c4bca6] bg-white"
    }`}
  >
    {selected ? "✓" : ""}
  </Indicator>

  <span className="flex-1 font-extrabold">
    {participant.players.name}
  </span>
</OptionButton>
          );
        })}
    </div>

    <Button
  className="mt-5 w-full"
  disabled={selectedPlayers.length !== 4}
  onClick={() => setStep(2)}
>
  Next →
</Button>
  </>
)}

  {step === 2 && (
    <div className="rounded-lg border bg-white p-6 shadow">
      <h2 className="mb-4 text-2xl font-semibold">
        Step 2: Select Winner
      </h2>

      <div className="space-y-2">
        {selectedParticipants
  .slice()
  .sort((a, b) =>
    a.players.name.localeCompare(
      b.players.name
    )
  )
  .map(
          (participant) => (
            <label
              key={participant.player_id}
              className="flex items-center gap-3"
            >
              <input
                type="radio"
                name="winner"
                checked={
                  winner ===
                  participant.player_id
                }
                onChange={() =>
                  setWinner(
                    participant.player_id
                  )
                }
              />

              <span>
                {participant.players.name}
              </span>
            </label>
          )
        )}
            </div>

<div className="mt-6 flex gap-2">
        <button
          onClick={() => setStep(1)}
          className="rounded border px-4 py-2"
        >
          Back
        </button>

        <button
          disabled={!winner}
          onClick={() => setStep(3)}
          className="rounded border px-4 py-2 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )}

  {step === 3 && !editingSection && (
  <div className="rounded-lg border bg-white p-6 shadow">
    <h2 className="mb-4 text-2xl font-semibold">
  {initialGame
    ? "Step 1: Edit Hand"
    : "Step 3: Winning Hand"}
</h2>


<div className="mb-4 rounded border p-4">
  <div>
  <strong>
    Meld 1
    {detectMeldType(meld1Tiles)
      ? ` (${detectMeldType(meld1Tiles)})`
      : ""}
  </strong>
</div>

  {meld1Tiles.length > 0 && (
  <div className="mt-2 text-4xl">
    {meld1Tiles.join(" ")}
  </div>
)}

{meld1Tiles.length > 0 && (
  <div className="mt-2 text-sm text-gray-500">
    {formatSource(meld1Source)}
  </div>
)}
  <button
    onClick={() =>
      setEditingSection("meld1")
    }
    className="mt-3 rounded border px-3 py-1 text-sm"
  >
    Edit
  </button>
</div>
<div className="mb-4 rounded border p-4">
  <div>
  <strong>
    Meld 2
    {detectMeldType(meld2Tiles)
      ? ` (${detectMeldType(meld2Tiles)})`
      : ""}
  </strong>
</div>

  {meld1Tiles.length > 0 && (
  <div className="mt-2 text-4xl">
    {meld2Tiles.join(" ")}
  </div>
)}

{meld2Tiles.length > 0 && (
  <div className="mt-2 text-sm text-gray-500">
    {formatSource(meld2Source)}
  </div>
)}

  <button
  onClick={() =>
    setEditingSection("meld2")
  }
  className="mt-3 rounded border px-3 py-1 text-sm"
>
  Edit
</button>
</div>

<div className="mb-4 rounded border p-4">
  <div>
  <strong>
    Meld 3
    {detectMeldType(meld3Tiles)
      ? ` (${detectMeldType(meld3Tiles)})`
      : ""}
  </strong>
</div>

  {meld1Tiles.length > 0 && (
  <div className="mt-2 text-4xl">
    {meld3Tiles.join(" ")}
  </div>
)}

{meld3Tiles.length > 0 && (
  <div className="mt-2 text-sm text-gray-500">
    {formatSource(meld3Source)}
  </div>
)}

  <button
  onClick={() =>
    setEditingSection("meld3")
  }
  className="mt-3 rounded border px-3 py-1 text-sm"
>
  Edit
</button>
</div>

<div className="mb-4 rounded border p-4">
  <div>
  <strong>
    Meld 4
    {detectMeldType(meld4Tiles)
      ? ` (${detectMeldType(meld4Tiles)})`
      : ""}
  </strong>
</div>

  {meld1Tiles.length > 0 && (
  <div className="mt-2 text-4xl">
    {meld4Tiles.join(" ")}
  </div>
)}

{meld4Tiles.length > 0 && (
  <div className="mt-2 text-sm text-gray-500">
    {formatSource(meld4Source)}
  </div>
)}

  <button
  onClick={() =>
    setEditingSection("meld4")
  }
  className="mt-3 rounded border px-3 py-1 text-sm"
>
  Edit
</button>
</div>

<div className="mb-4 rounded border p-4">
  <div>
  <strong>Pair</strong>
</div>

  {pairTiles.length > 0 && (
  <div className="mt-2 text-4xl">
    {pairTiles.join(" ")}
  </div>
)}

  {pairTiles.length > 0 && (
  <div className="mt-2 text-sm text-gray-500">
    {formatSource(pairSource)}
  </div>
)}

  <button
    onClick={() =>
      setEditingSection("pair")
    }
    className="mt-3 rounded border px-3 py-1 text-sm"
  >
    Edit
  </button>
</div>

<div className="mb-4 rounded border p-4">
  <strong>Flowers</strong>

  <div className="mt-3 flex items-center gap-3">
    <button
      onClick={() =>
        setFlowers(
          Math.max(0, flowers - 1)
        )
      }
      className="rounded border px-3 py-1"
    >
      −
    </button>

    <span className="text-xl font-semibold">
      {flowers}
    </span>

    <button
      onClick={() =>
        setFlowers(
          Math.min(8, flowers + 1)
        )
      }
      className="rounded border px-3 py-1"
    >
      +
    </button>
  </div>

  <p className="mt-2 text-sm text-gray-500">
    +5 points each
  </p>
</div>

<div className="mb-4 rounded border p-4">
  <strong>Winning Method</strong>

  <div className="mt-3 space-y-2">
    <label className="block">
      <input
        type="radio"
        checked={
          winType === "self-draw"
        }
        onChange={() => {
          setWinType("self-draw");
          setDiscarder("");
        }}
      />
      {" "}Self Draw
    </label>

    {otherPlayers.map((player) => (
      <label
        key={player.player_id}
        className="block"
      >
        <input
          type="radio"
          checked={
            winType === "claimed" &&
            discarder ===
              player.players.name
          }
          onChange={() => {
            setWinType("claimed");
            setDiscarder(
              player.players.name
            );
          }}
        />
        {" "}Claimed from{" "}
        {player.players.name}
      </label>
    ))}
  </div>
</div>

<div className="mt-6">
  <p className="mb-4 text-lg font-semibold">
    {handValid
      ? "✅ Hand Valid"
      : "❌ Hand Invalid"}
  </p>

 <div className="flex gap-2">
  {!initialGame && (
    <button
      onClick={() => setStep(2)}
      className="rounded border px-4 py-2"
    >
      Back
    </button>
  )}

  <button
    disabled={!handValid}
    onClick={() => setStep(4)}
    className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
  >
    Calculate Points
  </button>
</div>
</div>

    </div>
)}

 {step === 3 && editingSection === "meld1" && (
  <div>
    <button
      onClick={() =>
        setEditingSection(null)
      }
      className="mb-4 rounded border px-3 py-1 text-sm"
    >
      ← Back
    </button>

    <MeldEditor
  title="Meld 1"
  maxTiles={4}
  initialTiles={meld1Tiles}
  initialSource={meld1Source}
  sourceOptions={otherPlayers.map(
    (p) => p.players.name
  )}
  onSave={(tiles, source) => {
    setMeld1Tiles(tiles);

    if (source) {
      setMeld1Source(source);
    }

    setEditingSection(null);
  }}
/>
  </div>
)}

{step === 3 && editingSection === "pair" && (
  <div>
    <button
      onClick={() =>
        setEditingSection(null)
      }
      className="mb-4 rounded border px-3 py-1 text-sm"
    >
      ← Back
    </button>

    <MeldEditor
  title="Pair"
  maxTiles={2}
  initialTiles={pairTiles}
  initialSource={pairSource}
  sourceOptions={otherPlayers.map(
    (p) => p.players.name
  )}
  onSave={(tiles, source) => {
    setPairTiles(tiles);

    if (source) {
      setPairSource(source);
    }

    setEditingSection(null);
  }}
/>
  </div>
)}
{step === 3 && editingSection === "meld2" && (
  <div>
    <button
      onClick={() =>
        setEditingSection(null)
      }
      className="mb-4 rounded border px-3 py-1 text-sm"
    >
      ← Back
    </button>

    <MeldEditor
  title="Meld 2"
  maxTiles={4}
  initialTiles={meld2Tiles}
  initialSource={meld2Source}
  sourceOptions={otherPlayers.map(
    (p) => p.players.name
  )}
  onSave={(tiles, source) => {
    setMeld2Tiles(tiles);

    if (source) {
      setMeld2Source(source);
    }

    setEditingSection(null);
  }}
/>
  </div>
)}

{step === 3 && editingSection === "meld3" && (
  <div>
    <button
      onClick={() =>
        setEditingSection(null)
      }
      className="mb-4 rounded border px-3 py-1 text-sm"
    >
      ← Back
    </button>

    <MeldEditor
  title="Meld 3"
  maxTiles={4}
  initialTiles={meld3Tiles}
  initialSource={meld3Source}
  sourceOptions={otherPlayers.map(
    (p) => p.players.name
  )}
  onSave={(tiles, source) => {
    setMeld3Tiles(tiles);

    if (source) {
      setMeld3Source(source);
    }

    setEditingSection(null);
  }}
/>
  </div>
)}

{step === 3 && editingSection === "meld4" && (
  <div>
    <button
      onClick={() =>
        setEditingSection(null)
      }
      className="mb-4 rounded border px-3 py-1 text-sm"
    >
      ← Back
    </button>

    <MeldEditor
  title="Meld 4"
  maxTiles={4}
  initialTiles={meld4Tiles}
  initialSource={meld4Source}
  sourceOptions={otherPlayers.map(
    (p) => p.players.name
  )}
  onSave={(tiles, source) => {
    setMeld4Tiles(tiles);

    if (source) {
      setMeld4Source(source);
    }

    setEditingSection(null);
  }}
/>
  </div>
)}

{step === 4 && (
  <div className="rounded-lg border bg-white p-6 shadow">
    <h2 className="mb-4 text-2xl font-semibold">
  {initialGame
    ? "Step 2: Review Changes"
    : "Step 4: Point Calculation"}
</h2>
<div className="mb-6">
  <h3 className="mb-4 font-semibold">
    Score Breakdown
  </h3>

  <p>
    Base Win: {baseWin}
  </p>

  <p>
    Flowers: +{flowerPoints}
  </p>

  <p>
    Kongs: +{kongPoints}
  </p>

  <hr className="my-4" />

  <p className="font-bold">
    Subtotal: {subtotal}
  </p>

  <hr className="my-4" />

    <p>
    <strong>
      Multiplier (×{categoryMultiplier}):
    </strong>{" "}
    {scoringCategory}
  </p>
{penaltyPayer && (
  <p>
    <strong>
      Penalty Rule:
    </strong>{" "}
    {penaltyPayer} fed
    3+ melds and becomes
    the sole payer.
  </p>
)}
{concealedSelfDraw && (
  <p>
    <strong>
      Multiplier (×2):
    </strong>{" "}
    Concealed Self Draw
  </p>
)}

  {rawScore > 200 && (
    <>
      <hr className="my-4" />

      <p>
        Raw Score: {rawScore}
      </p>

      <p>
        Cap Applied: 200
      </p>
    </>
  )}

  <hr className="my-4" />

 <p className="text-2xl font-bold">
    Grand Total: {handValue}
  </p>
<hr className="my-4" />

<h3 className="mb-4 font-semibold">
  Settlement
</h3>

<div className="space-y-2">
  {settlement.map((entry) => (
    <div
      key={entry.player}
      className="flex justify-between"
    >
      <span>
        {entry.player}
      </span>

      <span
        className={
          entry.points > 0
            ? "font-semibold"
            : ""
        }
      >
        {entry.points > 0
          ? `+${entry.points}`
          : entry.points}
      </span>
    </div>
  ))}
</div>
</div>

    <div className="flex gap-2">
      <button
        onClick={() => setStep(3)}
        className="rounded border px-4 py-2"
      >
        Back
      </button>

     <button
  disabled={isSaving}
  onClick={async () => {
    console.log(
      "SAVE BUTTON CLICKED"
    );

    if (isSaving) {
  return;
}

setIsSaving(true);

try {
  const payload = {
    winnerId: winner,
    winType,
    discarderId:
      otherPlayers.find(
        (p) =>
          p.players.name ===
          discarder
      )?.player_id ?? null,
    flowers,
    kongs: kongCount,
    score: handValue,
    handData: {
  flowers,
  kongCount,
  subtotal,
  categoryMultiplier,
  scoringCategory,
  rawScore,
  handValue,
  winType,
  discarder,
  participants:
    selectedParticipants.map(
      (p) => p.players.name
    ),
  settlement,
  meld1Tiles,
  meld2Tiles,
  meld3Tiles,
  meld4Tiles,
  pairTiles,
  meld1Source,
  meld2Source,
  meld3Source,
  meld4Source,
  pairSource,
},
  };

  if (initialGame) {
    await updateGame({
  gameId: initialGame.id,
  sessionId,
  ...payload,
});
    await recalculateStats();

    router.push(
      `/sessions/${sessionId}/history`
    );
  } else {
    await saveGame({
      sessionId,
      ...payload,
    });

    router.push(
      `/sessions/${sessionId}`
    );
  }
} catch (error) {
  console.error(error);

  setIsSaving(false);

  alert("Save Failed");
}
  }}
  className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
>
 {isSaving
  ? "Saving..."
  : initialGame
  ? "Save Changes"
  : "Save & Update Leaderboard"}
</button>
    </div>
  </div>
)}

</div>

);
}

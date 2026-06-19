"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveGame } from "../actions/saveGame";
import { updateGame } from "../actions/updateGame";
import MeldEditor from "@/src/components/MeldEditor";
import { recalculateStats } from "@/app/players/actions/recalculateStats";
import {
  Card,
  PanelHeader,
  Button,
  OptionButton,
  Indicator,
  Sparkle,
} from "@/src/components/ui/primitives";
import { MahjongTile } from "@/src/components/mj/MahjongTile";

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
  <div className="mb-4">
    <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-mj-neg">
      Step {n} of 4
    </div>

    <div className="mt-1 flex items-center justify-between">
      <div className="font-display text-xl font-bold text-mj-green">
        {title}
      </div>

      {right && (
        <span className="text-[13px] font-extrabold text-mj-green">
          {right}
        </span>
      )}
    </div>
  </div>
);
const Line = ({
  label,
  value,
  pos,
  accent,
  bold,
  alt,
}: {
  label: string;
  value: string;
  pos?: boolean;
  accent?: boolean;
  bold?: boolean;
  alt?: boolean;
}) => (
  <div
    className={`flex items-center justify-between px-4 py-2.5 text-sm ${
      alt ? "bg-mj-paper" : ""
    }`}
  >
    <span
      className={
        bold ? "font-extrabold" : "text-mj-muted"
      }
    >
      {label}
    </span>

    <span
      className={`font-extrabold ${
        pos
          ? "text-mj-pos"
          : accent
          ? "text-mj-neg"
          : ""
      }`}
    >
      {value}
    </span>
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

const result = {
  handValue,
  kongCount,
  subtotal,
  category: scoringCategory,
  multiplier: categoryMultiplier,
  concealed: concealedSelfDraw,
  settlement,
};

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
  <>
    <StepHead n="2" title="Who Won?" />

    <div className="flex flex-col gap-2.5">
      {selectedParticipants.map((p) => {
        const on = winner === p.player_id;

        return (
          <OptionButton
            key={p.player_id}
            onClick={() => setWinner(p.player_id)}
            className={`gap-3 rounded-2xl px-4 py-3.5 ${
              on
                ? "border-[1.5px] border-mj-green bg-mj-greensoft"
                : "border border-mj-line bg-mj-card"
            }`}
          >
            <Indicator
  className={`h-6 w-6 rounded-lg text-sm text-white ${
    on
      ? "bg-mj-green"
      : "border-[1.5px] border-[#c4bca6] bg-white"
  }`}
>
  {on ? "✓" : ""}
</Indicator>

            <span className="flex-1 font-extrabold">
              {p.players.name}
            </span>
          </OptionButton>
        );
      })}
    </div>

    <div className="mt-5 flex gap-3">
      <Button
        variant="secondary"
        onClick={() => setStep(1)}
      >
        Back
      </Button>

      <Button
        className="flex-1"
        disabled={!winner}
        onClick={() => setStep(3)}
      >
        Next →
      </Button>
    </div>
  </>
)}

  {step === 3 && !editingSection && (
  <>
  <StepHead
    n="3"
    title="Winning Hand"
    right={`Winner: ${winnerName}`}
  />


<Card className="mb-3 p-3.5">
  <div className="mb-2 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="text-sm font-extrabold">
        Meld 1
      </span>

      {detectMeldType(meld1Tiles) && (
        <span className="rounded-full bg-mj-greensoft px-2 py-0.5 text-[10px] font-extrabold text-mj-pos">
          {detectMeldType(meld1Tiles).toUpperCase()}
        </span>
      )}
    </div>

    <button
      type="button"
      onClick={() => setEditingSection("meld1")}
      className="text-[13px] font-bold text-mj-green"
    >
      Edit
    </button>
  </div>

  {meld1Tiles.length ? (
    <>
      <div className="text-4xl">
        {meld1Tiles.join(" ")}
      </div>

      <div className="mt-2 text-xs text-mj-muted">
        {formatSource(meld1Source)}
      </div>
    </>
  ) : (
    <span className="text-xs text-mj-muted">
      Tap edit to add tiles
    </span>
  )}
</Card>
<Card className="mb-3 p-3.5">
  <div className="mb-2 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="text-sm font-extrabold">
        Meld 2
      </span>

      {detectMeldType(meld2Tiles) && (
        <span className="rounded-full bg-mj-greensoft px-2 py-0.5 text-[10px] font-extrabold text-mj-pos">
          {detectMeldType(meld2Tiles).toUpperCase()}
        </span>
      )}
    </div>

    <button
      type="button"
      onClick={() => setEditingSection("meld2")}
      className="text-[13px] font-bold text-mj-green"
    >
      Edit
    </button>
  </div>

  {meld2Tiles.length ? (
    <>
      <div className="text-4xl">
        {meld2Tiles.join(" ")}
      </div>

      <div className="mt-2 text-xs text-mj-muted">
        {formatSource(meld2Source)}
      </div>
    </>
  ) : (
    <span className="text-xs text-mj-muted">
      Tap edit to add tiles
    </span>
  )}
</Card>

<Card className="mb-3 p-3.5">
  <div className="mb-2 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="text-sm font-extrabold">
        Meld 3
      </span>

      {detectMeldType(meld3Tiles) && (
        <span className="rounded-full bg-mj-greensoft px-2 py-0.5 text-[10px] font-extrabold text-mj-pos">
          {detectMeldType(meld3Tiles).toUpperCase()}
        </span>
      )}
    </div>

    <button
      type="button"
      onClick={() => setEditingSection("meld3")}
      className="text-[13px] font-bold text-mj-green"
    >
      Edit
    </button>
  </div>

  {meld3Tiles.length ? (
    <>
      <div className="text-4xl">
        {meld3Tiles.join(" ")}
      </div>

      <div className="mt-2 text-xs text-mj-muted">
        {formatSource(meld3Source)}
      </div>
    </>
  ) : (
    <span className="text-xs text-mj-muted">
      Tap edit to add tiles
    </span>
  )}
</Card>
<Card className="mb-3 p-3.5">
  <div className="mb-2 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="text-sm font-extrabold">
        Meld 4
      </span>

      {detectMeldType(meld4Tiles) && (
        <span className="rounded-full bg-mj-greensoft px-2 py-0.5 text-[10px] font-extrabold text-mj-pos">
          {detectMeldType(meld4Tiles).toUpperCase()}
        </span>
      )}
    </div>

    <button
      type="button"
      onClick={() => setEditingSection("meld4")}
      className="text-[13px] font-bold text-mj-green"
    >
      Edit
    </button>
  </div>

  {meld4Tiles.length ? (
    <>
      <div className="text-4xl">
        {meld4Tiles.join(" ")}
      </div>

      <div className="mt-2 text-xs text-mj-muted">
        {formatSource(meld4Source)}
      </div>
    </>
  ) : (
    <span className="text-xs text-mj-muted">
      Tap edit to add tiles
    </span>
  )}
</Card>
<div className="mb-3 flex gap-2.5">

  {/* Pair */}
  <div className="flex-1">
    <Card className="h-full p-3.5">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-extrabold">
          Pair
        </span>

        <button
          type="button"
          onClick={() => setEditingSection("pair")}
          className="text-[13px] font-bold text-mj-green"
        >
          Edit
        </button>
      </div>

      {pairTiles.length ? (
        <>
          <div className="text-4xl">
            {pairTiles.join(" ")}
          </div>

          <div className="mt-2 text-xs text-mj-muted">
            {formatSource(pairSource)}
          </div>
        </>
      ) : (
        <span className="text-xs text-mj-muted">
          Tap edit to add tiles
        </span>
      )}
    </Card>
  </div>

  {/* Flowers */}
  <Card className="w-[130px] shrink-0 p-3.5">
    <div className="mb-3 flex justify-between">
      <span className="text-sm font-extrabold">
        Flowers
      </span>

      <span className="-translate-y-0.5 rounded-full bg-mj-greensoft px-2 py-1 text-xs font-extrabold text-mj-pos">
  +{flowerPoints}
</span>
    </div>

    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={() =>
          setFlowers(Math.max(0, flowers - 1))
        }
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-mj-line bg-white text-lg font-bold"
      >
        −
      </button>

      <div className="text-2xl font-bold text-mj-green">
  {flowers}
</div>

      <button
        type="button"
        onClick={() =>
          setFlowers(Math.min(8, flowers + 1))
        }
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-mj-line bg-white text-lg font-bold"
      >
        +
      </button>
    </div>
  </Card>

</div>

<Card className="mb-3 p-3.5">
  <div className="mb-3 text-sm font-extrabold">
    Winning Method
  </div>

  <div className="space-y-2">

    <OptionButton
      onClick={() => {
        setWinType("self-draw");
        setDiscarder("");
      }}
      className={`gap-3 rounded-2xl px-4 py-3 ${
        winType === "self-draw"
          ? "border-[1.5px] border-mj-green bg-mj-greensoft"
          : "border border-mj-line bg-mj-card"
      }`}
    >
      <Indicator
        className={`h-6 w-6 rounded-lg text-sm text-white ${
          winType === "self-draw"
            ? "bg-mj-green"
            : "border-[1.5px] border-[#c4bca6] bg-white"
        }`}
      >
        {winType === "self-draw" ? "✓" : ""}
      </Indicator>

      <div className="flex-1 text-left">
        <div className="font-extrabold">
          Self Draw
        </div>

        <div className="text-xs text-mj-muted">
          All opponents pay
        </div>
      </div>
    </OptionButton>

    {otherPlayers.map((player) => {
      const selected =
        winType === "claimed" &&
        discarder === player.players.name;

      return (
        <OptionButton
          key={player.player_id}
          onClick={() => {
            setWinType("claimed");
            setDiscarder(player.players.name);
          }}
          className={`gap-3 rounded-2xl px-4 py-3 ${
            selected
              ? "border-[1.5px] border-mj-green bg-mj-greensoft"
              : "border border-mj-line bg-mj-card"
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

          <div className="flex-1 text-left">
            <div className="font-extrabold">
              Claimed from {player.players.name}
            </div>

            <div className="text-xs text-mj-muted">
              {player.players.name} pays
            </div>
          </div>
        </OptionButton>
      );
    })}
  </div>
</Card>

<Card className="mt-4 p-4">
  <div className="mb-4 flex items-center gap-3">

    <Indicator
      className={`h-8 w-8 rounded-xl text-white ${
        handValid
          ? "bg-mj-green"
          : "bg-mj-neg"
      }`}
    >
      {handValid ? "✓" : "!"}
    </Indicator>

    <div>
      <div className="font-extrabold">
        {handValid
          ? "Hand Valid"
          : "Hand Incomplete"}
      </div>

      <div className="text-xs text-mj-muted">
        {handValid
          ? "Ready to calculate points."
          : "Complete all melds and winning method."}
      </div>
    </div>

  </div>

  <div className="flex gap-3">
    {!initialGame && (
      <Button
        variant="secondary"
        onClick={() => setStep(2)}
      >
        Back
      </Button>
    )}

    <Button
      className="flex-1"
      disabled={!handValid}
      onClick={() => setStep(4)}
    >
      Calculate Points →
    </Button>
  </div>
</Card>

    </>
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
        <>
          {/* Hero — grand total (中 watermark + sparkle + chips, matches Concept 10) */}
          <Card className="relative mb-4 overflow-hidden bg-mj-green p-6 text-[#f4efe2]">
            <span aria-hidden className="fret fret-tl pointer-events-none" />
            <span aria-hidden className="fret fret-tr pointer-events-none" />
            <span aria-hidden className="fret fret-bl pointer-events-none" />
            <span aria-hidden className="fret fret-br pointer-events-none" />
            <span aria-hidden className="pointer-events-none absolute right-3.5 top-2 select-none font-extrabold leading-none text-[#f4efe2] opacity-[0.12]" style={{ fontSize: 90 }}>中</span>
            <Sparkle className="pointer-events-none absolute bottom-4 left-4 text-[#ef8a7d]" size={15} />
            <div className="relative text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#9fbcab]">Hand Value · {winnerName} wins</div>
            <div className="relative mt-1.5 flex items-baseline gap-2">
              <span className="font-display text-6xl font-bold leading-none">{result.handValue}</span>
              <span className="text-[15px] text-[#9fbcab]">points</span>
            </div>
            <div className="relative mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-white/[0.12] px-2.5 py-1 text-[11px] font-bold text-[#e7efe9]">{result.category} ×{result.multiplier}</span>
              {result.concealed && <span className="rounded-full bg-white/[0.12] px-2.5 py-1 text-[11px] font-bold text-[#e7efe9]">Self-draw ×2</span>}
            </div>
          </Card>

          {/* Score breakdown — zebra rows */}
          <Card className="mb-4">
            <div className="px-4 pb-2 pt-3.5 font-display text-[15px] font-bold uppercase tracking-[0.04em] text-mj-green">Score Breakdown</div>
            <div className="h-px bg-mj-line" />
            <Line label="Base win" value="10" />
            <Line label={`Flowers × ${flowers}`} value={`+${flowers * 5}`} pos alt />
            <Line label={`Kong × ${result.kongCount}`} value={`+${result.kongCount * 5}`} pos />
            <div className="h-px bg-mj-line" />
            <Line label="Subtotal" value={String(result.subtotal)} bold />
            <Line label="Category multiplier" value={`×${result.multiplier}`} accent alt />
            {result.concealed && <Line label="Concealed self-draw" value="×2" accent />}
            <div className="h-px bg-mj-line" />
            <div className="flex items-center justify-between bg-mj-greensoft px-4 py-3.5">
              <span className="font-display text-base font-bold uppercase tracking-[0.03em] text-mj-green">Grand Total</span>
              <span className="font-display text-2xl font-bold text-mj-green">{result.handValue}</span>
            </div>
          </Card>

          {/* Settlement — winner gets a tile icon; others get an aligning spacer */}
          <Card className="mb-4">
            <PanelHeader>Settlement</PanelHeader>
            <ul className="px-4 py-1">
              {result.settlement.map((e, i, arr) => {
                const isWinner = e.player === winnerName;
                return (
                  <li key={e.player} className={`flex items-center gap-3 py-2.5 ${i < arr.length - 1 ? "border-b border-mj-line/70" : ""}`}>
                    {isWinner ? <MahjongTile char="🀄" size="sm" /> : <span aria-hidden className="h-8 w-7 shrink-0" />}
                    <span className="flex-1 text-[15px] font-extrabold">
                      {e.player}
                      {isWinner && <span className="ml-1 text-[11px] font-medium text-mj-muted">· winner</span>}
                    </span>
                    <span className={`font-display font-bold ${isWinner ? "text-[18px]" : "text-[17px]"} ${e.points > 0 ? "text-mj-pos" : e.points < 0 ? "text-mj-neg" : "text-mj-muted"}`}>
                      {e.points > 0 ? `+${e.points}` : e.points < 0 ? `−${Math.abs(e.points)}` : "0"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Card>

          {/* Single full-width save (matches Concept 10) */}
          <Button
            className="w-full"
            onClick={async () => {
              const payload = {
                winnerId: winner, winType,
                discarderId: selected.find((p) => p.name === discarder)?.player_id ?? null,
                flowers, kongs: result.kongCount, score: result.handValue,
                handData: {
                  flowers, kongCount: result.kongCount, subtotal: result.subtotal, categoryMultiplier: result.multiplier,
                  scoringCategory: result.category, handValue: result.handValue, winType, discarder,
                  participants: selected.map((p) => p.name), settlement: result.settlement,
                  meld1Tiles: melds[0], meld2Tiles: melds[1], meld3Tiles: melds[2], meld4Tiles: melds[3], pairTiles: pair,
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
            }}
          >
            Save &amp; Update Leaderboard
          </Button>
        </>
      )}
    </div>
  );
}

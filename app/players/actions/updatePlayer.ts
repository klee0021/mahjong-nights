"use server";

import { supabase } from "@/src/lib/supabase";
import { recalculateStats } from "./recalculateStats";

export async function updatePlayer(
  playerId: string,
  formData: FormData
) {
  const newName = String(formData.get("name") ?? "").trim();

  if (!newName) {
    return;
  }

  const { data: player } = await supabase
    .from("players")
    .select("name")
    .eq("id", playerId)
    .single();

  const oldName = player?.name;

  if (!oldName || oldName === newName) {
    return;
  }

  await supabase
    .from("players")
    .update({
      name: newName,
    })
    .eq("id", playerId);

  const { data: games } = await supabase
    .from("games")
    .select("id, hand_data");

  for (const game of games ?? []) {
    const handData = game.hand_data ?? {};

    if (!handData.participants?.includes(oldName)) {
      continue;
    }

    handData.participants =
      handData.participants.map((p: string) =>
        p === oldName ? newName : p
      );

    handData.settlement =
      (handData.settlement ?? []).map((entry: any) => ({
        ...entry,
        player:
          entry.player === oldName
            ? newName
            : entry.player,
      }));

    if (handData.discarder === oldName) {
      handData.discarder = newName;
    }

    ["meld1Source","meld2Source","meld3Source","meld4Source","pairSource"]
      .forEach((key) => {
        if (handData[key] === oldName) {
          handData[key] = newName;
        }
      });

    await supabase
      .from("games")
      .update({
        hand_data: handData,
      })
      .eq("id", game.id);
  }

  const { data: sessions } = await supabase
  .from("sessions")
  .select("id, leaderboard");

for (const session of sessions ?? []) {
  const leaderboard = session.leaderboard ?? [];

  let changed = false;

  const updatedLeaderboard = leaderboard.map((row: any) => {
    if (row.name === oldName) {
      changed = true;

      return {
        ...row,
        name: newName,
      };
    }

    return row;
  });

  if (changed) {
    await supabase
      .from("sessions")
      .update({
        leaderboard: updatedLeaderboard,
      })
      .eq("id", session.id);
  }
}
await recalculateStats();
}
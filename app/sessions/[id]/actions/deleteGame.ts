"use server";

import {
  revalidatePath
} from "next/cache";

import { redirect } from "next/navigation";
import { supabase } from "@/src/lib/supabase";

export async function deleteGame(
  sessionId: string,
  gameId: string
) {
  const { data: game } =
    await supabase
      .from("games")
      .select("*")
      .eq("id", gameId)
      .single();

  if (!game) {
    throw new Error(
      "Game not found"
    );
  }

  const settlement =
    game.hand_data
      ?.settlement ?? [];

  for (const entry of settlement) {
    const { data: player } =
      await supabase
        .from("players")
        .select("*")
        .eq("name", entry.player)
        .single();

    if (!player) continue;

    await supabase
      .from("players")
      .update({
        total_score:
          (player.total_score ?? 0) -
          entry.points,
      })
      .eq("id", player.id);
  }

  const { data: winner } =
    await supabase
      .from("players")
      .select("*")
      .eq("id", game.winner_id)
      .single();

  if (winner) {
    await supabase
      .from("players")
      .update({
        wins: Math.max(
          0,
          (winner.wins ?? 0) - 1
        ),
      })
      .eq("id", winner.id);
  }

     const result =
  await supabase
    .from("games")
    .delete()
    .eq("id", gameId)
    .select();

  const error =
    result.error;

  if (error) {
    console.error(
      "DELETE GAME ERROR:",
      error
    );

    throw new Error(
      error.message
    );
  }

    revalidatePath("/", "page");
  revalidatePath(
    `/sessions/${sessionId}`,
    "page"
  );
    revalidatePath(
    `/sessions/${sessionId}/history`,
    "page"
  );

  redirect(
    `/sessions/${sessionId}/history`
  );
}
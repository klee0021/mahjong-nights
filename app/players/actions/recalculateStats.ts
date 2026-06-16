"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/src/lib/supabase";

export async function recalculateStats() {
  const { data: players } =
    await supabase
      .from("players")
      .select("*");

  const { data: games } =
    await supabase
      .from("games")
      .select("*");

  if (!players || !games) {
    throw new Error("Data not found");
  }

  for (const player of players) {
    let totalScore = 0;
    let wins = 0;

    games.forEach((game: any) => {
      const settlement =
        game.hand_data?.settlement ?? [];

      settlement.forEach(
        (entry: any) => {
          if (
            entry.player === player.name
          ) {
            totalScore +=
              entry.points;
          }
        }
      );

      if (
        game.winner_id === player.id
      ) {
        wins++;
      }
    });

    await supabase
      .from("players")
      .update({
        total_score: totalScore,
        wins,
      })
      .eq("id", player.id);
  }

  revalidatePath("/");
  revalidatePath("/players");
}
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase } from "@/src/lib/supabase";

export async function deletePlayer(
  playerId: string
) {
  // Get player name
  const { data: player } =
    await supabase
      .from("players")
      .select("name")
      .eq("id", playerId)
      .single();

  if (!player) {
    redirect("/players");
  }

  // Find sessions containing the player
  const { data: memberships } =
    await supabase
      .from("session_players")
      .select("session_id")
      .eq("player_id", playerId);

  for (const membership of memberships ?? []) {
    const sessionId = membership.session_id;

    const { data: session } =
      await supabase
        .from("sessions")
        .select(
          "participant_count, leaderboard"
        )
        .eq("id", sessionId)
        .single();

    let leaderboard =
      (session?.leaderboard as any[]) ?? [];

    leaderboard = leaderboard.filter(
      (p) => p.name !== player.name
    );

    await supabase
      .from("sessions")
      .update({
        participant_count: Math.max(
          0,
          (session?.participant_count ?? 0) - 1
        ),
        leaderboard,
      })
      .eq("id", sessionId);

    revalidatePath(
      `/sessions/${sessionId}`
    );
  }

  // Delete player
  await supabase
    .from("players")
    .delete()
    .eq("id", playerId);

  revalidatePath("/");
  revalidatePath("/players");
  revalidatePath("/sessions");

  redirect("/players");
}
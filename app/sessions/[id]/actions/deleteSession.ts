"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase } from "@/src/lib/supabase";
import { recalculateStats } from "@/app/players/actions/recalculateStats";

export async function deleteSession(
  sessionId: string
) {
  await supabase
    .from("games")
    .delete()
    .eq("session_id", sessionId);

  await supabase
    .from("session_players")
    .delete()
    .eq("session_id", sessionId);

  await supabase
    .from("sessions")
    .delete()
    .eq("id", sessionId);

  await recalculateStats();

  revalidatePath("/");
  revalidatePath("/sessions");

  redirect("/sessions");
}
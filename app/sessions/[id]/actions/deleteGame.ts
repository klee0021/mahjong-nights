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

     const { error } = await supabase
  .from("games")
  .delete()
  .eq("id", gameId);

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
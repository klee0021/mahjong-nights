"use server";

import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";

import { supabase } from "@/src/lib/supabase";

export async function deletePlayer(

  playerId: string

) {

  await supabase

    .from("players")

    .delete()

    .eq("id", playerId);

  revalidatePath("/");

  revalidatePath("/players");

  redirect("/players");

}
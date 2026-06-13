"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/src/lib/supabase";

export async function addPlayer(formData: FormData) {
  const name = formData.get("name")?.toString().trim();

  if (!name) return;

  const { error } = await supabase
    .from("players")
    .insert({
      name,
    });

  if (error) {
    console.error(error);
    return;
  }

  revalidatePath("/players");
}
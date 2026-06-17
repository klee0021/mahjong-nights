"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/src/lib/supabase";

const TILES = [
  "🀇","🀈","🀉","🀊","🀋","🀌","🀍","🀎","🀏",
  "🀐","🀑","🀒","🀓","🀔","🀕","🀖","🀗","🀘",
  "🀙","🀚","🀛","🀜","🀝","🀞","🀟","🀠","🀡",
  "🀀","🀁","🀂","🀃",
  "🀄","🀅","🀆",
  "🀢","🀣","🀤","🀥","🀦","🀧","🀨","🀩","🀪","🀫",
];

export async function addSession(formData: FormData) {
  const name = formData.get("name")?.toString().trim();

  if (!name) return;

  const tile =
    TILES[Math.floor(Math.random() * TILES.length)];

  const { error } = await supabase
    .from("sessions")
    .insert({
      name,
      is_active: true,
      tile,
    });

  if (error) {
    console.error(error);
    return;
  }

  revalidatePath("/sessions");
}
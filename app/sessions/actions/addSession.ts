"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/src/lib/supabase";

const TILES = [
  "🀇","🀈","🀉","🀊","🀋","🀌","🀍","🀎","🀏",
  "🀐","🀑","🀒","🀓","🀔","🀕","🀖","🀗","🀘",
  "🀙","🀚","🀛","🀜","🀝","🀞","🀟","🀠","🀡",
  "🀀","🀁","🀂","🀃",
  "🀄","🀅","🀆",
  "🀢","🀣","🀤","🀥","🀦","🀧","🀨","🀩",
];

export async function addSession(formData: FormData) {
  const name = formData.get("name")?.toString().trim();

  if (!name) return;

  const { data: activeSessions } = await supabase
  .from("sessions")
  .select("tile")
  .eq("is_active", true);

const usedTiles =
  activeSessions?.map((s) => s.tile) ?? [];

const availableTiles =
  TILES.filter(
    (tile) => !usedTiles.includes(tile)
  );

const tilePool =
  availableTiles.length > 0
    ? availableTiles
    : TILES;

const tile =
  tilePool[
    Math.floor(Math.random() * tilePool.length)
  ];

  const { error } = await supabase
    .from("sessions")
    .insert({
      name,
      is_active: true,
      tile,
    });

  if (error) {
}
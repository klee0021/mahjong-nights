"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/src/lib/supabase";

export async function addSession(formData: FormData) {
  const name = formData.get("name")?.toString().trim();

  if (!name) return;

  const { error } = await supabase
    .from("sessions")
    .insert({
      name,
      is_active: true,
    });

  if (error) {
    console.error(error);
    return;
  }

  revalidatePath("/sessions");
}
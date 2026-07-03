"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/src/lib/supabase";

export async function endSession(
  sessionId: string
) {
  await supabase
    .from("sessions")
    .update({
      is_active: false,
    })
    .eq("id", sessionId);

  revalidatePath("/");
revalidatePath("/sessions");
revalidatePath(
  `/sessions/${sessionId}`
);
}
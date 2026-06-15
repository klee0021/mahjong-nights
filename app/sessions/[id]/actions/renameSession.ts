"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase } from "@/src/lib/supabase";

export async function renameSession(
  sessionId: string,
  formData: FormData
) {
  const name =
    formData
      .get("name")
      ?.toString()
      .trim();

  if (!name) return;

  await supabase
    .from("sessions")
    .update({
      name,
    })
    .eq("id", sessionId);

  revalidatePath("/");
revalidatePath("/sessions");
revalidatePath(
  `/sessions/${sessionId}`
);

redirect(
  `/sessions/${sessionId}`
);
}
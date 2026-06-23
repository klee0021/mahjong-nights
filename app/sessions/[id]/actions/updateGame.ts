"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/src/lib/supabase";

export async function updateGame({
  gameId,
  sessionId,
  score,
  flowers,
  kongs,
  winType,
  discarderId,
  handData,
}: {
  gameId: string;
  sessionId: string;
  score: number;
  flowers: number;
  kongs: number;
  winType: string;
  discarderId: string | null;
  handData: any;
}) {
  console.log(
    "UPDATE GAME:",
    gameId
  );

  const result =
    await supabase
      .from("games")
     .update({
  score,
  flowers,
  kongs,
  winner_name:
    handData.settlement.find(
      (e: any) => e.points > 0
    )?.player,
  win_type: winType,
  discarder_id: discarderId,
  hand_data: handData,
})
      .eq("id", gameId)
      .select();

  console.log(
    "UPDATE RESULT:",
    result
  );

 if (result.error) {
  console.error(
    "UPDATE ERROR:",
    result.error
  );

  throw new Error(
    result.error.message
  );
}

  revalidatePath("/");
  revalidatePath("/players");
  revalidatePath(`/sessions/${sessionId}`);
  revalidatePath(`/sessions/${sessionId}/history`);
}
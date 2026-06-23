import { unstable_cache } from "next/cache";
import { supabase } from "@/src/lib/supabase";

export const getPlayers = unstable_cache(
  async () => {
    const { data } = await supabase
      .from("players")
      .select("*")
      .order("total_score", {
        ascending: false,
      });

    return data ?? [];
  },
  ["players"],
  {
    tags: ["players"],
  }
);
import { supabase } from "@/src/lib/supabase";
import { AppShell } from "@/src/components/ui/AppShell";
import { Medal, ScoreValue, Button } from "@/src/components/ui/primitives";
import { addPlayer } from "./actions/addPlayer";
import PlayersView from "./PlayersView";
import type { Player } from "@/src/lib/types";
import { TapCard } from "@/src/components/ui/TapCard";
import { TapButton } from "@/src/components/ui/TapButton";

export default async function PlayersPage() {
const { data } = await supabase
  .from("players")
  .select("*")
  .order("total_score", {
    ascending: false,
  });

const players = (data ?? []) as Player[];

  return (
    <AppShell active="players">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold uppercase text-mj-green">
          Players
        </h1>

      </div>

      <form
        action={addPlayer}
        className="mb-5 flex gap-2.5"
      >
        <input
          name="name"
          placeholder="Player name"
          className="flex-1 rounded-2xl border border-mj-line bg-mj-card px-3.5 py-3 text-sm outline-none focus:border-mj-green"
        />

        <TapButton
  type="submit"
  className="px-4 py-3"
>
  Add
</TapButton>
      </form>

      <PlayersView players={players} />
    </AppShell>
  );
}

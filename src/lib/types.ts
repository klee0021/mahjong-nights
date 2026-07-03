export type Player = { id: string; name: string; wins: number; total_score: number };

export type SessionSummary = {
  id: string; name: string; created_at: string; is_active: boolean;
  player_count?: number; hand_count?: number;
};

export type SettlementEntry = { player: string; points: number };

export type WinType = "self-draw" | "claimed";

export type GameRecord = {
  id: string;
  index: number;                 // hand # within session
  winner: string;
  win_type: WinType;
  discarder?: string | null;
  feeder?: string | null;
  score: number;                 // hand value
  tiles: string[];               // 14 unicode tiles (meld1..4 + pair)
  settlement: SettlementEntry[];
};

export type Standing = { name: string; points: number; wins?: number; wind?: string };

export type PlayerStats = {
  total_score: number; wins: number; win_rate: string; avg_win_hand: string;
};

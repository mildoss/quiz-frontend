import {Game} from "@/types/game";

export interface UserStats {
  user_id: number;
  username: string;
  losses: number;
  score: number;
  wins: number;
  game_quantity: number;
}

export interface LeaderboardResponse {
  users: UserStats[];
}

export interface StatsResponse {
  stats: UserStats;
  recentlyGames: Game[];
}
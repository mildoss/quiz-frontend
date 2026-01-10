export interface Game {
  game_id: number;
  score: number;
  status: boolean;
  date: string;
}

export interface GameInfoResponse extends Game {
  username: string;
  user_id: number;
}
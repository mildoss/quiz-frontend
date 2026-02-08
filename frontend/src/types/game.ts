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

export type GameStatus = 'WAITING' | 'COUNTDOWN' | 'ACTIVE' | 'FINISHED';

export interface Player {
  id: number;
  username: string;
  playerStatus: string;
  score?: number;
  inAnswer?: boolean;
}

export interface GameRoom {
  id: number;
  status: GameStatus;
  players: Player[];
  countdownEndTime?: string;
}

export interface RoomUpdate {
  gameRoom: GameRoom;
  gameRoomTopic?: string;
}
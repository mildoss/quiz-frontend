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

export enum GameStatus {
  WAITING = 'WAITING',
  COUNTDOWN = 'COUNTDOWN',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
  ROUND_FINISHED = 'ROUND_FINISHED'
}

export enum PlayerStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED'
}

export interface Player {
  id: number;
  username: string;
  status: string;
  score?: number;
  isAnswered?: boolean;
  isCorrect?: boolean;
}

export interface Answer {
  id: number;
  text: string;
}

export interface GameRoom {
  id: number;
  status: GameStatus;
  players: Player[];
  countdownEndTime?: string;
  currentQText: string;
  currentAnswers: Answer[];
  currentQNum: number;
  qQuantity: number;
  roundEndTime: string;
  currentTime: string;
  currentQId: number;
  answerId: number;
  gameId: number;
  topic: string;
  currentImageUrl: string;
}

export interface RoomUpdate {
  gameRoom: GameRoom;
  gameRoomTopic?: string;
}
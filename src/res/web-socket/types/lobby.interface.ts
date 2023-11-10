import UserData from './user-data.interface';
import { UUID } from 'crypto';

export default interface Lobby {
  id?: UUID;
  players: [UserData, UserData];
  ranked: boolean;
  mode: string;
  owner: string;
  queueLobby: boolean;
  isOwner?: boolean;
  lobbySate: 'ingame' | 'idle' | 'starting' | 'finished';
  gameData: GameData;
  intervalId?: NodeJS.Timeout;
}

export interface LobbyCreate {
  players: [string, string];
}

export interface GameData {
  paddle1: Paddle;
  paddle2: Paddle;
  ball: Ball;
  score: number[];
  scoreUpdated: boolean;
}

export interface Paddle {
  x: number;
  y: number;
  isUP: boolean;
  isDown: boolean;
}

export interface Ball {
  x: number;
  y: number;
  xDirection: number;
  yDirection: number;
}

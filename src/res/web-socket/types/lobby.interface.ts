import { GameMode } from './game-mode.interface';
import UserData from './user-data.interface';
import { UUID } from 'crypto';

export default interface Lobby {
  id?: UUID;
  players: [UserData, UserData];
  ranked: boolean;
  mode: GameMode;
  owner: string;
  queueLobby: boolean;
  isOwner?: boolean;
  lobbySate: 'ingame' | 'idle' | 'starting';
  gameData: GameData;
}

export interface LobbyCreate {
  players: [string, string];
  mode?: GameMode;
  queueLobby?: boolean;
  ranked?: boolean;
  lobbySate?: 'idle' | 'ingame' | 'starting';
}

export interface GameData {
  paddle1: Paddle;
  paddle2: Paddle;
  ball: Ball;
  score: number[];
  scoreUpdated: boolean;
  gameStartDate: number;
  timer?: number;
}

export interface Paddle {
  x: number;
  y: number;
  isUP: boolean;
  isDown: boolean;
  height: number;
}

export interface Ball {
  x: number;
  y: number;
  xDirection: number;
  yDirection: number;
  xSpeed: number;
  ySpeed: number;
}

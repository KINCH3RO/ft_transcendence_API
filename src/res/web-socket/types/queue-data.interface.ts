import { GameMode } from './game-mode.interface';

export default interface queueData {
  id: string;
  rating: number;
  gameMode: GameMode;
  ranked: boolean;
  startDate: number;
}

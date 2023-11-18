import { matches } from '@prisma/client';

export class Match implements matches {
  id: number;
  winnerID: string;
  loserID: string;
  winnerScore: number;
  loserScore: number;
  date: Date;
  gameMode: string;
  ranked: boolean;
  duration: number;
}

export enum gameMode {
  'CLASSIC',
}

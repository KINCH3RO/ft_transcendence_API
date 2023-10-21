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
}

export enum gameMode {
  'RANKED',
  'NORMAL',
}

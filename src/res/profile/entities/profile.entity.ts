import { profile } from '@prisma/client';

export class Profile implements profile {
  id: string;
  rating: number;
  level: number;
  xp: number;
  coins: number;
}

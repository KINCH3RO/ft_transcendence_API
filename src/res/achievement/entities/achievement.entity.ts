import { achievements } from '@prisma/client';

export class Achievement implements achievements {
  id: number;
  imgUrl: string;
  name: string;
  description: string;
  reward: number;
}

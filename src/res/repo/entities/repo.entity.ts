import { repo } from '@prisma/client';

export class Repo implements repo {
  id: string;
  mapSkinID: string;
  paddleSkinID: string;
}

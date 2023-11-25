import { product } from '@prisma/client';

export class Product implements product {
  id: string;
  name: string;
  category: 'PADDLE' | 'MAPSKIN';
  price: number;
  color: string;
  img: string;
}

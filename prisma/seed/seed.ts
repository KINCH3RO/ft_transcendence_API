import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const url = process.env.URL_PREFIX;

async function main() {
  const achievements = await prisma.achievements.count();
  if (achievements != 0) return;
  const achievementPromise = prisma.achievements.createMany({
    data: [
      {
        id: 0,
        description: 'Win a clean 5-0',
        name: 'Ace',
        reward: 200,
        imgUrl: `${url}//assets/achievements/Ace.png`,
      },
      {
        id: 1,
        description: 'Block a ball while stunned',
        name: 'Stunned Savior',
        reward: 200,
        imgUrl: `${url}//assets/achievements/Stunned.png`,
      },
      {
        id: 2,
        description: 'Win with at least 5 gravity orbs on your side',
        name: 'Imperturbable',
        reward: 200,
        imgUrl: `${url}//assets/achievements/Gravity.png`,
      },
      {
        id: 3,
        description: 'Concede a goal despite having speed up boost',
        name: 'Speedy Slip-Up',
        reward: 200,
        imgUrl: `${url}//assets/achievements/Speed.png`,
      },
      {
        id: 4,
        description: 'Lose a match without touching the ball',
        name: 'Delete the game',
        reward: 200,
        imgUrl: `${url}//assets/achievements/Delete.png`,
      },
      {
        id: 5,
        description: 'Get a rating of 1000',
        name: 'Ascendant',
        reward: 200,
        imgUrl: `${url}//assets/achievements/Rating1000.png`,
      },
      {
        id: 6,
        description: 'Get a rating of 2000',
        name: 'Expert',
        reward: 200,
        imgUrl: `${url}//assets/achievements/Rating2000.png`,
      },
      {
        id: 7,
        description: 'Get a rating of 5000',
        name: 'Legendary',
        reward: 200,
        imgUrl: `${url}//assets/achievements/Rating5000.png`,
      },
      {
        id: 8,
        description: 'Reach level 20',
        name: 'General',
        reward: 200,
        imgUrl: `${url}//assets/achievements/Level20.png`,
      },
      {
        id: 9,
        description: 'Reach level 50',
        name: 'Veteran',
        reward: 200,
        imgUrl: `${url}//assets/achievements/Level50.png`,
      },
      {
        id: 10,
        description: 'Join the Pong Fury website',
        name: 'Welcome',
        reward: 200,
        imgUrl: `${url}//assets/achievements/Level20.png`,
      },
      {
        id: 11,
        description: 'Play your first game of pong',
        name: 'First Game',
        reward: 200,
        imgUrl: `${url}//assets/achievements/Level50.png`,
      },
    ],
  });

  const skinsPromise = prisma.product.createMany({
    data: [
      { category: 'PADDLE', name: 'Red', price: 200, color: '#EE4B2B' },
      { category: 'PADDLE', name: 'White', price: 200, color: '#FFFFFF' },
      { category: 'PADDLE', name: 'Green', price: 200, color: '#50C878' },
      { category: 'PADDLE', name: 'Purple', price: 200, color: '#5D3FD3' },
      { category: 'PADDLE', name: 'Turquoise', price: 200, color: '#5DD9C1' },
      { category: 'PADDLE', name: 'Aquamarine', price: 200, color: '#ACFCD9' },
      { category: 'PADDLE', name: 'Sunset', price: 200, color: '#F9C784' },
      { category: 'PADDLE', name: 'Pean Blue', price: 200, color: '#111344' },

      {
        category: 'MAPSKIN',
        name: 'Black Border',
        price: 500,
        img: `${url}/assets/mapSkins/blackSkin.png`,
      },
      {
        category: 'MAPSKIN',
        name: 'Black Blue Border',
        price: 500,
        img: `${url}/assets/mapSkins/blueBlackSkin.png`,
      },
      {
        category: 'MAPSKIN',
        name: 'Blue Border',
        price: 500,
        img: `${url}/assets/mapSkins/blueSkin.png`,
      },
      {
        category: 'MAPSKIN',
        name: 'hatim',
        price: 500,
        img: `https://cdn.intra.42.fr/users/c7745f268ba8e8f3a29601afe2e426a0/harachid.jpg`,
      },
      {
        category: 'MAPSKIN',
        name: 'ghali',
        price: 500,
        img: `https://cdn.intra.42.fr/users/49f298a2e1a02186d8be089180742d49/mtagemou.jpg`,
      },
      {
        category: 'MAPSKIN',
        name: 'rachid',
        price: 500,
        img: `https://cdn.intra.42.fr/users/43791775d07f632baec94c4444b63671/rben-mou.jpg`,
      },
      {
        category: 'MAPSKIN',
        name: 'samini',
        price: 500,
        img: `https://cdn.intra.42.fr/users/db302ee0a607a454a464ecb146bd6057/samini.jpg`,
      },
    ],
  });

  return Promise.all([achievementPromise, skinsPromise]);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });

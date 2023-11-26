import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const url = process.env.URL_PREFIX;

async function main() {
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
    ],
  });

  const skinsPromise = prisma.product.createMany({
    data: [
      { category: 'PADDLE', name: 'Red', price: 200, color: '#EE4B2B' },
      { category: 'PADDLE', name: 'White', price: 200, color: '#FFFFFF' },
      { category: 'PADDLE', name: 'Green', price: 200, color: '#50C878' },
      { category: 'PADDLE', name: 'Purple', price: 200, color: '#5D3FD3' },
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

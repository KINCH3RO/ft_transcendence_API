import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const achievementPromise = prisma.achievements.createMany({
    data: [
      {
        description: 'Win a clean 5-0',
        name: 'Ace',
        reward: 200,
        imgUrl: 'https://avatars.githubusercontent.com/u/77490730?v=4',
      },
      {
        description: 'Block a ball while stunned',
        name: 'Stunned Savior',
        reward: 200,
        imgUrl: 'https://avatars.githubusercontent.com/u/77490730?v=4',
      },
      {
        description: 'Win with at least 5 gravity orbs on your side',
        name: 'Imperturbable',
        reward: 200,
        imgUrl: 'https://avatars.githubusercontent.com/u/77490730?v=4',
      },
      {
        description: 'Concede a goal despite having speed up boost',
        name: 'Speedy Slip-Up',
        reward: 200,
        imgUrl: 'https://avatars.githubusercontent.com/u/77490730?v=4',
      },
      {
        description: 'Lose a match without touching the ball',
        name: 'Delete the game',
        reward: 200,
        imgUrl: 'https://avatars.githubusercontent.com/u/77490730?v=4',
      },
      {
        description: 'Get a rating of 1000',
        name: 'Ascendant',
        reward: 200,
        imgUrl: 'https://avatars.githubusercontent.com/u/77490730?v=4',
      },
      {
        description: 'Get a rating of 2000',
        name: 'Expert',
        reward: 200,
        imgUrl: 'https://avatars.githubusercontent.com/u/77490730?v=4',
      },
      {
        description: 'Get a rating of 5000',
        name: 'Legendary',
        reward: 200,
        imgUrl: 'https://avatars.githubusercontent.com/u/77490730?v=4',
      },
      {
        description: 'Reach level 20',
        name: 'General',
        reward: 200,
        imgUrl: 'https://avatars.githubusercontent.com/u/77490730?v=4',
      },
      {
        description: 'Reach level 50',
        name: 'Veteran',
        reward: 200,
        imgUrl: 'https://avatars.githubusercontent.com/u/77490730?v=4',
      },
    ],
  });

  return Promise.all([achievementPromise]);
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

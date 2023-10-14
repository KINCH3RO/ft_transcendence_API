import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();
async function main() {
	const kin = await prisma.user.upsert({
		where: { email: "hat83203@gmail.com" },
		update: {},
		create: {
			userName: "KINCHERO",
			email: "hat83203@gmail.com",
			fullName: "Hatim Rachid",
			password: "password",
			onlineStatus: false,
			avatarUrl: "https://steamavatar.io/img/1477787659sO497.png",
			bannerUrl: "https://e0.pxfuel.com/wallpapers/34/136/desktop-wallpaper-futuristic-futuristic-neon.jpg",
			profile: {
				create: {
					coins: 0,
					rating: 0,
					xp: 154878,
					level: 10
				}
			}

		}
	})

	const ghalix = await prisma.user.upsert({
		where: { email: "ghalix@gmail.com" },
		update: {},
		create: {
			userName: "ghalix",
			email: "ghalix@gmail.com",
			fullName: "Mohamed El Ghali Tagemouati",
			password: "password",
			onlineStatus: false,
			avatarUrl: "https://steamavatar.io/img/14777876487vBgd.jpg",
			bannerUrl: "https://t3.ftcdn.net/jpg/04/19/20/80/360_F_419208090_GoYwLz1S9kTSFDkHHtwtUUkWpHVuBejI.jpg",
			profile: {
				create: {
					coins: 0,
					rating: 0,
					xp: 154878,
					level: 10
				}
			}

		}
	})

	const samini = await prisma.user.upsert({
		where: { email: "samini@gmail.com" },
		update: {},
		create: {
			userName: "soufiane",
			email: "samini@gmail.com",
			fullName: "soufiane amini",
			password: "password",
			onlineStatus: false,
			avatarUrl: "https://steamavatar.io/img/1477742864kHhXM.jpg",
			bannerUrl: "https://wallpapercave.com/wp/wp6311373.jpg",
			profile: {
				create: {
					coins: 0,
					rating: 0,
					xp: 154878,
					level: 10
				}
			}

		}
	})

	const rash = await prisma.user.upsert({
		where: { email: "rash@gmail.com" },
		update: {},
		create: {
			userName: "RaSH",
			email: "rash@gmail.com",
			fullName: "rben-mou",
			password: "password",
			onlineStatus: false,
			avatarUrl: "https://steamavatar.io/img/1477787659sO497.png",
			bannerUrl: "https://w0.peakpx.com/wallpaper/182/1018/HD-wallpaper-futuristic-cyberpunk-city-digital-art-cyberpunk-futuristic-city.jpg",
			profile: {
				create: {
					coins: 0,
					rating: 0,
					xp: 154878,
					level: 10
				}
			}


		}
	})

	const associatedAccount1 = await prisma.associatedAccount.upsert(
		{
			where: { id: "" },
			update: {},
			create: {
				email: "hat83203@gmail.com",
				userID: kin.id,
				provider: "GOOGLE",
			}
		}
	)

	const associatedAccount2 = await prisma.associatedAccount.upsert(
		{
			where: { id: "" },
			update: {},
			create: {
				email: "rash@gmail.com",
				userID: rash.id,
				provider: "GOOGLE",
			}
		}
	)

	const associatedAccount3 = await prisma.associatedAccount.upsert(
		{
			where: { id: "" },
			update: {},
			create: {
				email: "ghalix@gmail.com",
				userID: ghalix.id,
				provider: "GOOGLE",
			}
		}
	)

	const matches1 = await prisma.matches.createMany(
		{
			data:
				[
					{
						gameMode: "Normal",
						loserID: ghalix.id,
						winnerID: kin.id,
						loserScore: 0,
						winnerScore: 8,
						date: new Date().toISOString(),
						ranked: true
					}, {
						gameMode: "Normal",
						loserID: ghalix.id,
						winnerID: kin.id,
						loserScore: 0,
						winnerScore: 8,
						date: new Date().toISOString(),
						ranked: true
					}, {
						gameMode: "Normal",
						loserID: ghalix.id,
						winnerID: kin.id,
						loserScore: 0,
						winnerScore: 8,
						date: new Date().toISOString(),
						ranked: true
					}, {
						gameMode: "Normal",
						loserID: ghalix.id,
						winnerID: kin.id,
						loserScore: 0,
						winnerScore: 8,
						date: new Date().toISOString(),
						ranked: true
					}, {
						gameMode: "Normal",
						loserID: ghalix.id,
						winnerID: kin.id,
						loserScore: 0,
						winnerScore: 8,
						date: new Date().toISOString(),
						ranked: true
					}, {
						gameMode: "Normal",
						loserID: ghalix.id,
						winnerID: kin.id,
						loserScore: 0,
						winnerScore: 8,
						date: new Date().toISOString(),
						ranked: true
					},
					{
						gameMode: "Normal",
						loserID: kin.id,
						winnerID: ghalix.id,
						loserScore: 0,
						winnerScore: 8,
						date: new Date().toISOString(),
						ranked: true
					},
					{
						gameMode: "Normal",
						loserID: kin.id,
						winnerID: ghalix.id,
						loserScore: 0,
						winnerScore: 8,
						date: new Date().toISOString(),
						ranked: true
					}, {
						gameMode: "Normal",
						loserID: kin.id,
						winnerID: ghalix.id,
						loserScore: 0,
						winnerScore: 8,
						date: new Date().toISOString(),
						ranked: true
					}, {
						gameMode: "Normal",
						loserID: kin.id,
						winnerID: ghalix.id,
						loserScore: 0,
						winnerScore: 8,
						date: new Date().toISOString(),
						ranked: true
					}, {
						gameMode: "Normal",
						loserID: kin.id,
						winnerID: ghalix.id,
						loserScore: 0,
						winnerScore: 8,
						date: new Date().toISOString(),
						ranked: true
					}, {
						gameMode: "Normal",
						loserID: kin.id,
						winnerID: ghalix.id,
						loserScore: 0,
						winnerScore: 8,
						date: new Date().toISOString(),
						ranked: true
					},
				]
		}

	)

	const matches = await prisma.matches.createMany({
		data:
			[
				{
					gameMode: "Normal",
					loserID: rash.id,
					winnerID: samini.id,
					loserScore: 0,
					winnerScore: 8,
					date: new Date().toISOString(),
					ranked: true
				},
				{
					gameMode: "Normal",
					loserID: rash.id,
					winnerID: samini.id,
					loserScore: 0,
					winnerScore: 8,
					date: new Date().toISOString(),
					ranked: true
				}, {
					gameMode: "Normal",
					loserID: rash.id,
					winnerID: samini.id,
					loserScore: 0,
					winnerScore: 8,
					date: new Date().toISOString(),
					ranked: true
				}, {
					gameMode: "Normal",
					loserID: rash.id,
					winnerID: samini.id,
					loserScore: 0,
					winnerScore: 8,
					date: new Date().toISOString(),
					ranked: true
				}, {
					gameMode: "Normal",
					loserID: rash.id,
					winnerID: samini.id,
					loserScore: 0,
					winnerScore: 8,
					date: new Date().toISOString(),
					ranked: true
				},
				{
					gameMode: "Normal",
					loserID: samini.id,
					winnerID: rash.id,
					loserScore: 0,
					winnerScore: 8,
					date: new Date().toISOString(),
					ranked: true
				},
				{
					gameMode: "Normal",
					loserID: samini.id,
					winnerID: rash.id,
					loserScore: 0,
					winnerScore: 8,
					date: new Date().toISOString(),
					ranked: true
				}, {
					gameMode: "Normal",
					loserID: samini.id,
					winnerID: rash.id,
					loserScore: 0,
					winnerScore: 8,
					date: new Date().toISOString(),
					ranked: true
				}, {
					gameMode: "Normal",
					loserID: samini.id,
					winnerID: rash.id,
					loserScore: 0,
					winnerScore: 8,
					date: new Date().toISOString(),
					ranked: true
				}, {
					gameMode: "Normal",
					loserID: samini.id,
					winnerID: rash.id,
					loserScore: 0,
					winnerScore: 8,
					date: new Date().toISOString(),
					ranked: true
				},
			]

	})
	const friendStatus = await prisma.friendStatus.createMany(
		{
			data: [
				{ blockStatus: "NONE", muteStatus: "NONE", senderID: ghalix.id, receiverID: kin.id },
				{ blockStatus: "NONE", muteStatus: "NONE", senderID: samini.id, receiverID: rash.id }
			]
		}
	)

	const friendRequests = await prisma.friendRequests.createMany(
		{
			data:
				[
					{ receiverID: ghalix.id, senderID: rash.id },
					{ receiverID: kin.id, senderID: samini.id },
				]
		}
	)

	const channels = await prisma.channel.createMany(
		{
			data:
				[
					{ imageUrl: "https://steamavatar.io/img/1477684926Qx9fW.png", name: "paddleStars", visibility: "PUBLIC", password: "" },
					{ imageUrl: "https://steamavatar.io/img/1477684926Qx9fW.png", name: "paddleWarriors", visibility: "PRIVATE", password: "" },
					{ imageUrl: "https://steamavatar.io/img/1477684926Qx9fW.png", name: "paddleGamers", visibility: "PROTECTED", password: "wow" },
					{ imageUrl: "https://steamavatar.io/img/1477684926Qx9fW.png", name: "paddller", visibility: "PUBLIC", password: "" },
					{ imageUrl: "https://steamavatar.io/img/1477684926Qx9fW.png", name: "Cyka", visibility: "PUBLIC", password: "" },
					{ imageUrl: "https://steamavatar.io/img/1477684926Qx9fW.png", name: "paddller1", visibility: "PUBLIC", password: "" },
					{ imageUrl: "https://steamavatar.io/img/1477684926Qx9fW.png", name: "paddller2", visibility: "PUBLIC", password: "" },
					{ imageUrl: "https://steamavatar.io/img/1477684926Qx9fW.png", name: "paddller3", visibility: "PUBLIC", password: "" },
					{ imageUrl: "https://steamavatar.io/img/1477684926Qx9fW.png", name: "paddller4", visibility: "PUBLIC", password: "" },
					{ imageUrl: "https://steamavatar.io/img/1477684926Qx9fW.png", name: "paddller5", visibility: "PUBLIC", password: "" },
				]
		}
	)

	const achievement = await prisma.achievements.createMany({
		data: [
			{ description: "some description of an achievement", name: "paddleWarrior", reward: 200, imgUrl: "https://avatars.githubusercontent.com/u/77490730?v=4" },
			{ description: "some description of an achievement", name: "paddleWarrior2", reward: 200, imgUrl: "https://avatars.githubusercontent.com/u/77490730?v=4" },
			{ description: "some description of an achievement", name: "paddleWarrior3", reward: 200, imgUrl: "https://avatars.githubusercontent.com/u/77490730?v=4" },
			{ description: "some description of an achievement", name: "paddleWarrior4", reward: 200, imgUrl: "https://avatars.githubusercontent.com/u/77490730?v=4" },
			{ description: "some description of an achievement", name: "paddleWarrior5", reward: 200, imgUrl: "https://avatars.githubusercontent.com/u/77490730?v=4" },
			{ description: "some description of an achievement", name: "paddleWarrior6", reward: 200, imgUrl: "https://avatars.githubusercontent.com/u/77490730?v=4" },
			{ description: "some description of an achievement", name: "paddleWarrior7", reward: 200, imgUrl: "https://avatars.githubusercontent.com/u/77490730?v=4" },
			{ description: "some description of an achievement", name: "paddleWarrior8", reward: 200, imgUrl: "https://avatars.githubusercontent.com/u/77490730?v=4" },
			{ description: "some description of an achievement", name: "paddleWarrior9", reward: 200, imgUrl: "https://avatars.githubusercontent.com/u/77490730?v=4" },
		]
	})

}


main()

	.then(async () => {

		await prisma.$disconnect()

	})

	.catch(async (e) => {

		console.error(e)

		await prisma.$disconnect()

		process.exit(1)

	})

import { Repo } from 'src/res/repo/entities/repo.entity';
import GraviraSpawner from '../gamemodes/gravira/spawner';
import SpellWeaverEntity from '../gamemodes/magician/spellweaver';
import { GameMode } from './game-mode.interface';
import UserData from './user-data.interface';
import { UUID } from 'crypto';

export default interface Lobby {
	id?: UUID;
	players: [UserData, UserData];
	ranked: boolean;
	mode: GameMode;
	owner: string;
	queueLobby: boolean;
	isOwner?: boolean;
	lobbySate: 'ingame' | 'idle' | 'starting' | 'finishing';
	gameData: GameData;
	skins?: Repo[];
}

export interface LobbyCreate {
	players: [string, string];
	mode?: GameMode;
	queueLobby?: boolean;
	ranked?: boolean;
	lobbySate?: 'idle' | 'ingame' | 'starting';
	skins?: Repo[];
}

export interface GameData {
	paddle1: Paddle;
	paddle2: Paddle;
	ball: Ball;
	score: number[];
	scoreUpdated: boolean;
	resourcesUpdated: boolean;
	gameStartDate: number;
	timer?: number;
	spawner?: GraviraSpawner;
	spellWeaver?: SpellWeaverEntity;
	achievements: AchievementUnlock[];
}

export interface AchievementUnlock {
	stunnedSavior: boolean;
	speedySlipup: boolean;
	deleteGame: boolean;
	imperturbable: boolean;
}

export interface Paddle {
	x: number;
	y: number;
	mana: number | null;
	isCasting: boolean;
	isStunned: boolean;
	isUP: boolean;
	isDown: boolean;
	numberPressed: string | null;
	height: number;
	speed: number;
	castDuration: number;
	stunDuration: number;
	homingStunOrbs: { x: number; y: number; collided: boolean }[];
}

export interface Ball {
	x: number;
	y: number;
	xDirection: number;
	yDirection: number;
	xSpeed: number;
	ySpeed: number;
}

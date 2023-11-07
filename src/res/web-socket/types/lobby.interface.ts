import { User } from "src/res/users/entities/user.entity"
import UserData from "./user-data.interface"
import { UUID } from "crypto"

export default interface Lobby {
	id?: UUID,
	players: [UserData, UserData]
	ranked: boolean,
	mode: string
	owner: string,
	queueLobby: boolean
	isOwner?: boolean
	lobbySate: "ingame" | "idle" | "starting"
	gameData: any

}


export interface LobbyCreate {
	players: [string, string]

}

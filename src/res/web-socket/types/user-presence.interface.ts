export default interface userPresence {
	sockets: string[],
	state: "Online" | "AFK" | "In-Game" | "In-Queue" | "In-Lobby"
}

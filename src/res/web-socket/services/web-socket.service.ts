import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UUID } from 'crypto';
import userPresence from '../types/user-presence.interface';

@Injectable()
export class WebSocketService {
	constructor(private jwtService: JwtService) { }

	onlineUsers: { [userId: string]: userPresence } = {};

	userConnected(userID: string, socketID: string, callback: () => void = null) {

		console.log("connect")
		if (!this.onlineUsers[userID]) {
			callback && callback();
			this.onlineUsers[userID] =
			{
				sockets: [socketID],
				state: 'Online'
			}
		}
		else
			this.onlineUsers[userID].sockets.push(socketID);
		console.log(this.onlineUsers);
	}

	userDisconnected(token: string, socketID: string, callback: (userID: string) => void = null) {

		console.log("disconnect")
		let userID = "none";

		try {
			userID = this.jwtService.verify(token,
				{
					secret: process.env.JWT_SECRET
				}).sub;
		} catch (error) {
			throw error;
		}
		if (!this.onlineUsers[userID])
			return;
		if (this.onlineUsers[userID].sockets.length > 1)
			this.onlineUsers[userID].sockets = this.onlineUsers[userID].sockets.filter((id: string) => socketID != id)
		else {
			callback && callback(userID);
			delete this.onlineUsers[userID];
		}
		console.log(this.onlineUsers);
	}

	getSockets(userID: string) {
		return this.onlineUsers[userID].sockets;

	}
	isOnline(userID: string): boolean {
		if (this.onlineUsers[userID])
			return true;
		return false;
	}

	setPresenceState(userID: string, state: "Online" | "AFK" | "In-Game" | "In-Queue" | "In-Lobby") {
		this.onlineUsers[userID].state = state;
	}
}

import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket, Server } from 'socket.io';

import {
	BaseWsExceptionFilter,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets';
import { TokenGuard } from './token.guard';
import { TokenPipe } from './token.pipe';
import { WebSocketService } from './web-socket.service';
import { BodyData } from './body-data.interface';
//handling present events

@UseFilters(new BaseWsExceptionFilter())
@UseGuards(TokenGuard)
@UsePipes(new TokenPipe(new JwtService()))
@WebSocketGateway({ cors: true, transports: ['websocket'] })

export class LobbyGate {
	constructor(private readonly webSocketService: WebSocketService) {

	}

	@WebSocketServer()
	io: Server;
	@SubscribeMessage("lobbyInvite")
	handlePrivateMessage(socket: Socket, data: BodyData) {

		this.io.to(data.data.id).emit("lobbyInvite", data.data)

	}




}

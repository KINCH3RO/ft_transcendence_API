import {

	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	MessageBody,
	ConnectedSocket,
	WsException,
} from '@nestjs/websockets';
import { WebSocketService } from '../services/web-socket.service';
import { Socket, Server } from 'socket.io';
import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator';
import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { TokenGuard } from '../token.guard';
import { TokenPipe } from '../token.pipe';
import { JwtService } from '@nestjs/jwt';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { BodyData } from '../types/body-data.interface';
//handling present events

@UseFilters(new BaseWsExceptionFilter())
@UseGuards(TokenGuard)
@UsePipes(new TokenPipe(new JwtService()))
@WebSocketGateway({ cors: true, transports: ['websocket'] })

export class FriendGate {
	constructor(private readonly webSocketService: WebSocketService) { }

	@WebSocketServer()
	io: Server;


	@SubscribeMessage("friendAction")
	handleFriendAction(socket: Socket, data: BodyData) {
		// emit to self
		this.io.to([data.data.senderID, data.data.receiverID]).emit("friendAction", data)

	}

	@SubscribeMessage("friendReqAction")
	handleFriendReqAction(socket: Socket, data: BodyData) {
		this.io.to([data.data.senderID, data.data.receiverID]).emit("friendReqAction", data)
	}





}

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
import { WebSocketService } from './web-socket.service';
import { Socket, Server } from 'socket.io';
import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator';
import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { TokenGuard } from './token.guard';
import { TokenPipe } from './token.pipe';
import { JwtService } from '@nestjs/jwt';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { BodyData } from './body-data.interface';
//handling present events

@UseFilters(new BaseWsExceptionFilter())
@UseGuards(TokenGuard)
@UsePipes(new TokenPipe(new JwtService()))
@WebSocketGateway({ cors: true , transports: ['websocket'] })

export class FriendGate {
	constructor(private readonly webSocketService: WebSocketService) { }

	@WebSocketServer()
	io: Server;


	@SubscribeMessage("friendAction")
	handleFriendAction(socket: Socket, data: BodyData) {
		// emit to self
		socket.emit("friendAction")
		//emit to sender
		socket.to(data.data.senderID).emit("friendAction")
		//emit to receiver
		socket.to(data.data.receiverID).emit("friendAction")




	}

	@SubscribeMessage("friendReqAction")
	handleFriendReqAction(socket: Socket, data: BodyData) {
		socket.emit("friendReqAction")
		socket.to(data.data.senderID).emit("friendReqAction")
		socket.to(data.data.receiverID).emit("friendReqAction")


	}





}

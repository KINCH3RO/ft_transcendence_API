import {

	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { WebSocketService } from './web-socket.service';
import { Socket, Server } from 'socket.io';
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
@WebSocketGateway({ cors: true, transports: ['websocket'] })

export class MessageGate {
	constructor(private readonly webSocketService: WebSocketService) { }

	@WebSocketServer()
	io: Server;

	@SubscribeMessage("privateMessage")
	handlePrivateMessage(socket: Socket, data: BodyData) {
		// console.log(data);

		data.data.mine = (data.data.directmessage.senderID == data.sender.id);
		let receiver = data.data.directmessage.senderID == data.sender.id ? data.data.directmessage.receiverID : data.data.directmessage.senderID;
		// console.log(receiver);
		this.io.to([receiver, data.sender.id]).emit("privateMessage", data.data);
	}






}

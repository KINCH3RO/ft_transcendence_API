import {

	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { WebSocketService } from '../services/web-socket.service';
import { Socket, Server } from 'socket.io';
import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { TokenGuard } from '../token.guard';
import { JwtService } from '@nestjs/jwt';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { BodyData } from '../types/body-data.interface';
//handling present events

@UseFilters(new BaseWsExceptionFilter())
@UseGuards(TokenGuard)
@WebSocketGateway({ cors: true, transports: ['websocket'] })

export class MessageGate {
	constructor(private readonly webSocketService: WebSocketService) { }

	@WebSocketServer()
	io: Server;

	@SubscribeMessage("privateMessage")
	handlePrivateMessage(socket: Socket, data: BodyData) {
		// console.log(data);
		data.data.mine = (data.data.senderID == data.sender.id);

		this.io.to(data.sender.id).emit("privateMessage", data.data);
		let receiver = data.data.directmessage.senderID == data.sender.id ? data.data.directmessage.receiverID : data.data.directmessage.senderID;
		data.data.mine = (data.data.senderID == receiver);
		// console.log(receiver);
		this.io.to(receiver).emit("privateMessage", data.data);


	}

	@SubscribeMessage("channelMessage")
	handleChatMessage(socket: Socket, data: BodyData) {

		data.data.mine = (data.data.senderID == data.sender.id);

		this.io.to(data.sender.id).emit("channelMessage", data.data);
		data.data.mine = false
		// console.log(receiver);
		socket.to(data.data.channelID).emit("channelMessage", data.data);


	}








}

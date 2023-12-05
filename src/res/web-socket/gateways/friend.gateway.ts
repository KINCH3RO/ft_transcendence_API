import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WebSocketService } from '../services/web-socket.service';
import { Socket, Server } from 'socket.io';
import { UseFilters, UseGuards } from '@nestjs/common';
import { TokenGuard } from '../token.guard';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { BodyData } from '../types/body-data.interface';
//handling present events

@UseFilters(new BaseWsExceptionFilter())
@UseGuards(TokenGuard)
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


 //

 @SubscribeMessage("unfriend")
 handleUnfriendAction(socket: Socket, data: BodyData) {
	 this.io.to([data.data.senderID, data.data.receiverID]).emit("unfriend", data.data)
 }

 @SubscribeMessage("acceptFriend")
 handleFriendshipAction(socket: Socket, data: BodyData) {
	 this.io.to([data.data.senderID, data.data.receiverID]).emit("acceptFriend", data.data)
 }

 @SubscribeMessage("cancelFriendReq")
 handleCancelFriendReqAction(socket: Socket, data: BodyData) {
	 this.io.to(data.data.senderID).emit("cancelFriendReq", data.data)
 }


}

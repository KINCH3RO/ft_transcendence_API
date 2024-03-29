import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  BaseWsExceptionFilter,
} from '@nestjs/websockets';
import { WebSocketService } from '../services/web-socket.service';
import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { TokenGuard } from '../token.guard';
import { JwtService } from '@nestjs/jwt';
import { BodyData } from '../types/body-data.interface';

@UseFilters(new BaseWsExceptionFilter())
@UseGuards(TokenGuard)
@WebSocketGateway({ cors: true, transports: ['websocket'] })
export class ChatGate {
  @WebSocketServer()
  server: Server;
  //handling chat events
  constructor(private readonly webSocketService: WebSocketService) {}

  @SubscribeMessage('channelCreated')
  handleCreatedRoom(socket: Socket, data: BodyData) {
    socket.join(data.data);
  }

  @SubscribeMessage('channelJoined')
  handleJoinRoom(socket: Socket, data: BodyData) {
    socket.join(data.data.channelID);
    data.data.user.onlineStatus = this.webSocketService.isOnline(
      data.data.user.id,
    );
    if (data.data.user.onlineStatus)
      data.data.user.state = this.webSocketService.getUserState(
        data.data.user.id,
      );
    this.server.to(data.data.channelID).emit('newMemberJoind', data.data);
  }

  @SubscribeMessage('channelLeft')
  handleLeftRoom(socket: Socket, data: BodyData) {
    socket.leave(data.data.channelID);
    this.server.to(data.data.channelID).emit('aMemberLeft', data);
  }

  @SubscribeMessage('updateChannelInfo')
  handleRoomUpdated(socket: Socket, data: BodyData) {
    this.server.to(data.data.id).emit('channelUpdated', data.data);
  }

  @SubscribeMessage('deleteChannel')
  handleRoomRemoved(socket: Socket, data: BodyData) {
    this.server.to(data.data.id).emit('roomRemoved', data.data);
  }

  @SubscribeMessage('getUnbanned')
  handleUnbannedUserFromRoom(socket: Socket, data: BodyData) {
    data.data.user.onlineStatus = this.webSocketService.isOnline(
      data.data.user.id,
    );
    if (data.data.user.onlineStatus)
      data.data.user.state = this.webSocketService.getUserState(
        data.data.user.id,
      );

    this.server.to(data.data.channelID).emit('aMemberUnbanned', data.data);
    this.server.to(data.data.userID).emit('YouGotUnbanned', data.data);
  }

  @SubscribeMessage('getBanned')
  handleBannedUserFromRoom(socket: Socket, data: BodyData) {
    this.server.to(data.data.channelID).emit('aMemberBanned', data.data);
    this.server.to(data.data.userID).emit('YouGotBanned', data.data);
  }

  @SubscribeMessage('getKicked')
  handleKickedUserFromRoom(socket: Socket, data: BodyData) {
    this.server.to(data.data.channelID).emit('aMemberKicked', data.data);
    this.server.to(data.data.userID).emit('YouGotKicked', data.data);
  }

  @SubscribeMessage('getMuted')
  handleMutedUserFromRoom(socket: Socket, data: BodyData) {
    this.server.to(data.data.channelID).emit('aMemberMuted', data.data);
    this.server.to(data.data.userID).emit('YouGotMuted', data.data);
  }

  @SubscribeMessage('roleAction')
  handleRoleAtRoom(socket: Socket, data: BodyData) {
    this.server
      .to(data.data.channelID)
      .emit('SomeOneRoleHasChanged', data.data);
  }

  @SubscribeMessage('DM_blockUser')
  handleBlockedUserFromDM(socket: Socket, data: BodyData) {
    this.server.to(data.data.friend.id).emit('youGotBlocked_DM', data.data);
  }

  @SubscribeMessage('DM_unblockUser')
  handleUnblockedUserFromDM(socket: Socket, data: BodyData) {
    this.server.to(data.data.friend.id).emit('youGotUnblocked_DM', data.data);
  }
}

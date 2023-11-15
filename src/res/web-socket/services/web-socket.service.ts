import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UUID } from 'crypto';
import userPresence from '../types/user-presence.interface';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';
import { ChannelUserService } from 'src/res/chat/res/channel/channel-user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WebSocketService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  onlineUsers: { [userId: string]: userPresence } = {};

  userConnected(userID: string, socketID: string, callback: () => void = null) {
    console.log('connect');
    if (!this.onlineUsers[userID]) {
      callback && callback();
      this.onlineUsers[userID] = {
        sockets: [socketID],
        state: 'Online',
      };
    } else this.onlineUsers[userID].sockets.push(socketID);
    console.log(this.onlineUsers);
  }

  userDisconnected(
    token: string,
    socketID: string,
    callback: (userID: string) => void = null,
  ) {
    console.log('disconnect');
    let userID = 'none';

    try {
      userID = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      }).sub;
    } catch (error) {
      throw error;
    }
    if (!this.onlineUsers[userID]) return;
    if (this.onlineUsers[userID].sockets.length > 1)
      this.onlineUsers[userID].sockets = this.onlineUsers[
        userID
      ].sockets.filter((id: string) => socketID != id);
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
    if (this.onlineUsers[userID]) return true;
    return false;
  }


	getUserState(userID: string): string {
		if (this.onlineUsers[userID])
			return this.onlineUsers[userID].state
	}

	setPresenceState(
		userID: string,
		state: 'Online' | 'AFK' | 'In-Game' | 'In-Queue' | 'In-Lobby',
	) {
		if (this.onlineUsers[userID]) this.onlineUsers[userID].state = state;
	}

  getUserFromToken(
    token: string,
    success: (userData: ActiveUserData) => void,
    err: (err: any) => void,
  ) {
    try {
      let data = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      success(data);
    } catch (error) {
      err(error);
    }
  }

  async getUserChannels(userID: string) {
    let rooms = await this.prismaService.channelUser.findMany({
      select: {
        channelID: true,
      },
      where: {
        userID,
        NOT: { status: 'BANNED' },
      },
    });

    return rooms.map((data) => data.channelID);
  }
}

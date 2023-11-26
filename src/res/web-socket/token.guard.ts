import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const socket = context.switchToWs().getClient() as Socket;
    const token = socket.handshake.query.userId;
    let data = context.switchToWs().getData();

    if (!data || typeof data != 'object') return false;
    if (!socket.handshake.query.userId) {
      socket.disconnect();
      return false;
    }

    try {
      data['sender'] = this.jwtService.verify(token as string, {
        secret: process.env.JWT_SECRET,
      });
      data['sender']['id'] = data['sender'].sub;
      delete data['sender'].sub;
      delete data['sender'].iat;
    } catch (error) {
      socket.disconnect();
      return false;
    }
    return true;
  }
}

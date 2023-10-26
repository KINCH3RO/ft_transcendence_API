import { Module } from '@nestjs/common';
import { DirectMessageService } from './direct-message.service';
import { DirectMessageController } from './direct-message.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WebSocketModule } from 'src/res/web-socket/web-socket.module';

@Module({
  imports: [PrismaModule, WebSocketModule],
  controllers: [DirectMessageController],
  providers: [DirectMessageService],
})
export class DirectMessageModule {}

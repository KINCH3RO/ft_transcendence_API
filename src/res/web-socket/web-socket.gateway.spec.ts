import { Test, TestingModule } from '@nestjs/testing';
import { WebSocketGateway } from './web-socket.gateway';
import { WebSocketService } from './web-socket.service';

describe('WebSocketGateway', () => {
  let gateway: WebSocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebSocketGateway, WebSocketService],
    }).compile();

    gateway = module.get<WebSocketGateway>(WebSocketGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});

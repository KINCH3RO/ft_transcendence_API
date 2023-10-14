import { Test, TestingModule } from '@nestjs/testing';
import { DirectMessageController } from './direct-message.controller';
import { DirectMessageService } from './direct-message.service';

describe('DirectMessageController', () => {
  let controller: DirectMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DirectMessageController],
      providers: [DirectMessageService],
    }).compile();

    controller = module.get<DirectMessageController>(DirectMessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

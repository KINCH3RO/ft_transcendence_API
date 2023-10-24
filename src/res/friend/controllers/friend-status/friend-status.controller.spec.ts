import { Test, TestingModule } from '@nestjs/testing';
import { FriendStatusController } from './friend-status.controller';

describe('FriendStatusController', () => {
  let controller: FriendStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendStatusController],
    }).compile();

    controller = module.get<FriendStatusController>(FriendStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

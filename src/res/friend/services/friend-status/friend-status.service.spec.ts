import { Test, TestingModule } from '@nestjs/testing';
import { FriendStatusService } from './friend-status.service';

describe('FriendStatusService', () => {
  let service: FriendStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FriendStatusService],
    }).compile();

    service = module.get<FriendStatusService>(FriendStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

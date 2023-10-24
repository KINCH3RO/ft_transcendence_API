import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateChannelUserDto {
  @IsUUID()
  @IsNotEmpty()
  userID: string;

  @IsUUID()
  @IsNotEmpty()
  channelID: string;
}

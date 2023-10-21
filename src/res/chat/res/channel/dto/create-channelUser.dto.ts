import { IsNotEmpty } from 'class-validator';

export class CreateChannelUserDto {
  @IsNotEmpty()
  userID: string;

  @IsNotEmpty()
  channelID: string;
}

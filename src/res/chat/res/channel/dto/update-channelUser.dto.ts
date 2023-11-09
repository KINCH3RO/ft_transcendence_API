import { CreateChannelUserDto } from "./create-channelUser.dto";
import { PartialType } from '@nestjs/mapped-types';
import { $Enums } from "@prisma/client";
import { IsNotEmpty, IsNumber, IsOptional, isDateString, isIn } from "class-validator";

export class UpdateChannelUserDto extends PartialType(CreateChannelUserDto) {
	@IsNotEmpty()
  @IsOptional()
  role: $Enums.channelRole;

  @IsNotEmpty()
  @IsOptional()
  status: $Enums.channelStatus;

  @IsNumber()
  @IsOptional()
  duration: bigint;
}

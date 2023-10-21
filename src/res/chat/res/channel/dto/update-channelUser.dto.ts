import { PartialType } from "@nestjs/mapped-types";
import { CreateChannelUserDto } from "./create-channelUser.dto";
import { $Enums } from "@prisma/client";
import { IsNotEmpty } from "class-validator";

export class UpdateChannelUserDto extends CreateChannelUserDto {
	@IsNotEmpty()
  role: $Enums.channelRole;

  @IsNotEmpty()
  status: $Enums.channelStatus;
}

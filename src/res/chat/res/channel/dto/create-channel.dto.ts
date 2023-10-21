import { $Enums } from "@prisma/client";
import { IsNotEmpty, IsUrl, MinLength } from "class-validator";

export class CreateChannelDto {
	@IsUrl()
	@IsNotEmpty()
	imageUrl: string;

	@IsNotEmpty()
	name: string;

	@MinLength(8)
	@IsNotEmpty()
	password: string;

	@IsNotEmpty()
	visibility: $Enums.channelVisibility;
}

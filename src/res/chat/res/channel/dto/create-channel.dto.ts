import { $Enums } from "@prisma/client";
import { IsNotEmpty } from "class-validator";

export class CreateChannelDto {
	@IsNotEmpty()
	imageUrl: string;

	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	password: string;

	@IsNotEmpty()
	visibility: $Enums.channelVisibility;
}

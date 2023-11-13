import { $Enums } from '@prisma/client';
import { MinLength, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class UpdatePasswordDto {
	@IsUUID()
	@IsOptional()
	id: string;

	@IsOptional()
	oldPass: string;

  @MinLength(8)
	@IsOptional()
  newPassword: string;

	@IsOptional()
	visibility: $Enums.channelVisibility
}

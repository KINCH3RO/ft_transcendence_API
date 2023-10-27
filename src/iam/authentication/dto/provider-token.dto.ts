import { IsNotEmpty } from 'class-validator';

export class ProviderTokenDto {
  @IsNotEmpty()
  providerInfoToken: string;
}

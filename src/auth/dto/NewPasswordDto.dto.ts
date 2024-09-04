import { IsMongoId, IsNotEmpty } from 'class-validator';

export class NewPasswordDto {
  @IsNotEmpty()
  @IsMongoId()
  id: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  codeId: string;
}

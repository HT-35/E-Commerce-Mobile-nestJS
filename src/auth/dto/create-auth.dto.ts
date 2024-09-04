import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

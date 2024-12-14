import { Roles_Type } from "@/public/DecoratorCustom";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
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

  @IsString()
  @IsNotEmpty()
  address?: string;

  @IsString()
  @IsNotEmpty()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  design?: string;

  //role?: Roles_Type;
}

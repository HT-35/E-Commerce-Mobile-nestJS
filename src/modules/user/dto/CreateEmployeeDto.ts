import { Roles_Type } from "@/public/DecoratorCustom";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  numberPhone: string;

  @IsNotEmpty()
  @IsString()
  role: Roles_Type.ADMIN | Roles_Type.EMPLOYEE;
}

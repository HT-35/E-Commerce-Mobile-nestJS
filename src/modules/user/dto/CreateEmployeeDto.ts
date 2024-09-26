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

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  roles: Roles_Type.ADMIN | Roles_Type.EMPLOYEE;
}

import { IsNotEmpty, IsString } from "class-validator";

export class CreateLiveStreamDto {
  @IsNotEmpty()
  @IsString()
  employeeId: string;
  @IsNotEmpty()
  @IsString()
  nameEmployee: string;
  @IsNotEmpty()
  @IsString()
  title: string;
}

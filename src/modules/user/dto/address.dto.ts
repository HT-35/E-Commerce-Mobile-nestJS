import { IsNotEmpty, IsString } from "class-validator";

export class addressDto {
  @IsNotEmpty()
  @IsString()
  province_id: string;

  @IsNotEmpty()
  @IsString()
  district_id: string;

  @IsNotEmpty()
  @IsString()
  ward_code: string;

  @IsNotEmpty()
  address_detail: string;
}

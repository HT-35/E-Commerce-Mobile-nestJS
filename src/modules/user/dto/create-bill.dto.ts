import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";

class itemArr {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class CreateBillDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => itemArr)
  item: itemArr[];

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  numberPhone: string;

  @IsString()
  @IsNotEmpty()
  addressShiping: string;
}

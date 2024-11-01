import { Type } from "class-transformer";
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";
import mongoose from "mongoose";

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

  @IsNumber()
  @IsNotEmpty()
  price: number;
}

export class CreateBillDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => itemArr)
  item: itemArr[];

  @IsNumber()
  @IsNotEmpty()
  total: number;

  @IsMongoId()
  @IsNotEmpty()
  addressShiping: mongoose.Types.ObjectId;
}

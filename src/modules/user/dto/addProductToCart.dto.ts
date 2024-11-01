import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ProductToCartDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  color: string;
}

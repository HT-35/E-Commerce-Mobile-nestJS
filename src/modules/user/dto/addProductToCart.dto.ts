import { IsNotEmpty, IsString } from "class-validator";

export class ProductToCartDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  quatity: number;
}

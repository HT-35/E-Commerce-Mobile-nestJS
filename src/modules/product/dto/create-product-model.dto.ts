import { IsString, IsNumber, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class OptionDTO {
  @IsString()
  color: string;

  @IsString()
  price: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDTO)
  img: ImageDTO[];
}

class ImageDTO {
  @IsString()
  link: string;

  @IsString()
  cloudinary_id: string;
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  brand: string;

  @IsString()
  chip: string;

  @IsString()
  sim: string;

  @IsString()
  design: string;

  @IsNumber()
  amount: number;

  @IsString()
  os: string;

  @IsString()
  ram: string;

  @IsString()
  battery: string;

  @IsString()
  rom: string;

  @IsString()
  cameraBefore: string;

  @IsString()
  cameraAfter: string;

  @IsString()
  special: string;

  @IsString()
  screen: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionDTO)
  option: OptionDTO[];
}

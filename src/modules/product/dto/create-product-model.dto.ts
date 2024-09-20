import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsMongoId,
  ValidateNested,
  IsOptional,
} from "class-validator";
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

class ReviewProductDTO {
  @IsString()
  name: string;

  @IsString()
  comment: string;

  @IsNumber()
  star: number;
}

class ReplieCommentProductDTO {
  @IsString()
  content: string;

  @IsBoolean()
  isAdmin: boolean;

  @IsString()
  nameUser: string;

  @IsMongoId()
  byUser: string;
}

class CommentProductDTO {
  @IsString()
  author: string;

  @IsString()
  status: string;

  @IsBoolean()
  isAdmin: boolean;

  @IsString()
  avatar: string;

  @IsString()
  content: string;

  @IsMongoId()
  byUser: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReplieCommentProductDTO)
  replies: ReplieCommentProductDTO[];
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  brand: string;

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReviewProductDTO)
  reviews: ReviewProductDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommentProductDTO)
  comments: CommentProductDTO[];

  @IsOptional() // Đây là trường duy nhất không bắt buộc
  @IsString()
  blog?: string;

  @IsString()
  slug: string;
}

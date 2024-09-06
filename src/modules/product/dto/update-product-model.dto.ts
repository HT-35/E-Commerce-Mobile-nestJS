import { CreateProductDto } from "@/modules/product/dto/create-product-model.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateProductModelDto extends PartialType(CreateProductDto) {}

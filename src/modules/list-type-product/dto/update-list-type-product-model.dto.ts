import { CreateListTypeProductModelDto } from '@/modules/list-type-product/dto/create-list-type-product-model.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateListTypeProductModelDto extends PartialType(
  CreateListTypeProductModelDto,
) {}

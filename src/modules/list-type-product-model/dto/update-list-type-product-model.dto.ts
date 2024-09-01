import { PartialType } from '@nestjs/mapped-types';
import { CreateListTypeProductModelDto } from './create-list-type-product-model.dto';

export class UpdateListTypeProductModelDto extends PartialType(CreateListTypeProductModelDto) {}

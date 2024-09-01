import { PartialType } from '@nestjs/mapped-types';
import { CreateSelectListModelDto } from './create-select-list-model.dto';

export class UpdateSelectListModelDto extends PartialType(CreateSelectListModelDto) {}

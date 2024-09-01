import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderModelDto } from './create-order-model.dto';

export class UpdateOrderModelDto extends PartialType(CreateOrderModelDto) {}

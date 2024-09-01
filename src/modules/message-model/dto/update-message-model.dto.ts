import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageModelDto } from './create-message-model.dto';

export class UpdateMessageModelDto extends PartialType(CreateMessageModelDto) {}

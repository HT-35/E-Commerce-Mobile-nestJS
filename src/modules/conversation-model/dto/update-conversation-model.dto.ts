import { PartialType } from '@nestjs/mapped-types';
import { CreateConversationModelDto } from './create-conversation-model.dto';

export class UpdateConversationModelDto extends PartialType(CreateConversationModelDto) {}

import { Injectable } from '@nestjs/common';
import { CreateConversationModelDto } from './dto/create-conversation-model.dto';
import { UpdateConversationModelDto } from './dto/update-conversation-model.dto';

@Injectable()
export class ConversationModelService {
  create(createConversationModelDto: CreateConversationModelDto) {
    return 'This action adds a new conversationModel';
  }

  findAll() {
    return `This action returns all conversationModel`;
  }

  findOne(id: number) {
    return `This action returns a #${id} conversationModel`;
  }

  update(id: number, updateConversationModelDto: UpdateConversationModelDto) {
    return `This action updates a #${id} conversationModel`;
  }

  remove(id: number) {
    return `This action removes a #${id} conversationModel`;
  }
}

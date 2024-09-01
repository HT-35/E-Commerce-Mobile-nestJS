import { Injectable } from '@nestjs/common';
import { CreateMessageModelDto } from './dto/create-message-model.dto';
import { UpdateMessageModelDto } from './dto/update-message-model.dto';

@Injectable()
export class MessageModelService {
  create(createMessageModelDto: CreateMessageModelDto) {
    return 'This action adds a new messageModel';
  }

  findAll() {
    return `This action returns all messageModel`;
  }

  findOne(id: number) {
    return `This action returns a #${id} messageModel`;
  }

  update(id: number, updateMessageModelDto: UpdateMessageModelDto) {
    return `This action updates a #${id} messageModel`;
  }

  remove(id: number) {
    return `This action removes a #${id} messageModel`;
  }
}

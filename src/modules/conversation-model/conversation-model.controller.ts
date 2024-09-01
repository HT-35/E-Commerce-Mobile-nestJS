import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConversationModelService } from './conversation-model.service';
import { CreateConversationModelDto } from './dto/create-conversation-model.dto';
import { UpdateConversationModelDto } from './dto/update-conversation-model.dto';

@Controller('conversation-model')
export class ConversationModelController {
  constructor(private readonly conversationModelService: ConversationModelService) {}

  @Post()
  create(@Body() createConversationModelDto: CreateConversationModelDto) {
    return this.conversationModelService.create(createConversationModelDto);
  }

  @Get()
  findAll() {
    return this.conversationModelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conversationModelService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConversationModelDto: UpdateConversationModelDto) {
    return this.conversationModelService.update(+id, updateConversationModelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conversationModelService.remove(+id);
  }
}

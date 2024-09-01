import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessageModelService } from './message-model.service';
import { CreateMessageModelDto } from './dto/create-message-model.dto';
import { UpdateMessageModelDto } from './dto/update-message-model.dto';

@Controller('message-model')
export class MessageModelController {
  constructor(private readonly messageModelService: MessageModelService) {}

  @Post()
  create(@Body() createMessageModelDto: CreateMessageModelDto) {
    return this.messageModelService.create(createMessageModelDto);
  }

  @Get()
  findAll() {
    return this.messageModelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageModelService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageModelDto: UpdateMessageModelDto) {
    return this.messageModelService.update(+id, updateMessageModelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageModelService.remove(+id);
  }
}

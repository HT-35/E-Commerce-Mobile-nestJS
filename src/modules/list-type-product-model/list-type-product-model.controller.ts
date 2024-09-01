import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ListTypeProductModelService } from './list-type-product-model.service';
import { CreateListTypeProductModelDto } from './dto/create-list-type-product-model.dto';
import { UpdateListTypeProductModelDto } from './dto/update-list-type-product-model.dto';

@Controller('list-type-product-model')
export class ListTypeProductModelController {
  constructor(private readonly listTypeProductModelService: ListTypeProductModelService) {}

  @Post()
  create(@Body() createListTypeProductModelDto: CreateListTypeProductModelDto) {
    return this.listTypeProductModelService.create(createListTypeProductModelDto);
  }

  @Get()
  findAll() {
    return this.listTypeProductModelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listTypeProductModelService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateListTypeProductModelDto: UpdateListTypeProductModelDto) {
    return this.listTypeProductModelService.update(+id, updateListTypeProductModelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listTypeProductModelService.remove(+id);
  }
}

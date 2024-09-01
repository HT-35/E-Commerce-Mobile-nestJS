import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SelectListModelService } from './select-list-model.service';
import { CreateSelectListModelDto } from './dto/create-select-list-model.dto';
import { UpdateSelectListModelDto } from './dto/update-select-list-model.dto';

@Controller('select-list-model')
export class SelectListModelController {
  constructor(private readonly selectListModelService: SelectListModelService) {}

  @Post()
  create(@Body() createSelectListModelDto: CreateSelectListModelDto) {
    return this.selectListModelService.create(createSelectListModelDto);
  }

  @Get()
  findAll() {
    return this.selectListModelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.selectListModelService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSelectListModelDto: UpdateSelectListModelDto) {
    return this.selectListModelService.update(+id, updateSelectListModelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.selectListModelService.remove(+id);
  }
}

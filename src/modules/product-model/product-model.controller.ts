import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductModelService } from './product-model.service';
import { CreateProductModelDto } from './dto/create-product-model.dto';
import { UpdateProductModelDto } from './dto/update-product-model.dto';

@Controller('product-model')
export class ProductModelController {
  constructor(private readonly productModelService: ProductModelService) {}

  @Post()
  create(@Body() createProductModelDto: CreateProductModelDto) {
    return this.productModelService.create(createProductModelDto);
  }

  @Get()
  findAll() {
    return this.productModelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productModelService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductModelDto: UpdateProductModelDto) {
    return this.productModelService.update(+id, updateProductModelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productModelService.remove(+id);
  }
}

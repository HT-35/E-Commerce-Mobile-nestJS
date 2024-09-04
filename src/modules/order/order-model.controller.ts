import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderModelService } from './order-model.service';
import { CreateOrderModelDto } from './dto/create-order-model.dto';
import { UpdateOrderModelDto } from './dto/update-order-model.dto';

@Controller('order-model')
export class OrderModelController {
  constructor(private readonly orderModelService: OrderModelService) {}

  @Post()
  create(@Body() createOrderModelDto: CreateOrderModelDto) {
    return this.orderModelService.create(createOrderModelDto);
  }

  @Get()
  findAll() {
    return this.orderModelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderModelService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderModelDto: UpdateOrderModelDto) {
    return this.orderModelService.update(+id, updateOrderModelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderModelService.remove(+id);
  }
}

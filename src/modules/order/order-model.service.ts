import { Injectable } from '@nestjs/common';
import { CreateOrderModelDto } from './dto/create-order-model.dto';
import { UpdateOrderModelDto } from './dto/update-order-model.dto';

@Injectable()
export class OrderModelService {
  create(createOrderModelDto: CreateOrderModelDto) {
    return 'This action adds a new orderModel';
  }

  findAll() {
    return `This action returns all orderModel`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderModel`;
  }

  update(id: number, updateOrderModelDto: UpdateOrderModelDto) {
    return `This action updates a #${id} orderModel`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderModel`;
  }
}

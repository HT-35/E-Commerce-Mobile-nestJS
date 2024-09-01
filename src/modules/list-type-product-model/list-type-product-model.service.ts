import { Injectable } from '@nestjs/common';
import { CreateListTypeProductModelDto } from './dto/create-list-type-product-model.dto';
import { UpdateListTypeProductModelDto } from './dto/update-list-type-product-model.dto';

@Injectable()
export class ListTypeProductModelService {
  create(createListTypeProductModelDto: CreateListTypeProductModelDto) {
    return 'This action adds a new listTypeProductModel';
  }

  findAll() {
    return `This action returns all listTypeProductModel`;
  }

  findOne(id: number) {
    return `This action returns a #${id} listTypeProductModel`;
  }

  update(id: number, updateListTypeProductModelDto: UpdateListTypeProductModelDto) {
    return `This action updates a #${id} listTypeProductModel`;
  }

  remove(id: number) {
    return `This action removes a #${id} listTypeProductModel`;
  }
}

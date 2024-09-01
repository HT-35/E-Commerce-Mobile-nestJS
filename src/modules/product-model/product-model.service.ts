import { Injectable } from '@nestjs/common';
import { CreateProductModelDto } from './dto/create-product-model.dto';
import { UpdateProductModelDto } from './dto/update-product-model.dto';

@Injectable()
export class ProductModelService {
  create(createProductModelDto: CreateProductModelDto) {
    return 'This action adds a new productModel';
  }

  findAll() {
    return `This action returns all productModel`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productModel`;
  }

  update(id: number, updateProductModelDto: UpdateProductModelDto) {
    return `This action updates a #${id} productModel`;
  }

  remove(id: number) {
    return `This action removes a #${id} productModel`;
  }
}

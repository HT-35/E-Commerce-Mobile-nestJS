import { Injectable } from '@nestjs/common';
import { CreateSelectListModelDto } from './dto/create-select-list-model.dto';
import { UpdateSelectListModelDto } from './dto/update-select-list-model.dto';

@Injectable()
export class SelectListModelService {
  create(createSelectListModelDto: CreateSelectListModelDto) {
    return 'This action adds a new selectListModel';
  }

  findAll() {
    return `This action returns all selectListModel`;
  }

  findOne(id: number) {
    return `This action returns a #${id} selectListModel`;
  }

  update(id: number, updateSelectListModelDto: UpdateSelectListModelDto) {
    return `This action updates a #${id} selectListModel`;
  }

  remove(id: number) {
    return `This action removes a #${id} selectListModel`;
  }
}

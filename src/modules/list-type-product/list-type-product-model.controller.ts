import { CreateListTypeProductModelDto } from "@/modules/list-type-product/dto/create-list-type-product-model.dto";
import { UpdateListTypeProductModelDto } from "@/modules/list-type-product/dto/update-list-type-product-model.dto";
import { ListTypeProductModelService } from "@/modules/list-type-product/list-type-product-model.service";
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";

@Controller("list-type-product")
export class ListTypeProductModelController {
  constructor(
    private readonly listTypeProductModelService: ListTypeProductModelService,
  ) {}

  @Post()
  create(@Body() createListTypeProductModelDto: CreateListTypeProductModelDto) {
    return this.listTypeProductModelService.create(
      createListTypeProductModelDto,
    );
  }

  @Get()
  findAll() {
    return this.listTypeProductModelService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.listTypeProductModelService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateListTypeProductModelDto: UpdateListTypeProductModelDto,
  ) {
    return this.listTypeProductModelService.update(
      +id,
      updateListTypeProductModelDto,
    );
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.listTypeProductModelService.remove(+id);
  }
}

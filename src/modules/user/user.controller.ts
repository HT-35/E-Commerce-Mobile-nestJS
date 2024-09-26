import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  BadRequestException,
  Patch,
  Req,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ResponseMessage } from "@/public/DecoratorCustom";
import mongoose from "mongoose";
import { CreateEmployeeDto } from "@/modules/user/dto/CreateEmployeeDto";
import { ProductToCartDto } from "@/modules/user/dto/addProductToCart.dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  //Register Employee
  @Post()
  @ResponseMessage("Register Employee !")
  registerEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.userService.registerEmployee(createEmployeeDto);
  }

  @Get()
  @ResponseMessage("Find All User")
  findAll(
    @Query() query: string,
    @Query("current") current: number,
    @Query("pageSize") pageSize: number,
  ) {
    console.log("user");

    return this.userService.findAll(query, +current, +pageSize);
  }

  @Get("search")
  @ResponseMessage("Search User Query Name")
  searchUserByName(@Query("name") name: string) {
    if (!name) {
      throw new BadRequestException("Missing Query Name");
    }

    return this.userService.searchUserByName(name);
    //return name;
  }

  @Patch("update/:id")
  @ResponseMessage("Update User")
  update(
    @Param("id") id: mongoose.Types.ObjectId,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Id phải là mongoDb");
    }

    if (Object.keys(updateUserDto).length === 0) {
      throw new BadRequestException("Phải gửi ít nhất 1 trường để update ");
    }

    return this.userService.update(id, updateUserDto);
  }

  @Delete("delete/:id")
  remove(@Param("id") id: string) {
    return this.userService.remove(id);
  }

  // ========== CART =============================

  @Get("/cart")
  @ResponseMessage("Add Product to Cart")
  getAllProductInCart(@Req() req: any) {
    const { _id } = req.user;

    return this.userService.getAllProductInCart(_id);
  }

  @Post("/cart")
  @ResponseMessage("Add Product to Cart")
  addProductToCart(@Body() data: ProductToCartDto, @Req() req: any) {
    const { _id } = req.user;

    return this.userService.addProductInCart(data, _id);
  }

  @Post("/cart/reduce")
  reduceProductQuanlityInCart(@Body() data: ProductToCartDto, @Req() req: any) {
    const { _id } = req.user;
    return this.userService.reduceProductQuanlityInCart(data, _id);
  }

  @Delete("/cart/delete/:slug")
  deleteProductQuanlityInCart(@Param("slug") slug: string, @Req() req: any) {
    const { _id } = req.user;

    return this.userService.deleteProductQuanlityInCart(slug, _id);
  }

  // ===============================  find user by id  ==================================
  @Get(":id")
  @ResponseMessage("Find User by Id")
  findOne(@Param("id") id: mongoose.Types.ObjectId) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Id phải là mongoDb");
    }

    return this.userService.findOne(id);
  }
}

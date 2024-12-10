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
import { addressDto } from "@/modules/user/dto/address.dto";
import { updateAddressDto } from "@/modules/user/dto/updateAddress.dto";
import { CreateBillDto } from "@/modules/user/dto/create-bill.dto";

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
  @ResponseMessage("Get Product to Cart")
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
  @ResponseMessage("reduce Product to Cart")
  reduceProductQuanlityInCart(@Body() data: ProductToCartDto, @Req() req: any) {
    const { _id } = req.user;
    return this.userService.reduceProductQuanlityInCart(data, _id);
  }

  @Delete("/cart/delete/:slug")
  @ResponseMessage("Delete Product to Cart")
  deleteProductQuanlityInCart(
    @Param("slug") slug: string,
    @Query("color") color: string,
    @Req() req: any,
  ) {
    const { _id } = req.user;

    return this.userService.deleteProductInCart({ slug, color, _id });
  }

  // ===============address ================

  @Post("/address")
  @ResponseMessage("Create Address Shipping")
  addAddress(@Body() address: addressDto, @Req() req: any) {
    const _id = req.user._id;

    return this.userService.addAddress({ address, _id });
  }

  @Get("/address")
  @ResponseMessage("Get Address Shipping")
  getAddressDetail(@Req() req: any) {
    const { _id } = req.user;
    return this.userService.findAddress({ _id });
  }

  @Patch("/address/:id")
  @ResponseMessage("Update  Address Shipping")
  updateAddress(
    @Body() address: updateAddressDto,
    @Req() req: any,
    @Param("id") id: string,
  ) {
    const addressId = id;
    const _id = req.user._id;
    return this.userService.updateAddress({ address, _id, addressId });
  }

  @Delete("/address/:id")
  @ResponseMessage("Delete  Address Shipping")
  deleteAddress(@Req() req: any, @Param("id") id: string) {
    const addressId = id;
    const _id = req.user._id;
    return this.userService.deleteAddress({ _id, addressId });
  }

  // ================================    Bill     ===============================
  @Post("/bill/cod")
  @ResponseMessage("Create Bill  COD")
  createBill(@Body() createBillDto: CreateBillDto, @Req() req: any) {
    const { _id } = req.user;
    return this.userService.createBillCOD({ _id, createBillDto });
  }

  @Patch("/bill/vnpay/:id")
  @ResponseMessage("Create Bill  Payment VNPay")
  updateBill(@Req() req: any, @Param("id") idBill: string) {
    const { _id } = req.user;
    console.log(`_id:`, _id);
    return this.userService.updateBill({ _id, idBill });
  }

  @Get("/bill")
  @ResponseMessage("Get All Bill")
  getAllBill(@Query("limit") limit: number, @Query("page") page: number) {
    return this.userService.getAllBill({ limit, page });
  }

  @Get("/bill/:idOrder")
  @ResponseMessage("Get Detail Bill")
  getDetailBill(@Param("idOrder") idOrder: string, @Req() req: any) {
    const { _id } = req.user;
    return this.userService.getDetalBill({ idOrder, _id });
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

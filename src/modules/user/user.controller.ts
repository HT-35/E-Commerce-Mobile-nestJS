import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage } from '@/public/DecoratorCustom';
import mongoose from 'mongoose';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //Register
  @Post()
  @ResponseMessage('Register User !')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.registerUser(createUserDto);
  }

  @Get()
  findAll(
    @Query() query: string,
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.userService.findAll(query, +current, +pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: mongoose.Types.ObjectId) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id phải là mongoDb');
    }

    return this.userService.findOne(id);
  }

  @Put('update/:id')
  update(
    @Param('id') id: mongoose.Types.ObjectId,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id phải là mongoDb');
    }

    if (Object.keys(updateUserDto).length === 0) {
      throw new BadRequestException('Phải gửi ít nhất 1 trường để update ');
    }

    return this.userService.update(id, updateUserDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}

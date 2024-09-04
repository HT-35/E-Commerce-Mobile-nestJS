import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// kế thừa toàn bộ feild ngoại trừ   "password"
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password'] as const),
) {}

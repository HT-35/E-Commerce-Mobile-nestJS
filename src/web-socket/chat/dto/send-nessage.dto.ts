import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class sendMessageDto {
  @IsNotEmpty()
  @IsMongoId()
  customerId: string;

  @IsNotEmpty()
  nameCustomer: string;

  //@IsNotEmpty()
  @IsMongoId()
  @IsOptional()
  receiverId?: string;

  @IsNotEmpty()
  messages: string;
}

export class employeeReplyMessageDto {
  @IsNotEmpty()
  @IsMongoId()
  customerId: string;

  //@IsNotEmpty()
  @IsMongoId()
  @IsNotEmpty()
  employeeId?: string;
  @IsNotEmpty()
  messages: string;
}

import { IsNotEmpty, IsString } from "class-validator";
import { ObjectId } from "mongoose";

enum typeSender {
  employe = "employee",
  customer = "customer",
}

export class sendMessageLiveStreamDto {
  @IsNotEmpty()
  senderId: ObjectId;

  @IsNotEmpty()
  sender: typeSender;

  @IsNotEmpty()
  @IsString()
  nameSender: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}

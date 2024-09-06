import { IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class ReplyCommentDTO {
  @IsNotEmpty()
  idComment: string;

  @IsNotEmpty()
  content: string;
  @IsNotEmpty()
  isAdmin: boolean;
  @IsNotEmpty()
  nameUser: string;
  @IsNotEmpty()
  byUser: mongoose.Schema.Types.ObjectId;
}

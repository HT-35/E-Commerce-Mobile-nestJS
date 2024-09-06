import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CommentDTO {
  @IsNotEmpty()
  author: string;

  @IsNotEmpty()
  isAdmin: boolean;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  byUser: mongoose.Schema.Types.ObjectId;

  status: string;
  avatar: string;
  replies: any;
}

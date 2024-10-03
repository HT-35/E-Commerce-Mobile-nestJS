import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

// Định nghĩa kiểu ChatRoomDocument
export type ChatRoomDocument = ChatRoom & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  senderId: MongooseSchema.Types.ObjectId;

  @Prop({ enum: ["customer", "employee"], required: true })
  sender: "customer" | "employee";

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User" })
  receiverId?: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  isSeen: boolean;

  //@Prop({ type: Date, default: Date.now })
  //createdAt: Date; // Thêm thời gian gửi tin nhắn
}

@Schema({ timestamps: true })
export class ChatRoom {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  customerId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, required: true })
  nameCustomer: string;

  @Prop({ required: true })
  lastMessage: string;

  @Prop({ type: Date, default: Date.now })
  lastMessageTime: Date;

  @Prop({ enum: ["customer", "employee"], required: true })
  lastMessageFrom: string;

  @Prop({ default: false })
  isWaitingForReply: boolean;

  // Embed các tin nhắn trực tiếp trong phòng chat
  @Prop({ type: [Message], default: [] }) // Lưu mảng các tin nhắn
  messages: Message[];
}

// Tạo schema từ class ChatRoom
export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);

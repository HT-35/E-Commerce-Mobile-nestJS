import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

// Định nghĩa kiểu ChatRoomDocument
export type LiveStreamDocument = LiveStream & Document;

@Schema({ timestamps: true })
export class MessageLiveStream {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  senderId: MongooseSchema.Types.ObjectId;

  @Prop({ enum: ["customer", "employee"], required: true })
  sender: "customer" | "employee";

  @Prop({ type: String, required: true })
  nameSender: string;

  @Prop({ required: true })
  content: string;
}

@Schema({ timestamps: true })
export class LiveStream {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  employeeId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, required: true })
  nameEmployee: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: Number, default: 0 })
  viewerNumber: number;

  @Prop({ type: Boolean, default: true })
  isLiveStream: boolean;

  // Embed các tin nhắn trực tiếp trong phòng chat
  @Prop({ type: [MessageLiveStream], default: [] }) // Lưu mảng các tin nhắn
  messages: MessageLiveStream[];
}

// Tạo schema từ class ChatRoom
export const LiveStreamSchema = SchemaFactory.createForClass(LiveStream);

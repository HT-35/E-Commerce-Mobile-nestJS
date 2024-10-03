import { Module } from "@nestjs/common";
import { ChatSocket } from "./web-socket.gateway";
import { MongooseModule } from "@nestjs/mongoose";
import {
  ChatRoom,
  ChatRoomSchema,
} from "@/web-socket/chat/entities/chatRoom.schema";
import { chatService } from "@/web-socket/chat/chatRoom.service";
import { ChatController } from "@/web-socket/chat/chatRoom.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatRoom.name, schema: ChatRoomSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatSocket, chatService],
})
export class WebSocketModule {}

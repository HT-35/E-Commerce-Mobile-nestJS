import { chatService } from "@/web-socket/chat/chatRoom.service";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { ConfigService } from "@nestjs/config";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway(5000, {
  cors: {
    origin: "*",
  },
})
export class ChatSocket
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private configService: ConfigService,
    private chatService: chatService,
  ) {}

  private activeUsers: Map<string, string> = new Map(); // Lưu userId và socketId của người dùng

  @WebSocketServer()
  server: Server;

  afterInit(server: Socket) {
    console.log("Khởi Tạo Server Thành Công");
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log("Client kết nôi " + client.id);

    this.server.to(client.id).emit("isConnect", "Connect Successfull");
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Xử lý nếu người dùng ngắt kết nối
    const userId = this.getUserBySocketId(client.id);
    if (userId) {
      this.activeUsers.delete(userId);
    }
  }

  // =================================================================================
  // Lấy userId từ socketId
  getUserBySocketId(socketId: string): string | undefined {
    for (const [userId, id] of this.activeUsers.entries()) {
      if (id === socketId) {
        return userId;
      }
    }
    return undefined;
  }

  // Người dùng gửi tin nhắn và tham gia phòng với userId
  @SubscribeMessage("sendMessage")
  handleUserMessage(
    client: Socket,
    {
      userId,
      message,
      name,
    }: { userId: string; name: string; message: string },
  ) {
    // Lưu userId và socketId khi người dùng kết nối
    this.activeUsers.set(userId, client.id);
    //console.log(`activeUsers:`, this.activeUsers);
    console.log("message client : ", message);

    //// Người dùng join vào phòng chat của chính họ
    //client.join(userId);

    this.server.emit("AdminReceiveMessageByUser", { userId, name, message });
  }

  // Nhân viên join vào phòng khi chọn khách hàng
  @SubscribeMessage("joinRoom")
  handleJoinRoom(client: Socket, userId: string) {
    client.join(userId);

    console.log(" ");
    console.log(`Nhân viên đã tham gia vào phòng của userId: ${userId}`);
    console.log(" ");
  }

  // Nhân viên gửi tin nhắn phản hồi tới khách hàng
  @SubscribeMessage("replyMessage")
  handleReplyMessage(
    client: Socket,
    { userId, message }: { userId: string; message: string },
  ) {
    console.log("");
    console.log("");
    console.log(` >>>  message  userId:`, userId);
    console.log(` >>>  message admin:`, message);
    console.log("");
    console.log("");
    // Phát tin nhắn tới người dùng trong phòng có mã userId
    this.server
      .to(userId)
      .emit("UserReceiveMessageByAdmin", { userId, message });
    //this.server.emit("UserReceiveMessageByAdmin", { userId, message });
  }
}

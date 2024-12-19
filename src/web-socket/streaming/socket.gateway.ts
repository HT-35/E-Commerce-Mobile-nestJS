/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway(5001, {
  cors: {
    origin: "*", // Cho phép tất cả các nguồn gốc
  },
  path: "/ws2",
})
export class StreamingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private activeUsers: string[] = []; // Lưu userId và socketId của người dùng

  handleConnection(client: Socket, ...args: any[]) {
    //this.server.to(client.id).emit("isConnect", "Connect Successfull");
    this.server
      .to(client.id)
      .emit("isConnect", "Connect StreamingGateway Successfull");
  }

  handleDisconnect(socket: Socket) {
    this.server.emit("streamer-disconnected", socket.id);
  }

  @SubscribeMessage("admin-Conect")
  handleAdminConnect(socket: Socket, viewerId: string) {
    //console.log("");
    //console.log("");
    //console.log("viewerId:  ", viewerId);
    //console.log("");
    //console.log("");
    //console.log("");
  }

  @SubscribeMessage("client-join-stream")
  handleClientJoinStream(socket: Socket, viewerId: any) {
    if (this.activeUsers.includes(viewerId.viewerId) === false) {
      this.activeUsers.push(viewerId.viewerId);
    }

    this.server.emit("Admin-reciever-client", viewerId);
    this.server.emit("count-connect-stream", this.activeUsers.length);
  }

  @SubscribeMessage("client-leave-stream")
  handleClientDelete(socket: Socket, viewerId: any) {
    const index = this.activeUsers.indexOf(viewerId.viewerId);

    if (index !== -1) {
      // Xóa viewerId khỏi danh sách activeUsers
      this.activeUsers.splice(index, 1);
      //console.log(`Đã xóa viewerId: ${viewerId.viewerId}`);
    } else {
      //console.log(
      //  `Không tìm thấy viewerId: ${viewerId.viewerId} trong danh sách activeUsers`,
      //);
    }

    // Bạn có thể phát sự kiện nếu cần thiết
    // this.server.emit("Admin-reciever-client", viewerId);
    this.server.emit("count-connect-stream", this.activeUsers.length);
  }

  @SubscribeMessage("employee-unload")
  handleEmployeeUnLoad(socket: Socket, data: any) {
    this.server.emit("end-livestream");
  }

  @SubscribeMessage("count-connect")
  handleCountConnect(socket: Socket) {
    this.server.emit("count-connect-stream", this.activeUsers.length);
  }

  @SubscribeMessage("client-chat")
  handleClientChat(
    socket: Socket,
    { message, name, role }: { message: any; name: string; role: string },
  ) {
    socket.broadcast.emit("chat-all", { message, name, role });
  }

  afterInit(server: Server) {
    console.log("Khởi tạo thành công websocket streaming");
  }
}

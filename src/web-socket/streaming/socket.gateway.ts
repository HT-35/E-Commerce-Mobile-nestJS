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
})
export class StreamingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private activeUsers: string[] = []; // Lưu userId và socketId của người dùng

  handleConnection(client: Socket, ...args: any[]) {
    console.log("Client StreamingGateway kết nôi  " + client.id);

    //this.server.to(client.id).emit("isConnect", "Connect Successfull");
    this.server
      .to(client.id)
      .emit("isConnect", "Connect StreamingGateway Successfull");
  }

  handleDisconnect(socket: Socket) {
    console.log(`Client disconnected: ${socket.id}`);
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
    console.log("");
    console.log("");
    console.log("client-join-stream:  ", viewerId);
    console.log("");
    console.log("");
    console.log("");

    if (this.activeUsers.includes(viewerId.viewerId) === false) {
      this.activeUsers.push(viewerId.viewerId);
    }

    console.log("");
    console.log("");
    console.log("");
    console.log("this.activeUsers", this.activeUsers);
    console.log("");
    console.log("");

    this.server.emit("Admin-reciever-client", viewerId);
    this.server.emit("count-connect-stream", this.activeUsers.length);
  }

  @SubscribeMessage("client-leave-stream")
  handleClientDelete(socket: Socket, viewerId: any) {
    //console.log("");
    //console.log("client-leave-stream:  ", viewerId);
    //console.log("");

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

    console.log("this.activeUsers:", this.activeUsers);
    console.log("");

    // Bạn có thể phát sự kiện nếu cần thiết
    // this.server.emit("Admin-reciever-client", viewerId);
    this.server.emit("count-connect-stream", this.activeUsers.length);
  }

  @SubscribeMessage("employee-unload")
  handleEmployeeUnLoad(socket: Socket, data: any) {
    console.log("");
    console.log("");
    console.log("");
    console.log("end-live", data);
    console.log("");
    console.log("");

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
    console.log("");
    console.log("");
    console.log(">> messageChat : ", message);
    console.log(">>> viewerId", name);
    console.log(">> role:", role);
    console.log("");

    socket.broadcast.emit("chat-all", { message, name, role });
  }

  afterInit(server: Server) {
    console.log("Khởi tạo thành công websocket streaming");
  }
}

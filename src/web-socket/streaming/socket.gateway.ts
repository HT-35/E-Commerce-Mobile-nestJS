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

  //@SubscribeMessage("join-as-streamer")
  //handleJoinAsStreamer(socket: Socket, streamerId: string) {
  //  console.log(`Streamer joined with ID: ${streamerId}`);
  //  socket.join("streamers");
  //  this.server.to("viewers").emit("streamer-joined", streamerId);
  //}

  //@SubscribeMessage("join-as-viewer")
  //handleJoinAsViewer(socket: Socket, viewerId: string) {
  //  console.log("");
  //  console.log("");
  //  console.log("");
  //  console.log(`Viewer joined with ID: ${viewerId}`);
  //  console.log("");
  //  console.log("");
  //  console.log("");
  //  socket.join("viewers");
  //  this.server.to("streamers").emit("viewer-connected", viewerId);
  //}

  //@SubscribeMessage("disconnect-as-streamer")
  //handleStreamerDisconnect(socket: Socket, streamerId: string) {
  //  console.log(`Streamer disconnected: ${streamerId}`);
  //  socket.leave("streamers");
  //  this.server.to("viewers").emit("streamer-disconnected", streamerId);
  //}

  //@SubscribeMessage("viewer-connected")
  //handleViewerConnected(socket: Socket, viewerId: string) {
  //  console.log(`Viewer connected: ${viewerId}`);
  //  this.server.to("streamers").emit("viewer-connected", viewerId);
  //}

  @SubscribeMessage("admin-Conect")
  handleAdminConnect(socket: Socket, viewerId: string) {
    console.log("");
    console.log("");
    console.log("viewerId:  ", viewerId);
    console.log("");
    console.log("");
    console.log("");
  }

  @SubscribeMessage("client-join-stream")
  handleClientJoinStream(socket: Socket, viewerId: string) {
    console.log("");
    console.log("");
    console.log("client-join-stream:  ", viewerId);
    console.log("");
    console.log("");
    console.log("");
    this.server.emit("Admin-reciever-client", viewerId);
  }

  afterInit(server: Server) {
    console.log("Khởi tạo thành công websocket streaming");
  }
}

//import {
//  SubscribeMessage,
//  WebSocketGateway,
//  WebSocketServer,
//} from "@nestjs/websockets";
//import { Server } from "socket.io";

//@WebSocketGateway(5001, {
//  cors: {
//    origin: "*", // Cho phép tất cả các nguồn gốc
//  },
//})
//export class StreamingGateway {
//  @WebSocketServer() server: Server;

//  @SubscribeMessage("callUser")
//  handleCallUser(client: any, payload: any): void {
//    // Lắng nghe và xử lý sự kiện gọi người dùng khác
//    const { targetUserId, signalData, from } = payload;
//    this.server
//      .to(targetUserId)
//      .emit("incomingCall", { signal: signalData, from });
//  }

//  @SubscribeMessage("answerCall")
//  handleAnswerCall(client: any, payload: any): void {
//    // Xử lý khi người dùng trả lời cuộc gọi
//    const { to, signal } = payload;
//    this.server.to(to).emit("callAnswered", signal);
//  }
//}

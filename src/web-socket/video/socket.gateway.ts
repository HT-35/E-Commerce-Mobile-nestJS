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

@WebSocketGateway(6000, {
  cors: {
    origin: true,
  },
})
export class StreamingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() serverStreaming: Server;

  // Khi một socket kết nối
  handleConnection(socket: Socket) {}

  // Khi một socket ngắt kết nối
  handleDisconnect(socket: Socket) {
    // Gửi sự kiện ngắt kết nối tới các viewers
    this.serverStreaming.emit("streamer-disconnected", socket.id);
  }

  // Xử lý sự kiện streamer tham gia
  @SubscribeMessage("join-as-streamer")
  handleJoinAsStreamer(socket: Socket, streamerId: string) {
    socket.join("streamers");
    this.serverStreaming.to("viewers").emit("streamer-joined", streamerId);
  }

  // Xử lý sự kiện viewer tham gia
  @SubscribeMessage("join-as-viewer")
  handleJoinAsViewer(socket: Socket, viewerId: string) {
    socket.join("viewers");
    this.serverStreaming.to("streamers").emit("viewer-connected", viewerId);
  }

  // Khi streamer ngắt kết nối
  @SubscribeMessage("disconnect-as-streamer")
  handleStreamerDisconnect(socket: Socket, streamerId: string) {
    socket.leave("streamers");
    this.serverStreaming
      .to("viewers")
      .emit("streamer-disconnected", streamerId);
  }

  // Gửi sự kiện khi có viewer kết nối
  @SubscribeMessage("viewer-connected")
  handleViewerConnected(socket: Socket, viewerId: string) {
    this.serverStreaming.to("streamers").emit("viewer-connected", viewerId);
  }

  afterInit(serverStreaming: Server) {
    console.log("WebSocket serverStreaming initialized");
  }
}

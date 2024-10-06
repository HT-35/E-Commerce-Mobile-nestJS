import { Module } from "@nestjs/common";
import { StreamingGateway } from "./socket.gateway";

@Module({
  providers: [StreamingGateway],
})
export class StreamingModule {}

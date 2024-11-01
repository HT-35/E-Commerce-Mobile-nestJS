import { Module } from "@nestjs/common";
import { StreamingGateway } from "./socket.gateway";
import { LiveStreamController } from "@/web-socket/streaming/liveStream.controller";
import { MongooseModule } from "@nestjs/mongoose";
import {
  LiveStream,
  LiveStreamSchema,
} from "@/web-socket/streaming/entities/messageLiveStream.schema";
import { LiveStreamService } from "@/web-socket/streaming/liveStream.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LiveStream.name, schema: LiveStreamSchema },
    ]),
  ],
  controllers: [LiveStreamController],
  providers: [StreamingGateway, LiveStreamService],
})
export class StreamingModule {}

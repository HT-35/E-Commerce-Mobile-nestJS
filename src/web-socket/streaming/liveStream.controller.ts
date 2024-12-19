/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsPublic, ResponseMessage } from "@/public/DecoratorCustom";
import { CreateLiveStreamDto } from "@/web-socket/streaming/dto/createLiveStream.dto";
import { sendMessageLiveStreamDto } from "@/web-socket/streaming/dto/sendMessageLiveStream.dto";
import { LiveStreamService } from "@/web-socket/streaming/liveStream.service";
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { retry } from "rxjs";

@Controller("livestream")
export class LiveStreamController {
  constructor(private readonly liveStreamService: LiveStreamService) {}

  @Get()
  @ResponseMessage("Get All Live")
  handleGetAllLive() {
    return this.liveStreamService.findAllLiveStream();
  }

  @Post("/end")
  //@IsPublic()
  @ResponseMessage("End Live Stream")
  handleEndLiveStream(@Body() data: any) {
    return this.liveStreamService.handleEndLiveStream();
  }

  @Get("/client-get-livestream")
  @ResponseMessage("client-get-livestream")
  handleClientGetLiveStream() {
    return this.liveStreamService.handleClientGetLiveStream();
  }

  @Get("/:id")
  @ResponseMessage("Get Detail LiveStream")
  handleGetDetailLiveStream(@Param("id") id: string) {
    return this.liveStreamService.findLiveStreamById(id);
  }

  @Post()
  @ResponseMessage("Create Live Stream")
  handleCreateLiveStream(@Body() data: CreateLiveStreamDto) {
    return this.liveStreamService.handleCreateLiveStream(data);
  }

  @Post("/message/:id")
  @ResponseMessage("Create Live Stream")
  handleSendMessageLiveStream(
    @Body() data: sendMessageLiveStreamDto,
    @Param("id") _id: string,
  ) {
    return this.liveStreamService.handleSendMessage({ _id, data });
  }

  // handle end livestream
}

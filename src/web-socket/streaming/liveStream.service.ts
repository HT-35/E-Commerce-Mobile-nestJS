import {} from "@/web-socket/chat/entities/chatRoom.schema";
import { CreateLiveStreamDto } from "@/web-socket/streaming/dto/createLiveStream.dto";
import { sendMessageLiveStreamDto } from "@/web-socket/streaming/dto/sendMessageLiveStream.dto";
import {
  LiveStream,
  LiveStreamDocument,
  MessageLiveStream,
} from "@/web-socket/streaming/entities/messageLiveStream.schema";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class LiveStreamService {
  constructor(
    @InjectModel(LiveStream.name)
    private chatLiveStream: Model<LiveStreamDocument>,
  ) {}

  async findAllLiveStream() {
    const liveStream = await this.chatLiveStream.find();

    return liveStream;
  }

  async findLiveStreamById(_id: string) {
    try {
      const liveStream = await this.chatLiveStream.findById(_id as any);
      if (!liveStream) {
        throw new BadRequestException("Not Found LiveStream !");
      }
      return liveStream;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async handleCreateLiveStream(data: CreateLiveStreamDto) {
    return await this.chatLiveStream.create(data);
  }

  async handleSendMessage({
    _id,
    data,
  }: {
    _id: string;
    data: sendMessageLiveStreamDto;
  }) {
    const LiveStream = await this.findLiveStreamById(_id);

    const newMessage: MessageLiveStream = data;

    if (data) {
      await LiveStream.messages.push(newMessage);
      await LiveStream.save();
      await this.chatLiveStream.syncIndexes();
    }

    return await this.findLiveStreamById(_id);
  }

  handleEndLiveStream = async () => {
    //const findLiveStreamIsLive = await this.chatLiveStream.findOne({
    //  isLiveStream: true,
    //});
    //if ((findLiveStreamIsLive.isLiveStream = true)) {
    //  findLiveStreamIsLive.isLiveStream = false;
    //}
    //return await findLiveStreamIsLive;
    const findLiveStreamIsLive = await this.chatLiveStream.find({
      isLiveStream: true,
    });
    if (findLiveStreamIsLive) {
      findLiveStreamIsLive.forEach((item) => {
        item.isLiveStream = false;
        item.save();
        this.chatLiveStream.syncIndexes();
      });
    }

    return "end live";
  };

  handleClientGetLiveStream = async () => {
    try {
      const liveStream = await this.chatLiveStream.find({
        isLiveStream: true,
      });

      return liveStream;
    } catch (error) {
      throw new BadRequestException(error);
    }
  };
}

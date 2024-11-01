import {
  ChatRoom,
  ChatRoomDocument,
} from "@/web-socket/chat/entities/chatRoom.schema";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class chatService {
  constructor(
    @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoomDocument>,
  ) {}

  // Nhân Viên Lấy Ra Toàn Bộ Tin nhắn chưa trả lời
  findAllChatRooms = async () => {
    const chatRoom = await this.chatRoomModel
      .find()
      .sort({ updatedAt: -1 }) // Sắp xếp theo updatedAt từ mới nhất đến cũ nhất
      .exec();

    return chatRoom;
  };

  // Nhân Viên Lấy Ra Toàn Bộ Tin nhắn chưa trả lời
  findChatRoomsByWaitingStatus = async () => {
    const chatRoom = await this.chatRoomModel
      .find({
        isWaitingForReply: true,
      })
      .sort({ createdAt: 1 })
      .exec();

    return chatRoom;
  };

  // Tìm Room Chat
  findChatRoomByCustomerId = async (customerId: string) => {
    const findChatRoom = await this.chatRoomModel.findOne({ customerId });

    return findChatRoom;
  };

  // người dùng gửi tin nhắn tới Nhân Viên
  async createMessage({
    customerId,
    nameCustomer,
    receiverId,
    messages,
  }: {
    customerId: string;
    nameCustomer: string;
    receiverId: string;
    messages: string;
  }) {
    console.log(customerId, receiverId, nameCustomer, messages);

    try {
      const findChatRoom = await this.findChatRoomByCustomerId(customerId);

      // người dùng đã từng nhắn tin trước đó và có lịch sử tin nhắn
      if (findChatRoom) {
        const messageItem = {
          senderId: customerId,
          sender: "customer",
          receiverId: receiverId,
          content: messages,
          isSeen: false,
        };

        findChatRoom.lastMessage = messages;
        findChatRoom.nameCustomer = findChatRoom.nameCustomer;
        findChatRoom.lastMessageTime = new Date();
        findChatRoom.lastMessageFrom = "customer";
        findChatRoom.isWaitingForReply = true;
        findChatRoom.messages.push(messageItem as any);
        await findChatRoom.save();

        await this.chatRoomModel.syncIndexes();

        return await this.findChatRoomByCustomerId(customerId);
      } else {
        // người dùng nhắn tin lần đầu tiên
        const messageItem = {
          senderId: customerId,
          receiverId: receiverId,
          sender: "customer",
          content: messages,
          isSeen: false,
        };
        const createChatRoom = await this.chatRoomModel.create({
          customerId,
          lastMessage: messages,
          nameCustomer: nameCustomer,
          lastMessageTime: new Date(),
          lastMessageFrom: "customer",
          isWaitingForReply: true, // chưa trả lời
          messages: messageItem,
        });

        return createChatRoom;
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  //// Trả về toàn bộ tin nhắn của người dùng
  //async getMessagesByCustomerId(customerId: string) {
  //  return this.chatRoomModel
  //    .find({ customerId })
  //    .sort({ createdAt: 1 })
  //    .exec();
  //}

  // nhân viên reply tin nhắn của nhân viên
  async updateRoomAfterReply({
    employeeId,
    customerId,
    messages,
  }: {
    employeeId: string;
    customerId: string;
    messages: string;
  }) {
    try {
      const chatRoom = await this.findChatRoomByCustomerId(customerId);

      if (!chatRoom) {
        throw new BadRequestException(
          `Not Found ChatRoom By CustomerID ${customerId}`,
        );
      }

      //
      const messageItem = {
        senderId: employeeId,
        receiverId: customerId,
        sender: "employee",
        content: messages,
        isSeen: false,
      };

      chatRoom.lastMessage = messages;
      chatRoom.lastMessageTime = new Date();
      chatRoom.lastMessageFrom = "employee";
      chatRoom.isWaitingForReply = false;
      chatRoom.messages.push(messageItem as any); // thêm tin nhắn
      await chatRoom.save();

      await this.chatRoomModel.syncIndexes();

      return await this.findChatRoomByCustomerId(customerId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

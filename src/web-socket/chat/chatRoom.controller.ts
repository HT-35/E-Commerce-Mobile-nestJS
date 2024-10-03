import { ResponseMessage } from "@/public/DecoratorCustom";
import { chatService } from "@/web-socket/chat/chatRoom.service";
import {
  employeeReplyMessageDto,
  sendMessageDto,
} from "@/web-socket/chat/dto/send-nessage.dto";
import { Controller, Post, Body, Get, Param } from "@nestjs/common";
import mongoose from "mongoose";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: chatService) {}

  // lấy tin nhắn đang chờ reply
  @Get("/all")
  @ResponseMessage("Get All ")
  async getChatRooms() {
    return this.chatService.findAllChatRooms();
  }

  // lấy tin nhắn đang chờ reply
  @Get("/message/waiting")
  @ResponseMessage("Get All Message Waiting")
  async getWaitingChatRooms() {
    return this.chatService.findChatRoomsByWaitingStatus();
  }

  // user send message tới employee
  @Post("/send")
  @ResponseMessage("Customer Send Message To Employee")
  async createChatRoom(@Body() data: sendMessageDto) {
    console.log(`data:`, data);
    return this.chatService.createMessage({
      customerId: data.customerId,
      receiverId: data.receiverId,
      nameCustomer: data.nameCustomer,
      messages: data.messages,
    });
  }

  @Post("/reply/")
  @ResponseMessage("Employee Reply  Message Of Employee")
  async updateRoomAfterReply(@Body() data: employeeReplyMessageDto) {
    console.log(data.employeeId, data.customerId, data.messages);

    return this.chatService.updateRoomAfterReply({
      customerId: data.customerId,
      employeeId: data.employeeId,
      messages: data.messages,
    });
  }

  @Get("room/:CustomerId")
  async getMessagesByRoom(@Param("CustomerId") customerId: string) {
    return this.chatService.findChatRoomByCustomerId(customerId);
  }
}

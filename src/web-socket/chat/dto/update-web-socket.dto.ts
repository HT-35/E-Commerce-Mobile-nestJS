import { sendMessageDto } from "@/web-socket/chat/dto/send-nessage.dto";
import { OmitType, PartialType } from "@nestjs/mapped-types";

export class UpdateWebSocketDto extends PartialType(
  OmitType(sendMessageDto, ["customerId"] as const),
) {}

import { Module } from '@nestjs/common';
import { ConversationModelService } from './conversation-model.service';
import { ConversationModelController } from './conversation-model.controller';

@Module({
  controllers: [ConversationModelController],
  providers: [ConversationModelService],
})
export class ConversationModelModule {}

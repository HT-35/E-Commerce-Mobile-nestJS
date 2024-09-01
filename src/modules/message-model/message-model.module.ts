import { Module } from '@nestjs/common';
import { MessageModelService } from './message-model.service';
import { MessageModelController } from './message-model.controller';

@Module({
  controllers: [MessageModelController],
  providers: [MessageModelService],
})
export class MessageModelModule {}

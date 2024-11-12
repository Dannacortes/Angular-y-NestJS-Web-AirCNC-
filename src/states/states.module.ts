import { Module } from '@nestjs/common';
import { StatesController } from './states.controller';
import { StatesService } from './states.services';

@Module({
  imports: [],
  providers: [StatesService],
  controllers: [StatesController],
})
export class StatesModule {}

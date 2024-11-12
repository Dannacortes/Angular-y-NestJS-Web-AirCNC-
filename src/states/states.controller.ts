import { Controller, Get } from '@nestjs/common';

@Controller('states') 
export class StatesController {
  @Get()
  getStates() {
    return 'Here are the states';
  }
}

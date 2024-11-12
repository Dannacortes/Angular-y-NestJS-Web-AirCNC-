import { Injectable } from '@nestjs/common';

@Injectable()
export class StatesService {
  getStates() {
    return 'List of states';
  }
}

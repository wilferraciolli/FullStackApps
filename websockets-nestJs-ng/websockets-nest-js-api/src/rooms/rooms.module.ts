import {Logger, Module} from '@nestjs/common';
import { RoomsGateway } from './rooms.gateway';

@Module({
  providers: [RoomsGateway, Logger]
})
export class RoomsModule {}

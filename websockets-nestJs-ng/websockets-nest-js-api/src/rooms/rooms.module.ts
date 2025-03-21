import {Logger, Module} from '@nestjs/common';
import { RoomsGateway } from './rooms.gateway';
import {MessagesService} from "./messages.service";
import {RoomsController} from "./rooms.controller";

@Module({
  controllers: [RoomsController],
  providers: [RoomsGateway, Logger, MessagesService],
  exports: [MessagesService]
})
export class RoomsModule {}

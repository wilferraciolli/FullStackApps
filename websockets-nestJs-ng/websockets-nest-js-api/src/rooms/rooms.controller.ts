import {Body, Controller, Param, Post} from "@nestjs/common";
import {MessagesService} from "./messages.service";
import {EVENT_NAME_TYPE} from "./constants/event-type.enum";

@Controller('messages')
export class RoomsController {
  constructor(private readonly _messageService: MessagesService) {
  }

  // TODO change the payload type
  @Post('broadcast')
  broadcastMessage(@Body() messageData: { event: EVENT_NAME_TYPE; data: any }) {
    this._messageService.broadcastMessage(messageData.event, messageData.data);
    return { success: true };
  }

  @Post(':clientId')
  sendToClient(
    @Param('clientId') clientId: string,
    @Body() messageData: { event: EVENT_NAME_TYPE; data: any },
  ) {
    this._messageService.sendMessageToClient(
      clientId,
      messageData.event,
      messageData.data,
    );

    return { success: true };
  }
}
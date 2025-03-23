import {Body, Controller, Param, Post, Query} from "@nestjs/common";
import {MessagesService} from "./messages.service";
import {EVENT_NAME_TYPE} from "./constants/event-type.enum";
import {MessageDTO} from "./message.dto";

@Controller('messages')
export class RoomsController {
  constructor(private readonly _messageService: MessagesService) {
  }

  @Post('broadcast')
  public broadcastMessage(@Body() messageDTO: MessageDTO): MessageDTO {
    this._messageService.broadcastMessage(messageDTO);

    return messageDTO;
  }

  @Post(':clientId')
  public sendToClient(
    @Param('clientId') clientId: string,
    @Query('eventName') eventName: string,
    @Body() messageDTO: MessageDTO,
  ): MessageDTO {
    this._messageService.sendMessageToClient(
      clientId,
      eventName,
      messageDTO,
    );

    return messageDTO;
  }
}
import {Injectable} from '@nestjs/common';
import {RoomsGateway} from "./rooms.gateway";
import {Message} from "./interfaces/message.interface";
import {EVENT_NAME_TYPE} from "./constants/event-type.enum";

@Injectable()
export class MessagesService {
  constructor(private messagesGateway: RoomsGateway) {
  }

  // Method to broadcast a message to all connected clients
  public broadcastMessage(event: EVENT_NAME_TYPE, message: Message): void {
    this.messagesGateway.broadcastMessage(event, message);
  }

  // Method to send a message to a specific client
  public sendMessageToClient(clientId: string, event: EVENT_NAME_TYPE, message: Message): void {
    this.messagesGateway.sendToClient(clientId, event, message);
  }
}
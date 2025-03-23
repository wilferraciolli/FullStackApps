import {Injectable} from '@nestjs/common';
import {RoomsGateway} from "./rooms.gateway";
import {Message} from "./interfaces/message.interface";
import {EVENT_NAME_TYPE} from "./constants/event-type.enum";
import {MessageDTO} from "./message.dto";

@Injectable()
export class MessagesService {
  constructor(private messagesGateway: RoomsGateway) {
  }

  // Method to broadcast a message to clients
  public broadcastMessage(payload: MessageDTO): void {
    this.messagesGateway.broadcastMessageToRoom({
      id: payload.id,
      clientId: payload.clientId,
      roomName: payload.roomName,
      messageType: payload.messageType,
      message: payload.message,
      replyToSender: payload.replyToSender,
      timestamp: payload.timestamp
    });
  }

  // Method to send a message to a specific client
  public sendMessageToClient(clientId: string, eventName: string, payload: MessageDTO): void {
    this.messagesGateway.sendToClient(clientId, eventName, {
      id: payload.id,
      clientId: payload.clientId,
      roomName: payload.roomName,
      messageType: payload.messageType,
      message: payload.message,
      replyToSender: payload.replyToSender,
      timestamp: payload.timestamp
    });
  }
}
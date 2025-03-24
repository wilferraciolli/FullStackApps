import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {Logger} from '@nestjs/common';
import {Message} from './interfaces/message.interface';
import {EVENT_NAME_TYPE} from "./constants/event-type.enum";
import {ClientConnection} from "./interfaces/client-connection.interface";
import {RoomAcknowledge} from "./interfaces/room-acknowledge.interface";
import {MESSAGE_TYPE} from "./constants/message-type.enum";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private _server: Server;

  private _clients: Map<string, Socket> = new Map<string, Socket>();

  constructor(private _logger: Logger) {
  }

  public handleConnection(client: Socket): void {
    const authHeader: string | undefined =
      client.handshake.headers.authorization;
    // this._logger.log('Client connected auth header ', authHeader);

    const resourceIdQueryParam: string = client.handshake.query
      .resourceId as string;
    // this._logger.log(
    //   'Client connected resourceId param ' + resourceIdQueryParam,
    // );

    this._server.emit(EVENT_NAME_TYPE.CLIENT_CONNECTED, {
      clientId: client.id,
      message: `Client connected`,
    } as ClientConnection);
  }

  public handleDisconnect(client: Socket): void {
    // console.log('Client disconnected ', client.id);
    this._server.emit(EVENT_NAME_TYPE.CLIENT_DISCONNECTED, {
      clientId: client.id,
      message: `Client disconnected`,
    } as ClientConnection);
  }

  // Method to send message to all clients
  public broadcastMessageToRoom(message: Message): void {
    // get room name
    if (message.replyToSender) {
      this._sendMessageToAllInRoom(message.roomName, message);
    } else {
      const client: Socket | undefined = this._clients.get(message.clientId);

      if (client) {
        this._sendMessageToAllInRoomExceptsSender(client, message.roomName, message);
      } else {
        // if we cant find the client, still broadcast the message as it could be that the client just disconnected
        this._sendMessageToAllInRoom(message.roomName, message);
      }
    }
  }

  // Method to send message to specific client
  public sendToClient(clientId: string, event: string, message: Message): void {
    const client: Socket | undefined = this._clients.get(clientId);
    if (client) {
      client.emit(event, message);
    }
  }

  // Allow a client to join a room, this returns an ack response
  @SubscribeMessage(MESSAGE_TYPE.JOIN_ROOM)
  public async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomName: string },
  ): Promise<RoomAcknowledge> {
    await client.join(data.roomName);
    this._logger.log(
      `Client ${client.id} is now watching resource ${data.roomName}`,
    );

    return {
      clientId: client.id,
      success: true,
      roomName: data.roomName
    } as RoomAcknowledge;
  }

  // Allow a client to leave a room, this returns an ack response
  @SubscribeMessage(MESSAGE_TYPE.LEAVE_ROOM)
  public async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomName: string },
  ): Promise<RoomAcknowledge> {
    await client.leave(data.roomName);
    // this._logger.log(
    //   `Client ${client.id} stopped watching resource ${data.resourceId}`,
    // );

    return {
      clientId: client.id,
      success: true,
      roomName: data.roomName
    } as RoomAcknowledge;
  }

  @SubscribeMessage(MESSAGE_TYPE.MESSAGE)
  public listenForMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: Message,
  ): void {
    const roomName: string | undefined = message.roomName;
    this._logger.log('Received message from client: ', client.id)

    if (roomName) {
      // Only send the message to clients watching this room
      if (message.replyToSender) {
        this._sendMessageToAllInRoom(roomName, message);
      } else {
        this._sendMessageToAllInRoomExceptsSender(client, roomName, message)
      }
      // this._logger.log(`Message sent for resource ${message.resourceId}`);
    } else {
      // If no room name is specified, notify only the sender
      client.emit(EVENT_NAME_TYPE.ERROR, {
        message: 'No roomName specified in the message',
      });
    }
  }

  private _sendMessageToAllInRoom(roomName: string, message: Message): void {
    this._server.to(roomName)
      .emit(EVENT_NAME_TYPE.MESSAGE_REPLY, message);
  }

  private _sendMessageToAllInRoomExceptsSender(client: Socket, roomName: string, message: Message): void {
    client.to(roomName)
      .emit(EVENT_NAME_TYPE.MESSAGE_REPLY, message);
  }
}
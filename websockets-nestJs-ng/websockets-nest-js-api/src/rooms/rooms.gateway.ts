import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Room } from './interfaces/room.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private _server: Server;

  constructor(private _logger: Logger) { }

  public handleConnection(client: Socket): void {
    const authHeader: string | undefined =
      client.handshake.headers.authorization;
    this._logger.log('Client connected auth header ', authHeader);

    const resourceIdQueryParam: string = client.handshake.query
      .resourceId as string;
    this._logger.log(
      'Client connected resourceId param ' + resourceIdQueryParam,
    );

    this._server.emit('client-connected', {
      message: `Client connected`,
      clientId: client.id,
    });
  }

  public handleDisconnect(client: Socket): void {
    console.log('Client disconnected ', client.id);
    this._server.emit('client-disconnected', {
      message: `Client disconnected: ${client.id}`,
      clientId: client.id,
    });
  }

  // Allow a client to join a room, this returns an ack response
  @SubscribeMessage('join-room')
  public async handleWatchResource(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { resourceId: string },
  ) {
    const roomName = `resource:${data.resourceId}`;
    await client.join(roomName);
    this._logger.log(
      `Client ${client.id} is now watching resource ${data.resourceId}`,
    );

    // TODO add the clientId to response
    return { success: true, resourceId: data.resourceId };
  }

  // Allow a client to leave a room, this returns an ack response
  @SubscribeMessage('leave-room')
  public async handleUnwatchResource(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { resourceId: string },
  ) {
    const roomName = `resource:${data.resourceId}`;
    await client.leave(roomName);
    this._logger.log(
      `Client ${client.id} stopped watching resource ${data.resourceId}`,
    );

    return { success: true, resourceId: data.resourceId };
  }

  @SubscribeMessage('rooms')
  public listenForMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: Room,
  ): void {
    if (message.resourceId) {
      // Only send the message to clients watching this resource
      const roomName = `resource:${message.resourceId}`;
      if (message.omitSender) {
        client.to(roomName).emit('room-message-reply', message);
      } else {
        this._server.to(roomName).emit('room-message-reply', message);
      }
      // this._logger.log(`Message sent for resource ${message.resourceId}`);
    } else {
      // If no resourceId is specified, notify only the sender
      client.emit('error', {
        message: 'No resourceId specified in the message',
      });
    }
  }
}
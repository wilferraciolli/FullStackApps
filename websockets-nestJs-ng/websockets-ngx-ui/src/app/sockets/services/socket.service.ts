import {Socket, SocketIoConfig} from 'ngx-socket-io';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {MessageType} from '../constants/message-type.constant';
import {Message} from '../interfaces/message.interface';
import {Room} from '../interfaces/room.interface';
import {RoomAcknowledge} from '../interfaces/room-acknowledge.interface';
import {EventType} from '../constants/event-type.constant';
import {ClientConnection} from '../interfaces/client-connection.interface';

export const socketConfig: SocketIoConfig = {
  url: 'http://localhost:3001',
  options: {
    transports: ['websocket'],
    reconnection: true,
    extraHeaders: {
      Authorization: 'your-auth-token' // Optional: add if your server requires authentication
    }
  }
};

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(private socket: Socket) {
  }

  // Send a message to the server
  public sendMessage(event: MessageType, data: Message): void {
    this.socket.emit(event, data);
  }

  // // Listen for messages from the server
  // public onMessage<T>(event: string): Observable<T> {
  //   return this.socket.fromEvent<T>(event, (data: T) => data);
  // }

  public onMessage<T>(event: string): Observable<T> {
    return new Observable<T>(observer => {
      this.socket.on(event, (data: T) => {
        observer.next(data);
      });

      return () => {
        this.socket.off(event);
      }
    });
  }

  public async joinRoom(data: Room): Promise<RoomAcknowledge> {
    return this._roomAction(MessageType.JOIN_ROOM, data);
  }

  public async leaveRoom(data: Room): Promise<RoomAcknowledge> {
    return this._roomAction(MessageType.LEAVE_ROOM, data);
  }

  private async _roomAction(eventName: string, data: Room): Promise<RoomAcknowledge> {
    const response: RoomAcknowledge = await this.socket.emitWithAck(eventName, data);

    return response;
  }

  joinRoom1(roomName: string): Observable<RoomAcknowledge> {
    return new Observable<RoomAcknowledge>(observer => {
      this.socket.emit(MessageType.JOIN_ROOM, {roomName}, (response: RoomAcknowledge) => {
        observer.next(response);
        observer.complete();
      });
    });
  }

  // Leave a room
  leaveRoom1(roomName: string): Observable<RoomAcknowledge> {
    return new Observable<RoomAcknowledge>(observer => {
      this.socket.emit(MessageType.LEAVE_ROOM, {roomName}, (response: RoomAcknowledge) => {
        observer.next(response);
        observer.complete();
      });
    });
  }

  // Listen for messages
  // onMessage1(): Observable<Message> {
  //   return this.socket.fromEvent<Message>(EventType.MESSAGE_REPLY, (data: Message) => data);
  // }
  //
  // // Listen for errors
  // onError(): Observable<any> {
  //   return this.socket.fromEvent<any>(EventType.ERROR, (data: any) => data);
  // }
  //
  // Listen for client connected events
  public onClientConnected(): Observable<ClientConnection> {
    return new Observable<ClientConnection>(observer => {
      this.socket.on(EventType.CLIENT_CONNECTED, (clientConnection: ClientConnection) => {
        observer.next(clientConnection);
      });

      return () => {
        this.socket.off(EventType.CLIENT_CONNECTED);
      }
    });
  }

  // Listen for client disconnected events
  public onClientDisconnected(): Observable<ClientConnection> {
    return new Observable<ClientConnection>(observer => {
      this.socket.on(EventType.CLIENT_DISCONNECTED, (clientConnection: ClientConnection) => {
        observer.next(clientConnection);
      });

      return () => {
        this.socket.off(EventType.CLIENT_DISCONNECTED);
      }
    });
  }
}

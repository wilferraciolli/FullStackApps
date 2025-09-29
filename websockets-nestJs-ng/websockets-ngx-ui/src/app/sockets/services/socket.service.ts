import {Socket, SocketIoConfig} from 'ngx-socket-io';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {MessageType} from '../constants/message-type.constant';
import {Message} from '../interfaces/message.interface';
import {Room} from '../interfaces/room.interface';
import {RoomAcknowledge} from '../interfaces/room-acknowledge.interface';
import {EventType} from '../constants/event-type.constant';
import {ClientConnection} from '../interfaces/client-connection.interface';
import { environment } from '../../../environments/environment';
import {WebsocketError} from '../interfaces/error.interface';

export const socketConfig: SocketIoConfig = {
  url: environment.websocketsUrl,
  options: {
    transports: ['websocket'], // forces websocket protocol
    reconnection: true, // if connection failure reconnect
    autoConnect: false, // do not connect on start up, only manual connection
    query: {
      'accessKey': environment.accessKey
    }
  }
};

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private _errorSubject: Subject<WebsocketError> = new Subject<WebsocketError>();
  private _errorConnectionSubject: Subject<WebsocketError> = new Subject<WebsocketError>();
  private _connectionSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private socket: Socket) {
    this._setUpErrorListeners();
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

  /**
   * Method to subscribe to generic errors.
   */
  public onError(): Observable<WebsocketError> {
    return this._errorSubject.asObservable();
  }

  public getConnected(): Observable<boolean> {
    return this._connectionSubject.asObservable();
  }

  /**
   * Method to subscribe to connection errors.
   */
  public onConnectionError(): Observable<WebsocketError> {
    return this._errorConnectionSubject.asObservable();
  }

  /**
   * Helper method to check if websocket is connected.
   */
  public isConnected(): boolean {
    return this.socket.ioSocket.connected;
  }

  /**
   * Helper method to manually connect a client.
   */
  public connectClient(): void {
    this.socket.connect();
    this._connectionSubject.next(true);
  }

  /**
   * Helper method to manually disconnect a client.
   */
  public disconnectClient(): void {
    this.socket.disconnect();
    this._connectionSubject.next(false);
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

  private _setUpErrorListeners(): void {
    // handle generic errors
    this.socket.ioSocket.on(EventType.ERROR, (error: WebsocketError): void => {
      this._errorSubject.next(error);
    });

    this.socket.ioSocket.on(EventType.ERROR_CONNECTION, (error: any): void => {
      this._errorConnectionSubject.next(error);
    });

    this.socket.ioSocket.on(EventType.RECONNECT_ATTEMPT, (attemptNumber: number): void => {
      this._errorConnectionSubject.next({
        status: 400,
        message: `Failed attempt to reconnect ${attemptNumber}`,
        error: EventType.RECONNECT_ATTEMPT
      });
    });

    this.socket.ioSocket.on(EventType.RECONNECT_FAILED, (): void => {
      this._errorConnectionSubject.next({
        status: 400,
        message: `Failed to reconnect`,
        error: EventType.RECONNECT_FAILED
      });
    });
  }
}

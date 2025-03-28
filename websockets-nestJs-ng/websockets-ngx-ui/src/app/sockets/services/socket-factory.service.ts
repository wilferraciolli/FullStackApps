import {Injectable, InjectionToken} from "@angular/core";
import {SocketConfig} from '../interfaces/socket-config.interface';
import {Socket} from 'ngx-socket-io';
import {Observable, Subject} from 'rxjs';



// Injection token for socket configurations
export const SOCKET_CONFIG = new InjectionToken<SocketConfig>('socket.config');

@Injectable({
  providedIn: 'root',
})
export class SocketFactoryService {
  private socketInstances: Map<string, Socket> = new Map<string, Socket>();

  /**
   * Create or retrieve a socket connection
   * @param config Socket configuration
   * @param instanceKey Unique key for the socket instance
   */
  public createSocketConnection(config: SocketConfig, instanceKey: string = 'default'): Socket {
    // Check if socket instance already exists
    if (this.socketInstances.has(instanceKey)) {
      return this.socketInstances.get(instanceKey)!;
    }

    // Create new socket connection
    const socket = config.namespace
      ? io(`${config.url}/${config.namespace}`, config.options)
      : io(config.url, config.options);

    // Store the socket instance
    this.socketInstances.set(instanceKey, socket);

    return socket;
  }

  /**
   * Create an observable for a specific event
   * @param socket Socket instance
   * @param eventName Event to listen to
   */
  fromEvent<T>(socket: Socket, eventName: string): Observable<T> {
    const subject = new Subject<T>();

    socket.on(eventName, (data: T) => {
      subject.next(data);
    });

    return subject.asObservable();
  }

  /**
   * Emit an event
   * @param socket Socket instance
   * @param eventName Event to emit
   * @param data Data to send
   */
  public emit(socket: Socket, eventName: string, data: any): void {
    socket.emit(eventName, data);
  }

  /**
   * Remove a specific socket instance
   * @param instanceKey Key of the socket to remove
   */
  public removeSocketInstance(instanceKey: string = 'default'): void {
    const socket = this.socketInstances.get(instanceKey);
    if (socket) {
      socket.disconnect();
      this.socketInstances.delete(instanceKey);
    }
  }

  /**
   * Clean up all socket connections
   */
  public cleanup(): void {
    this.socketInstances.forEach((socket) => {
      socket.disconnect();
    });
    this.socketInstances.clear();
  }
}

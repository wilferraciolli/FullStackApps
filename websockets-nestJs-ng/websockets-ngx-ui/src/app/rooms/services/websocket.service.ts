import {Socket} from 'ngx-socket-io';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private url = 'http://localhost:3000';
}

import {Component, computed, OnDestroy, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {Message} from '../../sockets/interfaces/message.interface';
import {SocketService} from '../../sockets/services/socket.service';
import {Subscription} from 'rxjs';
import {MessageType} from '../../sockets/constants/message-type.constant';
import {EventType} from '../../sockets/constants/event-type.constant';
import {ClientConnection} from '../../sockets/interfaces/client-connection.interface';

@Component({
  selector: 'wt-room-list',
  imports: [
    MatButton,
    FormsModule,
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.scss'
})
export class RoomListComponent implements OnInit, OnDestroy {
  public messages: WritableSignal<Message[]> = signal([]);
  public newMessage: string = '';

  messageInput = new FormControl('');
  private _clientId: WritableSignal<string> = signal('');
  private _roomId: WritableSignal<number> = signal(1);
  private messageSubscription: Subscription | null = null;
  private connectedSubscription?: Subscription | null = null;
  private disconnectedSubscription?: Subscription | null = null;

  public clientId: Signal<string> = computed(() => this._clientId());
  public roomId: Signal<number> = computed(() => this._roomId());

  constructor(private socketService: SocketService) {
  }

  public async ngOnInit(): Promise<void> {
    this.messageSubscription = this.socketService.onMessage<Message>(EventType.MESSAGE_REPLY)
      .subscribe({
        next: (message: Message) => {
          console.log('Message received ', message)
          this.messages.update((messages: Message[]) => [...messages, message]);
        },
        error: (err) => {
          console.error('Socket error:', err);
        }
      });

    this.connectedSubscription = this.socketService.onClientConnected()
      .subscribe({
        next: (message: ClientConnection) => {
          console.log('Client connected ', message)
          // how to know when I am the one that just connected
         // this._clientId.set(message.clientId);
        },
        error: (err) => {
          console.error('Socket error:', err);
        }
      });

    this.disconnectedSubscription = this.socketService.onClientDisconnected()
      .subscribe({
        next: (message: ClientConnection) => {
          console.log('Client disconnected ', message)
          // this._clientId.set(message.clientId);
        },
        error: (err) => {
          console.error('Socket error:', err);
        }
      });

    await this.joinRoom(this.roomId());

    // this.socketService.connect();
    //
    // this.socketService
    //   .on<SimpleMessage>('client-connected')
    //   .subscribe((message: SimpleMessage) => {
    //     this._clientId.set(message.clientId);
    //   });
    //
    // // Important: Join the current room after connection
    // const response: RoomAcknowledge = await this.socketService.joinRoom({resourceId: this._roomId().toString()});
    // console.log('room ack ', response)
    //
    // // Listen for incoming messages to the room
    // this.socketService
    //   .on<Message>('room-message-reply')
    //   .subscribe((message: Message) => {
    //     console.log('received message resource-update ', message)
    //     this.messages.push(message);
    //   });

    // this.messageSub = this.socketService.onMessage<Message>('message-reply')
    //   .subscribe(message => {
    //     this.messages.push(message);
    //   });
  }

  public ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }

    if (this.connectedSubscription) {
      this.connectedSubscription.unsubscribe();
    }

    if (this.disconnectedSubscription) {
      this.disconnectedSubscription.unsubscribe();
    }
  }

  public sendMessage(): void {
    if (this.newMessage.trim()) {
      const message: Message = {
        id: 'id',
        clientId: 'clientId',
        roomName: this._buildRoomName(this._roomId()),
        message: this.newMessage,
        messageType: 'comment-added',
        replyToSender: true,
        timestamp: '2025-01-01T09:00:00Z'
      }

      this.socketService.sendMessage(MessageType.MESSAGE, message);

      this.newMessage = '';
    }
  }

  navigateToRoom(number: number) {

  }

  public async joinRoom(roomNumber: number): Promise<void> {
    const [leaveRoomResponse, joinRoomResponse] = await Promise.all([
      this.socketService.leaveRoom({roomName: this._buildRoomName(this._roomId())}),
      this.socketService.joinRoom({roomName: this._buildRoomName(roomNumber)})
    ]);

    console.log('Left room:', leaveRoomResponse);
    console.log('Joined room:', joinRoomResponse);

    this.messages.set([]);
    this._roomId.set(roomNumber);
  }

  private _buildRoomName(roomId: number): string {
    return `room-${roomId}`
  }
}

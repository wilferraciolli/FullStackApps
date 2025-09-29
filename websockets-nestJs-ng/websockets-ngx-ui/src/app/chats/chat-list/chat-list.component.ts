import {Component, computed, inject, OnDestroy, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {NgForOf} from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Message} from '../../sockets/interfaces/message.interface';
import {Subscription} from 'rxjs';
import {SocketService} from '../../sockets/services/socket.service';
import {EventType} from '../../sockets/constants/event-type.constant';
import {ClientConnection} from '../../sockets/interfaces/client-connection.interface';
import {MessageType} from '../../sockets/constants/message-type.constant';
import {MatSnackBar} from '@angular/material/snack-bar';
import {WebsocketError} from '../../sockets/interfaces/error.interface';
import {RoomAcknowledge} from '../../sockets/interfaces/room-acknowledge.interface';
import {ChatMessageComponent} from '../chat-message/chat-message.component';
import {ChatEventType} from '../constants/chat-event-type.enum';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'wt-chat-list',
  imports: [
    MatButton,
    NgForOf,
    ReactiveFormsModule,
    FormsModule,
    ChatMessageComponent,
  ],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss'
})
export class ChatListComponent implements OnInit, OnDestroy {
  public messages: WritableSignal<Message[]> = signal([]);
  public newMessage: string = '';

  messageInput = new FormControl('');
  private _clientId: WritableSignal<string> = signal('');
  private _roomId: WritableSignal<number> = signal(1);
  private messageSubscription: Subscription | null = null;
  private connectedSubscription?: Subscription | null = null;
  private disconnectedSubscription?: Subscription | null = null;

  private errorSubscription: Subscription | null = null;
  private connectionErrorSubscription: Subscription | null = null;

  public clientId: Signal<string> = computed(() => this._clientId());
  public roomId: Signal<number> = computed(() => this._roomId());

  private _snackBar: MatSnackBar = inject(MatSnackBar);
  private _socketService: SocketService = inject(SocketService);

  public isConnected: Signal<boolean> = toSignal(this._socketService.getConnected(), {initialValue: false});

  constructor() {
  }

  public async ngOnInit(): Promise<void> {
    this.messageSubscription = this._socketService.onMessage<Message>(EventType.MESSAGE_REPLY)
      .subscribe({
        next: (message: Message) => {
          if (message.messageType === ChatEventType.COMMENT_ADDED) {
            console.log('Message received ', message)
            this._snackBar.open(`Message received from ${message.clientName}`, 'X', {
              duration: 2000,
            });

            this.messages.update((messages: Message[]) => [...messages, message]);
          } else if (message.messageType === ChatEventType.USER_TYPING) {
            this._snackBar.open(`User is typing ${message.clientName}`, 'X', {
              duration: 2000,
            });
          }
        },
        error: (err) => {
          console.error('Socket error:', err);
        }
      });

    this.connectedSubscription = this._socketService.onClientConnected()
      .subscribe({
        next: (message: ClientConnection) => {
          console.log('Client connected ', message)
          this._snackBar.open('Client connected', 'X', {
            duration: 2000,
          });
          // how to know when I am the one that just connected
          // this._clientId.set(message.clientId);
        },
        error: (err) => {
          console.error('Socket error:', err);
        }
      });

    this.disconnectedSubscription = this._socketService.onClientDisconnected()
      .subscribe({
        next: (message: ClientConnection) => {
          console.log('Client disconnected ', message)
          // this._clientId.set(message.clientId);
        },
        error: (err) => {
          console.error('Socket error:', err);
        }
      });

    this.connectionErrorSubscription = this._socketService.onConnectionError()
      .subscribe((error: WebsocketError) => {
        console.log('error')
        this._snackBar.open(`Error ${error.message}`, 'X', {
          duration: 2000,
        });
      });

    this.errorSubscription = this._socketService.onConnectionError()
      .subscribe((error: WebsocketError) => {
        console.log('error')
        this._snackBar.open(`Connection error ${error.message}`, 'X', {
          duration: 2000,
        });
      });

    await this.joinRoom(this.roomId());
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

    if (this.connectionErrorSubscription) {
      this.connectionErrorSubscription.unsubscribe();
    }

    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
  }

  public sendMessage(): void {
    if (this.newMessage.trim()) {
      const message: Message = {
        id: 'id',
        clientId: this._clientId(),
        clientName: 'Client Name',
        roomName: this._buildRoomName(this._roomId()),
        message: this.newMessage,
        messageType: ChatEventType.COMMENT_ADDED,
        replyToSender: true,
        timestamp: '2025-01-01T09:00:00Z'
      }

      this._socketService.sendMessage(MessageType.MESSAGE, message);

      this.newMessage = '';
    }
  }

  public sendUserTypingMessage(): void {
    if (this.newMessage.length > 3) {
      const message: Message = {
        id: 'id',
        clientId: this._clientId(),
        clientName: 'Client Name',
        roomName: this._buildRoomName(this._roomId()),
        message: 'User is typing',
        messageType: ChatEventType.USER_TYPING,
        replyToSender: false,
        timestamp: '2025-01-01T09:00:00Z'
      }

      this._socketService.sendMessage(MessageType.MESSAGE, message);
    }
  }

  navigateToRoom(number: number) {

  }

  public async joinRoom(roomNumber: number): Promise<void> {
    const [leaveRoomResponse, joinRoomResponse]: [RoomAcknowledge, RoomAcknowledge] = await Promise.all([
      this._socketService.leaveRoom({roomName: this._buildRoomName(this._roomId())}),
      this._socketService.joinRoom({roomName: this._buildRoomName(roomNumber)})
    ]);

    this._clientId.set(joinRoomResponse.clientId);

    console.log('Left room:', leaveRoomResponse);
    console.log('Joined room:', joinRoomResponse);
    this._snackBar.open(`joined chat ${roomNumber}`, 'X', {

      duration: 2000,
    });

    this.messages.set([]);
    this._roomId.set(roomNumber);
  }

  public connect(): void {
    this._socketService.connectClient();
  }

  public disconnect(): void {
    this._socketService.disconnectClient();
  }

  private _buildRoomName(roomId: number): string {
    return `chat-${roomId}`
  }
}


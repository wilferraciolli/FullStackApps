import {Component, computed, OnDestroy, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {MatDrawer, MatDrawerContainer, MatDrawerContent} from '@angular/material/sidenav';
import {MatButton} from '@angular/material/button';
import {MatBadge} from '@angular/material/badge';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DatePipe, NgForOf} from '@angular/common';
import {Message} from '../interfaces/message.inerface';

@Component({
  selector: 'wt-room-list',
  imports: [
    MatDrawerContainer,
    MatDrawerContent,
    MatDrawer,
    MatBadge,
    MatButton,
    DatePipe,
    FormsModule,
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.scss'
})
export class RoomListComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  messageInput = new FormControl('');
  private _clientId: WritableSignal<string> = signal('');
  private _roomId: WritableSignal<number> = signal(1);

  public clientId: Signal<string> = computed(() => this._clientId());
  public roomId: Signal<number> = computed(() => this._roomId());

  constructor(private socketService: SocketService) {
  }

  public async ngOnInit(): Promise<void> {
    this.socketService.connect();

    this.socketService
      .on<SimpleMessage>('client-connected')
      .subscribe((message: SimpleMessage) => {
        this._clientId.set(message.clientId);
      });

    // Important: Join the current room after connection
    const response: RoomAcknowledge = await this.socketService.joinRoom({resourceId: this._roomId().toString()});
    console.log('room ack ', response)

    // Listen for incoming messages to the room
    this.socketService
      .on<Message>('room-message-reply')
      .subscribe((message: Message) => {
        console.log('received message resource-update ', message)
        this.messages.push(message);
      });
  }

  public ngOnDestroy(): void {
    this.socketService.disconnect();
  }
}

import { Routes } from '@angular/router';
import {RoomListComponent} from './rooms/room-list/room-list.component';
import {HomeComponent} from './home/home.component';
import {ChatListComponent} from './chats/chat-list/chat-list.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'rooms', component: RoomListComponent},
  {path: 'chats', component: ChatListComponent},
  {path: '**', redirectTo: ''}
];

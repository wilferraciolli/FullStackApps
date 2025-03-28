import { Routes } from '@angular/router';
import {RoomListComponent} from './rooms/room-list/room-list.component';

export const routes: Routes = [
  {path: '', component: RoomListComponent},
  {path: '**', redirectTo: ''}
];

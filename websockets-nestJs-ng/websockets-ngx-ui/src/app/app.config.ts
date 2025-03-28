import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';

const socketConfig: SocketIoConfig = { url: 'http://localhost:3001', options: {} };


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(SocketIoModule.forRoot(socketConfig))
  ]
};

import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {socketConfig} from './sockets/services/socket.service';
import {provideHttpClient} from '@angular/common/http';
import {SocketIoModule} from 'ngx-socket-io';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(SocketIoModule.forRoot(socketConfig))
    // TODO check if possible to start socket server dynamically
  ]
};

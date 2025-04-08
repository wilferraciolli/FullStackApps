import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {socketConfig} from './sockets/services/socket.service';
import {provideHttpClient} from '@angular/common/http';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(),
    {provide: 'SOCKET_CONFIG', useValue: socketConfig}
    // importProvidersFrom(SocketIoModule.forRoot(socketConfig))
  ]
};

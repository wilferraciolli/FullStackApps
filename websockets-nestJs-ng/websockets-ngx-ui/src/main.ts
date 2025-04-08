import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import {importProvidersFrom} from '@angular/core';

// Get the socket config
const socketConfig = appConfig.providers.find(
  provider => provider && typeof provider === 'object' && 'provide' in provider && provider.provide === 'SOCKET_CONFIG'
);

const socketIoConfig = socketConfig && 'useValue' in socketConfig ? socketConfig.useValue as SocketIoConfig : {
  url: 'http://localhost:3001',
  options: {}
};

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    importProvidersFrom(SocketIoModule.forRoot(socketIoConfig))
  ]})
  .catch((err) => console.error(err));

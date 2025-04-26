export enum EventType {
  CLIENT_CONNECTED = 'client-connected',
  CLIENT_DISCONNECTED = 'client-disconnected',
  MESSAGE_REPLY = 'message-reply',
  ERROR = 'error',
  ERROR_CONNECTION = 'connect_error',
  RECONNECT_ATTEMPT = 'reconnect_attempt',
  RECONNECT_FAILED = 'reconnect_failed',
}

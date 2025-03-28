export interface Message {
  id: string;
  clientId: string;
  roomName: string;
  messageType: string;
  message: string;
  omitSender: boolean;
  timestamp: Date;
}

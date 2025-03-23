export interface Message {
  id: string;
  clientId: string;
  roomName: string;
  messageType: string;
  message: string;
  replyToSender?: boolean;
  timestamp: string;
}

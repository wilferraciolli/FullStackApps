export interface Message {
  id: string;
  clientId: string;
  clientName: string;
  roomName: string;
  messageType: string;
  message: string;
  replyToSender?: boolean;
  timestamp: string;
}

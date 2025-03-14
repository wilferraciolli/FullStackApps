export interface Room {
  id: string;
  clientId: string;
  feature: string;
  subFeature: string;
  resourceId: string;
  messageType: string;
  message: string;
  omitSender: boolean;
  timestamp: Date;
}
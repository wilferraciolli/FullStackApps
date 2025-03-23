import { IsString, IsOptional, IsBoolean, IsUUID, IsISO8601, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MessageDTO {
  @ApiProperty({ description: 'Unique identifier for the message' })
  @IsUUID(4)
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Client identifier who sent the message' })
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({ description: 'Name of the room where message was sent' })
  @IsString()
  @IsNotEmpty()
  roomName: string;

  @ApiProperty({ description: 'Type of message (e.g., text, image, notification)' })
  @IsString()
  @IsNotEmpty()
  messageType: string;

  @ApiProperty({ description: 'Content of the message' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({ description: 'Whether to send reply to the sender', default: false })
  @IsBoolean()
  @IsOptional()
  replyToSender?: boolean;

  @ApiProperty({ description: 'ISO timestamp when message was created' })
  @IsISO8601()
  @IsNotEmpty()
  timestamp: string;
}
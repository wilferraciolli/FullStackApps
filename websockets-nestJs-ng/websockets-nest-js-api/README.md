# Web sockets rooms api

NestJS app to manager socketIO's room functionality

To use this serve

* Connect to the server
* Join at least 1 room
* Handle messages sent from the server (only clients connected to a room will receive the message)

## Docker 
To run this in docker either run the docker file, or docker-compose.
For docker compose 
```bash
    docker compose up --build
```


#### Connect to server

The websocket is found on this address and port`http://localhost:3001`, upon connecting to the server,
The server will broadcast the `client-connected` event to all

```typescript
interface ClientConnection {
  clientId: string,
  clientName: string;  
  message: string,
}
```

#### Join a room

Before a client can receive messages, it must join a room, the client joining a
room will return the following response

```typescript
interface RoomAcknowledge {
  clientId: string;
  clientName: string;
  success: boolean;
  resourceId: string;
}
```

#### Send message

The following Message payload is used to send messages, once a message has come in
then the server will forward it to the every client connected to the roomId

```typescript
interface Message {
  id: string;
  clientId: string;
  clientName: string;
  roomName: string;
  messageType: string;
  message: string;
  replyToSender?: boolean;
  timestamp: string;
}
```

### Sending message via http
You can use http to send messages and broadcast to all clients
```curl
    curl -X POST http://localhost:3001/messages/broadcast \
    -H "Content-Type: application/json" \
    -d '{
      "id": "cc5848cf-92b2-4f1f-bdb9-340fa0ad1886",
      "clientId": "sender-client-id",
      "clientName": "sneder Client Name",
      "roomName": "roomNameChosenByClient",
      "messageType": "comment-added",
      "message": "Hello, everyone!",
      "timestamp": "2024-03-24T12:00:00Z"
    }'
```

You can use http to send messages to a single client
```curl
    curl -X POST http://localhost:3001/messages/{clientId}?eventName=mesage-reply
     \
    -H "Content-Type: application/json" \
    -d '{
      "id": "cc5848cf-92b2-4f1f-bdb9-340fa0ad1886",
      "clientId": "sender-client-id",
      "clientName": "sneder Client Name",
      "roomName": "roomNameChosenByClient",
      "messageType": "comment-added",
      "message": "Hello, everyone!",
      "timestamp": "2024-03-24T12:00:00Z"
    }'
```

```bash
# development
  npm run start:dev
```

```bash
# watch mode
  $ npm run start

# production mode
  $ npm run start:prod
```

## Dependencies
### Websockets and Socket IO

```bash
$ npm i --save @nestjs/websockets @nestjs/platform-socket.io  @types/socket.io
```

### Config env files

Allow nestJS to use the env file

```bash
  npm install --save @nestjs/config
````

### Joi env config file validation

```bash
  npm install --save joi
```

### Validation

Used to validate DTOs Eg Empty, NotNull...

```bash
  npm install class-validator class-transformer
```

Then set it up in the main

```typescript
  // Set up validation pipe
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: true,
}));
```

### Swagger

Used for openAI to show urls and payloads for APIs, this can be accessed via `localhost:3001/api`

```bash
  npm install @nestjs/swagger swagger-ui-express
```

Then set it up in the main

```typescript
// Set up Swagger
const config = new DocumentBuilder()
  .setTitle('Messages API')
  .setDescription('The Messages API description')
  .setVersion('1.0')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
```


### Health check 
```bash
    npm install @nestjs/terminus @nestjs/common @nestjs/axios axios
```
For Terminus to work with health check, create a controller on the main module
```typescript
@Controller('health')
export class HealthController {
  constructor(private health: HealthCheckService) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // Basic check that the service is running
      () => ({ status: 'ok' }),
      // Add database, redis or other dependency checks as needed
    ]);
  }
}
```


## Create Gateway

```bash
nest g gateway
```

# Websockets Rooms

Yes, Socket.IO automatically manages the lifecycle of rooms. When there are no more clients in a room, Socket.IO will
automatically "destroy" it (remove it from memory). This happens behind the scenes without you needing to implement any
cleanup logic.
Here's how it works:

When a client joins a room with client.join('someRoom'), Socket.IO adds that room to its internal tracking
When a client leaves a room with client.leave('someRoom') or disconnects, Socket.IO removes that client from the room
When the last client leaves a room, Socket.IO automatically removes the room from memory
No explicit "destroy" method is needed - rooms with no clients simply cease to exist

This behavior makes Socket.IO rooms very efficient for your use case, since:

You don't need to track which rooms exist
You don't need to implement cleanup logic
Memory usage remains efficient even with many potential resources
The same room name can be reused later if new clients become interested in that resource

This automatic lifecycle management is one of the reasons why Socket.IO rooms are well-suited for your requirement of
broadcasting messages only to clients interested in a specific resourceId.

When testing with Postman:

Connect to your WebSocket with Postman (no special parameters needed yet)
After connecting, send a message to subscribe to a specific resource:

jsonCopy{
"event": "watch-resource",
"data": {
"resourceId": "id101"
}
}

Then, to simulate a message about that resource:

jsonCopy{
"event": "channels",
"data": {
"id": "someId1",
"feature": "check-ins",
"subFeature": "check-in",
"resourceId": "id101",
"message": "User 1 is typing"
}
}
This approach:

Makes clients join a room specific to each resourceId they want to watch
Broadcasts messages only to clients in the room corresponding to the resourceId
Keeps the implementation simple and scalable

The key point is that clients explicitly join rooms for resources they're interested in, and messages are only broadcast
to the relevant room.RetryClaude does not have the ability to run the code it generates yet.WFare the rooms managed by
socker it? when there are no more clients it will destroy it?EditYes, Socket.IO automatically manages the lifecycle of
rooms. When there are no more clients in a room, Socket.IO will automatically "destroy" it (remove it from memory). This
happens behind the scenes without you needing to implement any cleanup logic.
Here's how it works:

When a client joins a room with client.join('someRoom'), Socket.IO adds that room to its internal tracking
When a client leaves a room with client.leave('someRoom') or disconnects, Socket.IO removes that client from the room
When the last client leaves a room, Socket.IO automatically removes the room from memory
No explicit "destroy" method is needed - rooms with no clients simply cease to exist

This behavior makes Socket.IO rooms very efficient for your use case, since:

You don't need to track which rooms exist
You don't need to implement cleanup logic
Memory usage remains efficient even with many potential resources
The same room name can be reused later if new clients become interested in that resource

This automatic lifecycle management is one of the reasons why Socket.IO rooms are well-suited for your requirement of
broadcasting messages only to clients interested in a specific resourceId.RetryClaude can make mistakes. Please
double-check responses. 3.7 SonnetChoose style

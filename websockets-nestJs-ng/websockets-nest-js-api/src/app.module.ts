import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomsModule } from './rooms/rooms.module';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env.validation';
import { HealthCheckModule } from './health-check/healt-check.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validateEnv,
      cache: true,
    }),
    HealthCheckModule,
    RoomsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { DevicesModule } from 'src/modules/devices/devices.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://mongodb:27017/smarthome',
    ),
    DevicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

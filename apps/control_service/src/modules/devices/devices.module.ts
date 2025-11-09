import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DevicesController } from 'src/modules/devices/devices.controller';
import { DevicesService } from 'src/modules/devices/devices.service';
import {
  Device,
  DeviceSchema,
} from 'src/modules/devices/schemas/device.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
  ],
  controllers: [DevicesController],
  providers: [DevicesService],
})
export class DevicesModule {}

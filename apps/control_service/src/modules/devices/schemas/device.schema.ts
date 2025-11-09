import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DeviceStatus, DeviceType } from 'src/modules/devices/types/types';

export type DeviceDocument = Device &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({ timestamps: true })
export class Device {
  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, enum: DeviceType })
  deviceType: DeviceType;

  @Prop({
    required: true,
    enum: DeviceStatus,
  })
  status: DeviceStatus;

  @Prop({ type: Object, default: {} })
  state: Record<string, any>;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);

DeviceSchema.index({ deviceId: 1 }, { unique: true });

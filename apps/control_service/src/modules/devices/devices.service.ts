import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommandRequestDto } from 'src/modules/devices/dto/command-request.dto';
import { UpdateDeviceDto } from 'src/modules/devices/dto/update-device.dto';
import { DeviceStatusDto } from 'src/modules/devices/dto/device-status.dto';
import { CreateDeviceDto } from 'src/modules/devices/dto/create-device.dto';
import { CreateDeviceResponseDto } from 'src/modules/devices/dto/create-device-response.dto';
import {
  Device,
  DeviceDocument,
} from 'src/modules/devices/schemas/device.schema';
import { DeviceStatus, CommandType } from 'src/modules/devices/types/types';

@Injectable()
export class DevicesService {
  constructor(
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
  ) {}

  async createDevice(
    createDeviceDto: CreateDeviceDto,
  ): Promise<CreateDeviceResponseDto> {
    const existingDevice = await this.deviceModel
      .findOne({ deviceId: createDeviceDto.deviceId })
      .exec();

    if (existingDevice) {
      throw new ConflictException('Device already exists');
    }

    const device = new this.deviceModel({
      deviceId: createDeviceDto.deviceId,
      deviceType: createDeviceDto.deviceType,
      status: DeviceStatus.ACTIVE,
      userId: createDeviceDto.userId,
      state: {},
    });

    const savedDevice = await device.save();

    return {
      success: true,
      message: 'Device created successfully',
      deviceId: savedDevice.deviceId,
      userId: savedDevice.userId,
      deviceType: savedDevice.deviceType,
      status: savedDevice.status,
      createdAt: new Date(),
    };
  }

  async getDeviceStatus(deviceId: string): Promise<DeviceStatusDto> {
    const device = await this.deviceModel.findOne({ deviceId }).exec();

    if (!device) {
      throw new NotFoundException(`Device with ID ${deviceId} not found`);
    }

    return {
      deviceId: device.deviceId,
      deviceType: device.deviceType,
      status: device.status,
      state: device.state,
      updatedAt: device.updatedAt,
    };
  }

  async updateDevice(
    deviceId: string,
    updateDeviceDto: UpdateDeviceDto,
  ): Promise<DeviceStatusDto> {
    const device = await this.deviceModel.findOne({ deviceId }).exec();

    if (!device) {
      throw new NotFoundException(`Device with ID ${deviceId} not found`);
    }

    if (updateDeviceDto.status) {
      device.status = updateDeviceDto.status;
    }

    if (updateDeviceDto.state) {
      device.state = updateDeviceDto.state;
    }

    await device.save();

    return {
      deviceId: device.deviceId,
      deviceType: device.deviceType,
      status: device.status,
      state: device.state,
      updatedAt: device.updatedAt,
    };
  }

  async executeCommand(
    deviceId: string,
    commandRequestDto: CommandRequestDto,
  ): Promise<{ success: boolean; message: string; status: DeviceStatus }> {
    const device = await this.deviceModel.findOne({ deviceId }).exec();

    if (!device) {
      throw new NotFoundException(`Device with ID ${deviceId} not found`);
    }

    switch (commandRequestDto.command) {
      case CommandType.TURN_ON:
        device.status = DeviceStatus.ACTIVE;
        device.state = { ...device.state, power: true };
        break;
      case CommandType.TURN_OFF:
        device.status = DeviceStatus.IDLE;
        device.state = { ...device.state, power: false };
        break;
      case CommandType.SET_VALUE:
        if (commandRequestDto.value === undefined) {
          return {
            success: false,
            message: 'Value is required for SET_VALUE command',
            status: device.status,
          };
        }

        if (device.status !== DeviceStatus.ACTIVE) {
          return {
            success: false,
            message: 'Device is not active',
            status: device.status,
          };
        }

        device.status = DeviceStatus.ACTIVE;
        device.state = { ...device.state, value: commandRequestDto.value };
        break;
    }

    await device.save();

    return {
      success: true,
      message: `Command ${commandRequestDto.command} executed successfully`,
      status: device.status,
    };
  }

  async deleteDevice(
    deviceId: string,
  ): Promise<{ success: boolean; message: string }> {
    const device = await this.deviceModel.findOne({ deviceId }).exec();

    if (!device) {
      throw new NotFoundException('Device not found');
    }

    device.status = DeviceStatus.DELETED;
    await device.save();

    return {
      success: true,
      message: 'Device deleted successfully',
    };
  }
}

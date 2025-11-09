import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CommandRequestDto } from './dto/command-request.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { CreateDeviceDto } from './dto/create-device.dto';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createDevice(@Body() createDeviceDto: CreateDeviceDto) {
    return this.devicesService.createDevice(createDeviceDto);
  }

  @Get(':deviceId')
  async getDeviceStatus(@Param('deviceId') deviceId: string) {
    return this.devicesService.getDeviceStatus(deviceId);
  }

  @Patch(':deviceId')
  async updateDevice(
    @Param('deviceId') deviceId: string,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ) {
    return this.devicesService.updateDevice(deviceId, updateDeviceDto);
  }

  @Post(':deviceId/command')
  @HttpCode(HttpStatus.OK)
  async executeCommand(
    @Param('deviceId') deviceId: string,
    @Body() commandRequestDto: CommandRequestDto,
  ) {
    return this.devicesService.executeCommand(deviceId, commandRequestDto);
  }
}

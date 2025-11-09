import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TelemetryService } from 'src/modules/telemetry/telemetry.service';
import { TelemetrySubmitDto } from 'src/modules/telemetry/dto/telemetry-submit.dto';
import { TelemetryQueryDto } from 'src/modules/telemetry/dto/telemetry-query.dto';

@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async submitTelemetry(@Body() dto: TelemetrySubmitDto) {
    return this.telemetryService.submitTelemetry(dto);
  }

  @Get()
  async getTelemetry(@Query() query: TelemetryQueryDto) {
    return this.telemetryService.getTelemetry(query);
  }
}

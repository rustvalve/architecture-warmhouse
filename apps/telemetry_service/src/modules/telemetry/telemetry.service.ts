import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Telemetry } from 'src/modules/telemetry/entities/telemetry.entity';
import { TelemetrySubmitDto } from 'src/modules/telemetry/dto/telemetry-submit.dto';
import { TelemetryQueryDto } from 'src/modules/telemetry/dto/telemetry-query.dto';
import { TelemetrySubmitResponseDto } from 'src/modules/telemetry/dto/telemetry-submit-response.dto';
import { TelemetryListResponseDto } from 'src/modules/telemetry/dto/telemetry-list-response.dto';

@Injectable()
export class TelemetryService {
  constructor(
    @InjectRepository(Telemetry)
    private readonly telemetryRepository: Repository<Telemetry>,
  ) {}

  async submitTelemetry(
    dto: TelemetrySubmitDto,
  ): Promise<TelemetrySubmitResponseDto> {
    const telemetry = this.telemetryRepository.create({
      deviceId: dto.deviceId,
      data: dto.data,
    });

    const saved = await this.telemetryRepository.save(telemetry);

    return {
      success: true,
      message: 'Telemetry data recorded',
      recordId: saved.id,
    };
  }

  async getTelemetry(
    query: TelemetryQueryDto,
  ): Promise<TelemetryListResponseDto> {
    const { deviceId, from, to, limit = 100, offset = 0 } = query;

    const fromDate = new Date(from);
    const toDate = new Date(to);

    const [data, total] = await this.telemetryRepository.findAndCount({
      where: {
        deviceId,
        createdAt: Between(fromDate, toDate),
      },
      order: {
        createdAt: 'DESC',
      },
      take: limit,
      skip: offset,
    });

    if (total === 0) {
      throw new NotFoundException(
        `No telemetry data found for device '${deviceId}'`,
      );
    }

    return {
      deviceId,
      from,
      to,
      total,
      limit,
      offset,
      data,
    };
  }
}

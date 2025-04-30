import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags } from '@nestjs/swagger';

@Controller('health')
@ApiTags('health')
export class HealthCheckController {
  constructor(
    private healthCheckService: HealthCheckService,
    private http: HttpHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  public async check(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      (): HealthIndicatorResult => ({
        ['server']: { status: 'up' },
      }),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }
}

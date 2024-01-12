import { Controller, Get } from '@nestjs/common';

@Controller('v1/ready')
export class GetReadyV1HttpRequestNestController {
  @Get()
  public async handle(): Promise<void> {
    return undefined;
  }
}

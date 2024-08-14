import { Controller, Get } from '@nestjs/common';

@Controller('v1/ready')
export class GetV1ReadyHttpRequestNestController {
  @Get()
  public async handle(): Promise<void> {
    return undefined;
  }
}

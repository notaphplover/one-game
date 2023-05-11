import { randomUUID } from 'node:crypto';

import { Injectable } from '@nestjs/common';

import { UuidProviderOutputPort } from '../../../application/ports/output/UuidProviderOutputPort';

@Injectable()
export class UuidProviderNodeJsAdapter implements UuidProviderOutputPort {
  public generateV4(): string {
    return randomUUID();
  }
}

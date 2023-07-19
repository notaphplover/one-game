import crypto from 'node:crypto';

import { Builder } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

const CHARS_PER_BYTE: number = 2;

@Injectable()
export class RandomHexStringBuilder implements Builder<string, [number]> {
  public build(length: number): string {
    const bytesAmount: number = length / CHARS_PER_BYTE;

    const integerBytesAmount: number = Math.ceil(bytesAmount);

    let hexString: string = crypto
      .randomBytes(integerBytesAmount)
      .toString('hex');

    if (bytesAmount !== integerBytesAmount) {
      const charsToBeRemoved: number = length % CHARS_PER_BYTE;

      hexString = hexString.substring(0, hexString.length - charsToBeRemoved);
    }

    return hexString;
  }
}

import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

import { BcryptHashProviderOutputPort } from '../../../application/ports/output/BcryptHashProviderOutputPort';

const BCRYPT_SALT_ROUNDS: number = 10;

@Injectable()
export class BcryptHashProviderBcryptAdapter
  implements BcryptHashProviderOutputPort
{
  public async hash(input: string): Promise<string> {
    return bcrypt.hash(input, BCRYPT_SALT_ROUNDS);
  }

  public async verify(input: string, hash: string): Promise<boolean> {
    return bcrypt.compare(input, hash);
  }
}

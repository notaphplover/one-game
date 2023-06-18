import { Module } from '@nestjs/common';

import { CardColorFromCardColorV1Builder } from '../../../application/builders/CardColorFromCardColorV1Builder';
import { CardColorV1FromCardColorBuilder } from '../../../application/builders/CardColorV1FromCardColorBuilder';
import { CardFromCardV1Builder } from '../../../application/builders/CardFromCardV1Builder';
import { CardV1FromCardBuilder } from '../../../application/builders/CardV1FromCardBuilder';

@Module({
  exports: [
    CardColorFromCardColorV1Builder,
    CardColorV1FromCardColorBuilder,
    CardFromCardV1Builder,
    CardV1FromCardBuilder,
  ],
  providers: [
    CardColorFromCardColorV1Builder,
    CardColorV1FromCardColorBuilder,
    CardFromCardV1Builder,
    CardV1FromCardBuilder,
  ],
})
export class CardModule {}

import { Module } from '@nestjs/common';

import { CardColorFromCardColorV1Builder } from '../../../application/builders/CardColorFromCardColorV1Builder';
import { CardColorV1FromCardColorBuilder } from '../../../application/builders/CardColorV1FromCardColorBuilder';
import { CardFromCardV1Builder } from '../../../application/builders/CardFromCardV1Builder';
import { CardV1FromCardBuilder } from '../../../application/builders/CardV1FromCardBuilder';
import { CardBuilder } from '../../typeorm/builders/CardBuilder';
import { CardColorBuilder } from '../../typeorm/builders/CardColorBuilder';
import { CardColorDbBuilder } from '../../typeorm/builders/CardColorDbBuilder';
import { CardDbBuilder } from '../../typeorm/builders/CardDbBuilder';

@Module({
  exports: [
    CardBuilder,
    CardColorBuilder,
    CardColorFromCardColorV1Builder,
    CardColorV1FromCardColorBuilder,
    CardColorDbBuilder,
    CardDbBuilder,
    CardFromCardV1Builder,
    CardV1FromCardBuilder,
  ],
  providers: [
    CardBuilder,
    CardColorBuilder,
    CardColorFromCardColorV1Builder,
    CardColorV1FromCardColorBuilder,
    CardColorDbBuilder,
    CardDbBuilder,
    CardFromCardV1Builder,
    CardV1FromCardBuilder,
  ],
})
export class CardModule {}

import { Module } from '@nestjs/common';

import { CardArrayFromCardDbStringifiedArrayBuilder } from '../../typeorm/builders/CardArrayFromCardDbStringifiedArrayBuilder';
import { CardBuilder } from '../../typeorm/builders/CardBuilder';
import { CardColorBuilder } from '../../typeorm/builders/CardColorBuilder';
import { CardColorDbBuilder } from '../../typeorm/builders/CardColorDbBuilder';
import { CardDbBuilder } from '../../typeorm/builders/CardDbBuilder';

@Module({
  exports: [
    CardArrayFromCardDbStringifiedArrayBuilder,
    CardBuilder,
    CardColorBuilder,
    CardColorDbBuilder,
    CardDbBuilder,
  ],
  providers: [
    CardArrayFromCardDbStringifiedArrayBuilder,
    CardBuilder,
    CardColorBuilder,
    CardColorDbBuilder,
    CardDbBuilder,
  ],
})
export class CardDbModule {}

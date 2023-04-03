import { Injectable } from '@nestjs/common';
import { models as apiModels } from '@one-game-js/api-models';
import { Builder } from '@one-game-js/backend-common';

import { CardColor } from '../../domain/models/CardColor';

@Injectable()
export class CardColorFromCardColorV1Builder
  implements Builder<CardColor, [apiModels.CardColorV1]>
{
  public build(cardColorV1: apiModels.CardColorV1): CardColor {
    switch (cardColorV1) {
      case 'blue':
        return CardColor.blue;
      case 'green':
        return CardColor.green;
      case 'red':
        return CardColor.red;
      case 'yellow':
        return CardColor.yellow;
    }
  }
}

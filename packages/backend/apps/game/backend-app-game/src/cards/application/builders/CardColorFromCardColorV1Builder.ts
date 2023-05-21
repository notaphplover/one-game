import { models as apiModels } from '@cornie-js/api-models';
import { CardColor } from '@cornie-js/backend-app-game-models/cards/domain';
import { Builder } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

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

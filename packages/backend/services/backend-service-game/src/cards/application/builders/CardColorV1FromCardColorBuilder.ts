import { Injectable } from '@nestjs/common';
import { models as apiModels } from '@one-game-js/api-models';
import { Builder } from '@one-game-js/backend-common';

import { CardColor } from '../../domain/models/CardColor';

@Injectable()
export class CardColorV1FromCardColorBuilder
  implements Builder<apiModels.CardColorV1, [CardColor]>
{
  public build(cardColor: CardColor): apiModels.CardColorV1 {
    switch (cardColor) {
      case CardColor.blue:
        return 'blue';
      case CardColor.green:
        return 'green';
      case CardColor.red:
        return 'red';
      case CardColor.yellow:
        return 'yellow';
    }
  }
}

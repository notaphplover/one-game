import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { CardColor } from '@cornie-js/backend-game-domain/cards';
import { Injectable } from '@nestjs/common';

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

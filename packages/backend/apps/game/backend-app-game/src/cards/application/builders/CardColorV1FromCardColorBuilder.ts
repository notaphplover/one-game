import { models as apiModels } from '@cornie-js/api-models';
import { CardColor } from '@cornie-js/backend-app-game-domain/cards/domain';
import { Builder } from '@cornie-js/backend-common';
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

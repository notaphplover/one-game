import { models as apiModels } from '@cornie-js/api-models';
import { Card } from '@cornie-js/backend-game-domain/cards';

export interface CardV1Parameter {
  card: Card;
  cardV1: apiModels.CardV1;
}

import { models as apiModels } from '@cornie-js/api-models';
import { Card } from '@cornie-js/backend-game-domain/cards';

export interface CardArrayV1Parameter {
  cards: Card[];
  cardsV1: apiModels.CardArrayV1;
}

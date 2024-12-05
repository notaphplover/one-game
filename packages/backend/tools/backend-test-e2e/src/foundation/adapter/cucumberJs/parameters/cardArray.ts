import { models as apiModels } from '@cornie-js/api-models';
import { Card } from '@cornie-js/backend-game-domain/cards';
import { defineParameterType } from '@cucumber/cucumber';
import { IParameterTypeDefinition } from '@cucumber/cucumber/lib/support_code_library_builder/types';

import { CardArrayV1Parameter } from '../../../../card/models/CardArrayV1Parameter';
import { parseCard } from '../../../../card/utils/calculations/parseCard';

const CARD_REGEXP: RegExp = /(WD|W|(?:[0-9]|D|S|R)(?:b|g|r|y))/g;
const CARDS_REGEXP: RegExp =
  /"(\( (?:(?:WD|W|(?:[0-9]|D|S|R)(?:b|g|r|y)) )*\))"/;

function cardsParamDefinitionTransformer(
  stringifiedCards: string,
): CardArrayV1Parameter {
  const cardMatches: IterableIterator<RegExpMatchArray> =
    stringifiedCards.matchAll(CARD_REGEXP);

  const cards: [Card, apiModels.CardV1][] = [...cardMatches].map(
    (regExpMatchArray: RegExpMatchArray): [Card, apiModels.CardV1] =>
      parseCard(regExpMatchArray[0]),
  );

  return {
    cards: cards.map(([card]: [Card, apiModels.CardV1]) => card),
    cardsV1: cards.map(([, cardV1]: [Card, apiModels.CardV1]) => cardV1),
  };
}

const cardsParameterDefinition: IParameterTypeDefinition<CardArrayV1Parameter> =
  {
    name: 'cards',
    regexp: CARDS_REGEXP,
    transformer: cardsParamDefinitionTransformer,
  };

defineParameterType(cardsParameterDefinition);

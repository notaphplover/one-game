import { models as apiModels } from '@cornie-js/api-models';
import { Card } from '@cornie-js/backend-game-domain/cards';
import { defineParameterType } from '@cucumber/cucumber';
import { IParameterTypeDefinition } from '@cucumber/cucumber/lib/support_code_library_builder/types';

import { CardV1Parameter } from '../../../../card/models/CardV1Parameter';
import { parseCard } from '../../../../card/utils/calculations/parseCard';

const CARD_REGEXP: RegExp = /"(WD|W|(?:[0-9]|D|S|R)(?:b|g|r|y))"/;

function cardParamDefinitionTransformer(
  stringifiedCards: string,
): CardV1Parameter {
  const [card, cardV1]: [Card, apiModels.CardV1] = parseCard(stringifiedCards);
  return {
    card,
    cardV1,
  };
}

const cardsParameterDefinition: IParameterTypeDefinition<CardV1Parameter> = {
  name: 'card',
  regexp: CARD_REGEXP,
  transformer: cardParamDefinitionTransformer,
};

defineParameterType(cardsParameterDefinition);

import { models as apiModels } from '@cornie-js/api-models';
import { MouseEvent } from 'react';

import { getCardColorClassName } from '../helpers/getCardColorClassName';
import { TextCard } from './TextCard';

export interface NormalCardOptions {
  card: apiModels.NormalCardV1;
  onDoubleClick?: ((event: MouseEvent) => void) | undefined;
}

export const NormalCard = (params: NormalCardOptions) => {
  return (
    <TextCard
      text={params.card.number.toString()}
      colorClass={getCardColorClassName(params.card.color)}
      onDoubleClick={params.onDoubleClick}
    ></TextCard>
  );
};

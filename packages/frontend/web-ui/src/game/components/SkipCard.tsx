import { models as apiModels } from '@cornie-js/api-models';

import { getCardColorClassName } from '../helpers/getCardColorClassName';
import { getImageCardUrl } from '../helpers/getImageCardUrl';
import { ImageCard } from './ImageCard';

export interface SkipCardOptions {
  card: apiModels.SkipCardV1;
  onDoubleClick?: ((event: MouseEvent) => void) | undefined;
}

export const SkipCard = (params: SkipCardOptions) => {
  return (
    <ImageCard
      image={getImageCardUrl(params.card)}
      colorClass={getCardColorClassName(params.card.color)}
      onDoubleClick={() => params.onDoubleClick}
    ></ImageCard>
  );
};

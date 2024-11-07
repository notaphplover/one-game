import { models as apiModels } from '@cornie-js/api-models';
import { MouseEvent } from 'react';

import { getImageCardUrl } from '../helpers/getImageCardUrl';
import { ImageCard } from './ImageCard';

export interface WildDraw4CardOptions {
  card: apiModels.WildDraw4CardV1;
  colorClass: 'white-color';
  onDoubleClick?: ((event: MouseEvent) => void) | undefined;
}

export const WildDraw4Card = (params: WildDraw4CardOptions) => {
  return (
    <ImageCard
      image={getImageCardUrl(params.card)}
      colorClass={params.colorClass}
      onDoubleClick={params.onDoubleClick}
    ></ImageCard>
  );
};

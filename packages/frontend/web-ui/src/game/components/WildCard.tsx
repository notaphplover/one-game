import { models as apiModels } from '@cornie-js/api-models';
import { MouseEvent } from 'react';

import { getImageCardUrl } from '../helpers/getImageCardUrl';
import { ImageCard } from './ImageCard';

export interface WildCardOptions {
  card: apiModels.WildCardV1;
  colorClass: 'white-color';
  isSelected?: boolean | undefined;
  onDoubleClick?: ((event: MouseEvent) => void) | undefined;
}

export const WildCard = (params: WildCardOptions) => {
  return (
    <ImageCard
      image={getImageCardUrl(params.card)}
      colorClass={params.colorClass}
      isSelected={params.isSelected}
      onDoubleClick={params.onDoubleClick}
    ></ImageCard>
  );
};

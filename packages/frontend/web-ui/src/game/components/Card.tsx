import { models as apiModels } from '@cornie-js/api-models';
import { MouseEvent } from 'react';

import { DrawCard } from './DrawCard';
import { NormalCard } from './NormalCard';
import { ReverseCard } from './ReverseCard';
import { SkipCard } from './SkipCard';
import { WildCard } from './WildCard';
import { WildDraw4Card } from './WildDraw4Card';

export interface CardOptions {
  card: apiModels.CardV1;
  onDoubleClick?: (event: MouseEvent) => void;
}

export const Card = (params: CardOptions) => {
  switch (params.card.kind) {
    case 'draw':
      return (
        <DrawCard
          card={params.card}
          onDoubleClick={params.onDoubleClick}
        ></DrawCard>
      );
    case 'normal':
      return (
        <NormalCard
          card={params.card}
          onDoubleClick={params.onDoubleClick}
        ></NormalCard>
      );
    case 'reverse':
      return (
        <ReverseCard
          card={params.card}
          onDoubleClick={params.onDoubleClick}
        ></ReverseCard>
      );
    case 'skip':
      return (
        <SkipCard
          card={params.card}
          onDoubleClick={params.onDoubleClick}
        ></SkipCard>
      );
    case 'wild':
      return (
        <WildCard
          card={params.card}
          colorClass="white-color"
          onDoubleClick={params.onDoubleClick}
        ></WildCard>
      );
    case 'wildDraw4':
      return (
        <WildDraw4Card
          card={params.card}
          colorClass="white-color"
          onDoubleClick={params.onDoubleClick}
        ></WildDraw4Card>
      );
  }
};

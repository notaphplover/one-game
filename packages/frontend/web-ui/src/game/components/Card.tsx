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
  isSelected?: boolean | undefined;
  onClick?: (event: MouseEvent) => void;
}

export const Card = (params: CardOptions) => {
  switch (params.card.kind) {
    case 'draw':
      return (
        <DrawCard
          card={params.card}
          isSelected={params.isSelected}
          onClick={params.onClick}
        ></DrawCard>
      );
    case 'normal':
      return (
        <NormalCard
          card={params.card}
          isSelected={params.isSelected}
          onClick={params.onClick}
        ></NormalCard>
      );
    case 'reverse':
      return (
        <ReverseCard
          card={params.card}
          isSelected={params.isSelected}
          onClick={params.onClick}
        ></ReverseCard>
      );
    case 'skip':
      return (
        <SkipCard
          card={params.card}
          isSelected={params.isSelected}
          onClick={params.onClick}
        ></SkipCard>
      );
    case 'wild':
      return (
        <WildCard
          card={params.card}
          colorClass="white-color"
          isSelected={params.isSelected}
          onClick={params.onClick}
        ></WildCard>
      );
    case 'wildDraw4':
      return (
        <WildDraw4Card
          card={params.card}
          colorClass="white-color"
          isSelected={params.isSelected}
          onClick={params.onClick}
        ></WildDraw4Card>
      );
  }
};

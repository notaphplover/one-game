import { models as apiModels } from '@cornie-js/api-models';

import { DrawCard } from './DrawCard';
import { NormalCard } from './NormalCard';
import { ReverseCard } from './ReverseCard';
import { SkipCard } from './SkipCard';
import { WildCard } from './WildCard';
import { WildDraw4Card } from './WildDraw4Card';

export interface CardOptions {
  card: apiModels.CardV1;
}

export const Card = (params: CardOptions) => {
  switch (params.card.kind) {
    case 'draw':
      return <DrawCard card={params.card}></DrawCard>;
    case 'normal':
      return <NormalCard card={params.card}></NormalCard>;
    case 'reverse':
      return <ReverseCard card={params.card}></ReverseCard>;
    case 'skip':
      return <SkipCard card={params.card}></SkipCard>;
    case 'wild':
      return <WildCard card={params.card} colorClass="white-color"></WildCard>;
    case 'wildDraw4':
      return (
        <WildDraw4Card
          card={params.card}
          colorClass="white-color"
        ></WildDraw4Card>
      );
  }
};

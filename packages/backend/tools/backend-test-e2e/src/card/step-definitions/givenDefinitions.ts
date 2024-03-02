import { Given } from '@cucumber/cucumber';

import { OneGameApiWorld } from '../../http/models/OneGameApiWorld';
import { CardArrayV1Parameter } from '../models/CardArrayV1Parameter';
import { setCardArray } from '../utils/actions/setCardArray';

Given<OneGameApiWorld>(
  'a list of cards {cards} as {string}',
  function (
    this: OneGameApiWorld,
    cards: CardArrayV1Parameter,
    alias: string,
  ): void {
    setCardArray.bind(this)(alias, cards);
  },
);

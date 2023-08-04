import { DrawCard } from './DrawCard';
import { NormalCard } from './NormalCard';
import { ReverseCard } from './ReverseCard';
import { SkipCard } from './SkipCard';
import { WildCard } from './WildCard';
import { WildDraw4Card } from './WildDraw4Card';

export type Card =
  | DrawCard
  | NormalCard
  | ReverseCard
  | SkipCard
  | WildCard
  | WildDraw4Card;

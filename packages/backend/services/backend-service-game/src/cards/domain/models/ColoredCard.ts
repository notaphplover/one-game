import { BaseCard } from './BaseCard';
import { CardColor } from './CardColor';
import { CardKind } from './CardKind';

export interface ColoredCard<TKind extends CardKind = CardKind>
  extends BaseCard<TKind> {
  readonly color: CardColor;
}

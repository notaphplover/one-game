import { CardKind } from './CardKind';
import { ColoredCard } from './ColoredCard';

export interface NormalCard extends ColoredCard<CardKind.normal> {
  readonly number: number;
}

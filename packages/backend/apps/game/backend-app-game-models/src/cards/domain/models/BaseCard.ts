import { CardKind } from './CardKind';

export interface BaseCard<TKind extends CardKind = CardKind> {
  readonly kind: TKind;
}

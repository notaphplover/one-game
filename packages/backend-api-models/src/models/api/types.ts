/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the generation script to regenerate this file.
 */

export type Types = TypesV1;
export type TypesV1 =
  | BlankCardV1
  | CardArrayV1
  | CardV1
  | DrawCardV1
  | NormalCardV1
  | ReverseCardV1
  | SkipCardV1
  | WildCardV1
  | WildDraw4CardV1
  | ErrorV1
  | ActiveGameSlotCardsV1
  | ActiveGameSlotV1
  | ActiveGameV1
  | GameCardSpecV1
  | GameCreateQueryV1
  | GameDirectionV1
  | GameIdDrawCardsQueryV1
  | GameIdPassTurnQueryV1
  | GameIdPlayCardsQueryV1
  | GameIdSlotIdUpdateQueryV1
  | GameIdUpdateQueryV1
  | GameSlotV1
  | GameSpecV1
  | GameV1
  | NonStartedGameSlotV1
  | NonStartedGameV1
  | UserCreateQueryV1
  | UserIdTokenCreateQueryV1
  | UserIdUpdateQueryV1
  | UserV1;
export type BlankCardV1 = BaseCardV1 & {
  kind?: 'blank';
  [k: string]: unknown | undefined;
} & {
  kind: unknown;
};
export type CardKindV1 =
  | 'blank'
  | 'draw'
  | 'normal'
  | 'reverse'
  | 'skip'
  | 'wild'
  | 'wildDraw4';
export type CardV1 =
  | BlankCardV1
  | DrawCardV1
  | NormalCardV1
  | ReverseCardV1
  | SkipCardV1
  | WildCardV1
  | WildDraw4CardV1;
export type DrawCardV1 = ColoredCardV1 & {
  kind?: 'draw';
  [k: string]: unknown | undefined;
} & {
  color: unknown;
  kind: unknown;
};
export type ColoredCardV1 = BaseCardV1 & {
  color: CardColorV1;
  [k: string]: unknown | undefined;
};
export type CardColorV1 = 'blue' | 'green' | 'red' | 'yellow';
export type NormalCardV1 = ColoredCardV1 & {
  kind?: 'normal';
  number?: CardNumberV1;
  [k: string]: unknown | undefined;
} & {
  color: unknown;
  kind: unknown;
  number: unknown;
};
export type CardNumberV1 = number;
export type ReverseCardV1 = ColoredCardV1 & {
  kind?: 'reverse';
  [k: string]: unknown | undefined;
} & {
  color: unknown;
  kind: unknown;
};
export type SkipCardV1 = ColoredCardV1 & {
  kind?: 'skip';
  [k: string]: unknown | undefined;
} & {
  color: unknown;
  kind: unknown;
};
export type WildCardV1 = BaseCardV1 & {
  kind?: 'wild';
  [k: string]: unknown | undefined;
} & {
  kind: unknown;
};
export type WildDraw4CardV1 = BaseCardV1 & {
  kind?: 'wildDraw4';
  [k: string]: unknown | undefined;
} & {
  kind: unknown;
};
export type CardArrayV1 = CardV1[];
export type ActiveGameSlotCardsV1 = CardV1[];
export type GameDirectionV1 = 'antiClockwise' | 'clockwise';
export type GameIdUpdateQueryV1 =
  | GameIdDrawCardsQueryV1
  | GameIdPassTurnQueryV1
  | GameIdPlayCardsQueryV1;
export type GameSlotV1 = ActiveGameSlotV1 | NonStartedGameSlotV1;
export type GameV1 = ActiveGameV1 | NonStartedGameV1;

export interface BaseCardV1 {
  kind: CardKindV1;
  [k: string]: unknown | undefined;
}
export interface ErrorV1 {
  code: string;
  description: string;
  parameters?: {
    [k: string]: unknown | undefined;
  };
}
export interface ActiveGameSlotV1 {
  cardsAmount: number;
  userId: string;
}
export interface ActiveGameV1 {
  currentCard: CardV1;
  currentColor: CardColorV1;
  currentDirection: GameDirectionV1;
  currentPlayingSlotIndex: number;
  gameSpec: GameSpecV1;
  gameSlotsAmount: number;
  id: string;
}
export interface GameSpecV1 {
  cardSpecs: GameCardSpecV1[];
}
export interface GameCardSpecV1 {
  amount: number;
  card: CardV1;
}
export interface GameCreateQueryV1 {
  gameSlotsAmount: number;
  gameSpec: GameSpecV1;
}
export interface GameIdDrawCardsQueryV1 {
  kind: 'drawCards';
  slotIndex: number;
}
export interface GameIdPassTurnQueryV1 {
  kind: 'passTurn';
  slotIndex: number;
}
export interface GameIdPlayCardsQueryV1 {
  cardIndexes: number[];
  kind: 'playCards';
  slotIndex: number;
}
export interface GameIdSlotIdUpdateQueryV1 {
  userId: null | string;
}
export interface NonStartedGameSlotV1 {
  userId: null | string;
}
export interface NonStartedGameV1 {
  gameSlotsAmount: number;
  gameSpec: GameSpecV1;
  id: string;
}
export interface UserCreateQueryV1 {
  email: string;
  name: string;
  password: string;
}
export interface UserIdTokenCreateQueryV1 {
  email: string;
  password: string;
}
export interface UserIdUpdateQueryV1 {
  code?: string;
  name?: string;
}
export interface UserV1 {
  id: string;
  name: string;
}

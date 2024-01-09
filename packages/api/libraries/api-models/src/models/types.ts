/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the generation script to regenerate this file.
 */

export type Types = TypesV1;
export type TypesV1 =
  | AuthCreateQueryV1
  | AuthV1
  | CodeAuthCreateQueryV1
  | EmailPasswordAuthCreateQueryV1
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
  | ActiveGameStateV1
  | ActiveGameV1
  | FinishedGameSlotV1
  | FinishedGameStateV1
  | FinishedGameV1
  | GameArrayV1
  | GameCardSpecV1
  | GameCreateQueryV1
  | GameDirectionV1
  | GameIdSlotCreateQueryV1
  | GameIdPassTurnQueryV1
  | GameIdPlayCardsQueryV1
  | GameIdUpdateQueryV1
  | GameMessageEventV1
  | GameOptionsV1
  | GameSlotV1
  | GameSpecArrayV1
  | GameSpecV1
  | GameSpecSortOptionV1
  | GameUpdatedMessageEventV1
  | GameV1
  | NonStartedGameSlotV1
  | NonStartedGameStateV1
  | NonStartedGameV1
  | UserCreateQueryV1
  | UserMeUpdateQueryV1
  | UserV1;
export type AuthCreateQueryV1 =
  | CodeAuthCreateQueryV1
  | EmailPasswordAuthCreateQueryV1;
export type CardV1 =
  | DrawCardV1
  | NormalCardV1
  | ReverseCardV1
  | SkipCardV1
  | WildCardV1
  | WildDraw4CardV1;
export type CardColorV1 = 'blue' | 'green' | 'red' | 'yellow';
export type CardNumberV1 = number;
export type CardArrayV1 = CardV1[];
export type ActiveGameSlotCardsV1 = CardV1[];
export type GameDirectionV1 = 'antiClockwise' | 'clockwise';
export type GameV1 = ActiveGameV1 | FinishedGameV1 | NonStartedGameV1;
export type GameArrayV1 = GameV1[];
export type GameIdUpdateQueryV1 =
  | GameIdPassTurnQueryV1
  | GameIdPlayCardsQueryV1;
export type GameMessageEventV1 = GameUpdatedMessageEventV1;
export type GameSlotV1 =
  | ActiveGameSlotV1
  | FinishedGameSlotV1
  | NonStartedGameSlotV1;
export type GameSpecArrayV1 = GameSpecV1[];
export type GameSpecSortOptionV1 = 'gameIds';

export interface CodeAuthCreateQueryV1 {
  code: string;
}
export interface EmailPasswordAuthCreateQueryV1 {
  email: string;
  password: string;
}
export interface AuthV1 {
  jwt: string;
}
export interface DrawCardV1 {
  color: CardColorV1;
  kind: 'draw';
}
export interface NormalCardV1 {
  color: CardColorV1;
  kind: 'normal';
  number: CardNumberV1;
}
export interface ReverseCardV1 {
  color: CardColorV1;
  kind: 'reverse';
}
export interface SkipCardV1 {
  color: CardColorV1;
  kind: 'skip';
}
export interface WildCardV1 {
  kind: 'wild';
}
export interface WildDraw4CardV1 {
  kind: 'wildDraw4';
}
export interface ErrorV1 {
  code?: string;
  description: string;
  parameters?: {
    [k: string]: unknown | undefined;
  };
}
export interface ActiveGameSlotV1 {
  cardsAmount: number;
  userId: string;
}
export interface ActiveGameStateV1 {
  currentCard: CardV1;
  currentColor: CardColorV1;
  currentDirection: GameDirectionV1;
  currentPlayingSlotIndex: number;
  currentTurnCardsPlayed: boolean;
  drawCount: number;
  slots: ActiveGameSlotV1[];
  status: 'active';
}
export interface ActiveGameV1 {
  id: string;
  name?: string;
  state: ActiveGameStateV1;
}
export interface FinishedGameSlotV1 {
  cardsAmount: number;
  userId: string;
}
export interface FinishedGameStateV1 {
  slots: FinishedGameSlotV1[];
  status: 'finished';
}
export interface FinishedGameV1 {
  id: string;
  name?: string;
  state: FinishedGameStateV1;
}
export interface NonStartedGameV1 {
  id: string;
  name?: string;
  state: NonStartedGameStateV1;
}
export interface NonStartedGameStateV1 {
  slots: NonStartedGameSlotV1[];
  status: 'nonStarted';
}
export interface NonStartedGameSlotV1 {
  userId: string;
}
export interface GameCardSpecV1 {
  amount: number;
  card: CardV1;
}
export interface GameCreateQueryV1 {
  gameSlotsAmount: number;
  name?: string;
  options: GameOptionsV1;
}
export interface GameOptionsV1 {
  chainDraw2Draw2Cards: boolean;
  chainDraw2Draw4Cards: boolean;
  chainDraw4Draw2Cards: boolean;
  chainDraw4Draw4Cards: boolean;
  playCardIsMandatory: boolean;
  playMultipleSameCards: boolean;
  playWildDraw4IfNoOtherAlternative: boolean;
}
export interface GameIdSlotCreateQueryV1 {
  userId: string;
}
export interface GameIdPassTurnQueryV1 {
  kind: 'passTurn';
  slotIndex: number;
}
export interface GameIdPlayCardsQueryV1 {
  cardIndexes: number[];
  colorChoice?: CardColorV1;
  kind: 'playCards';
  slotIndex: number;
}
export interface GameUpdatedMessageEventV1 {
  game: GameV1;
  kind: 'game-updated';
}
export interface GameSpecV1 {
  cardSpecs: GameCardSpecV1[];
  gameId: string;
  gameSlotsAmount: number;
  options: GameOptionsV1;
}
export interface UserCreateQueryV1 {
  email: string;
  name: string;
  password: string;
}
export interface UserMeUpdateQueryV1 {
  active?: true;
  name?: string;
}
export interface UserV1 {
  active: boolean;
  id: string;
  name: string;
}

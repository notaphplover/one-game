/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the generation script to regenerate this file.
 */

export type Types = TypesV1;
export type TypesV1 =
  | AuthV1
  | AuthCreateQueryV1
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
  | GameIdSlotCreateQueryV1
  | GameIdPassTurnQueryV1
  | GameIdPlayCardsQueryV1
  | GameIdUpdateQueryV1
  | GameOptionsV1
  | GameSlotV1
  | GameSpecV1
  | GameV1
  | NonStartedGameSlotV1
  | NonStartedGameV1
  | UserCreateQueryV1
  | UserMeUpdateQueryV1
  | UserV1;
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
export type GameIdUpdateQueryV1 =
  | GameIdDrawCardsQueryV1
  | GameIdPassTurnQueryV1
  | GameIdPlayCardsQueryV1;
export type GameSlotV1 = ActiveGameSlotV1 | NonStartedGameSlotV1;
export type GameV1 = ActiveGameV1 | NonStartedGameV1;

export interface AuthV1 {
  jwt: string;
}
export interface AuthCreateQueryV1 {
  email: string;
  password: string;
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
export interface ActiveGameV1 {
  currentCard: CardV1;
  currentColor: CardColorV1;
  currentDirection: GameDirectionV1;
  currentPlayingSlotIndex: number;
  currentTurnCardsPlayed: boolean;
  drawCount: number;
  gameSpec: GameSpecV1;
  gameSlotsAmount: number;
  id: string;
  slots: ActiveGameSlotV1[];
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
export interface GameIdDrawCardsQueryV1 {
  kind: 'drawCards';
  slotIndex: number;
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
  kind: 'playCards';
  slotIndex: number;
}
export interface NonStartedGameSlotV1 {
  userId: null | string;
}
export interface NonStartedGameV1 {
  gameSlotsAmount: number;
  gameSpec: GameSpecV1;
  id: string;
  slots: NonStartedGameSlotV1[];
}
export interface UserCreateQueryV1 {
  email: string;
  name: string;
  password: string;
}
export interface UserMeUpdateQueryV1 {
  name?: string;
}
export interface UserV1 {
  id: string;
  name: string;
}

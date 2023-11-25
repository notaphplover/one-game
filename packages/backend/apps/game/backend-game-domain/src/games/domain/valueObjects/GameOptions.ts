export interface GameOptions {
  readonly chainDraw2Draw2Cards: boolean;
  readonly chainDraw2Draw4Cards: boolean;
  readonly chainDraw4Draw2Cards: boolean;
  readonly chainDraw4Draw4Cards: boolean;
  readonly playCardIsMandatory: boolean;
  readonly playMultipleSameCards: boolean;
  readonly playWildDraw4IfNoOtherAlternative: boolean;
}

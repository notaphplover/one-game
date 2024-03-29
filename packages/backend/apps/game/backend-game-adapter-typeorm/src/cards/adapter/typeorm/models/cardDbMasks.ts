export const CARD_V1_MASK: number = 0x0000;

export const COLORED_CARD_TYPE_MASK: number = 0x0000;
export const UNCOLORED_CARD_TYPE_MASK: number = 0x0100;

export const COLORED_NUMBERED_SUBTYPE_MASK: number = 0x0000;
export const COLORED_NON_NUMBERED_SUBTYPE_MASK: number = 0x0040;
export const COLORED_BLUE_SUBTYPE_MASK: number = 0x0000;
export const COLORED_GREEN_SUBTYPE_MASK: number = 0x0010;
export const COLORED_RED_SUBTYPE_MASK: number = 0x0020;
export const COLORED_YELLOW_SUBTYPE_MASK: number = 0x0030;

export const COLORED_NON_NUMBERED_DRAW_VALUE_MASK: number = 0x0000;
export const COLORED_NON_NUMBERED_REVERSE_VALUE_MASK: number = 0x0001;
export const COLORED_NON_NUMBERED_SKIP_VALUE_MASK: number = 0x0002;

export const NON_COLORED_WILD_VALUE_MASK: number = 0x0001;
export const NON_COLORED_WILD_DRAW_4_VALUE_MASK: number = 0x0002;

export const CARD_VERSION_MASK: number = 0x7000;
export const CARD_TYPE_MASK: number = 0x0f00;
export const CARD_SUBTYPE_MASK: number = 0x00f0;

export const CARD_IS_NUMBERED_SUBTYPE: number = 0x0040;
export const CARD_COLOR_SUBTYPE: number = 0x0030;

export const CARD_VALUE_MASK: number = 0x000f;

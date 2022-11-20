export type JsonValue = null | boolean | number | string | JsonValueObject;

export interface JsonValueObject {
  [key: string]: JsonValue;
}

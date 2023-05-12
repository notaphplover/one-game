export interface UuidProviderOutputPort {
  generateV4(): string;
}

export const uuidProviderOutputPortSymbol: symbol = Symbol.for(
  'UuidProviderOutputPort',
);

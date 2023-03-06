export interface BcryptHashProviderOutputPort {
  hash(input: string): Promise<string>;
}

export const bcryptHashProviderOutputPortSymbol: symbol = Symbol.for(
  'BcryptHashProviderOutputPort',
);

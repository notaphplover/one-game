export interface BcryptHashProviderOutputPort {
  hash(input: string): Promise<string>;
  verify(input: string, hash: string): Promise<boolean>;
}

export const bcryptHashProviderOutputPortSymbol: symbol = Symbol.for(
  'BcryptHashProviderOutputPort',
);

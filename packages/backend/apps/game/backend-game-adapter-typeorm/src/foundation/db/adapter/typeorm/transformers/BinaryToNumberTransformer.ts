import { ValueTransformer } from 'typeorm';

const BINARY_BASE: number = 2;

export class BinaryToNumberTransformer implements ValueTransformer {
  readonly #size: number;

  constructor(size: number) {
    this.#size = size;
  }

  public from(value: string | null): number | null {
    if (value === null) {
      return null;
    }

    return parseInt(value, BINARY_BASE);
  }

  public to(value: number | null): string | null {
    if (value === null) {
      return null;
    }

    return this.#pad(this.#toBinary(value), this.#size);
  }

  #pad(binary: string, size: number): string {
    let paddedBinary: string = '';

    while (paddedBinary.length < size - binary.length)
      paddedBinary = '0' + paddedBinary;

    return paddedBinary + binary;
  }

  #toBinary(value: number): string {
    return (value >>> 0).toString(BINARY_BASE);
  }
}

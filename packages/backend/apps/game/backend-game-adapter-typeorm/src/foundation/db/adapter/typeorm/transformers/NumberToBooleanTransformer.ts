import { ValueTransformer } from 'typeorm';

export class NumberToBooleanTransformer implements ValueTransformer {
  public from(value: number): boolean {
    if (value === 1) {
      return true;
    } else {
      return false;
    }
  }

  public to(value: boolean): number {
    if (value) {
      return 1;
    } else {
      return 0;
    }
  }
}

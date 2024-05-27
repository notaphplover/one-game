import { AppErrorKind } from './AppErrorKind';

export const isAppErrorSymbol: unique symbol = Symbol.for('isAppError');

export class AppError extends Error {
  public [isAppErrorSymbol]: true;

  public kind: AppErrorKind;

  constructor(kind: AppErrorKind, message?: string, options?: ErrorOptions) {
    super(message, options);

    this[isAppErrorSymbol] = true;
    this.kind = kind;
  }

  public static isAppError(value: unknown): value is AppError {
    return (
      typeof value === 'object' &&
      value !== null &&
      (value as Record<string | symbol, unknown>)[isAppErrorSymbol] === true
    );
  }

  public static isAppErrorOfKind(
    value: unknown,
    kind: AppErrorKind,
  ): value is AppError {
    return AppError.isAppError(value) && value.kind === kind;
  }
}

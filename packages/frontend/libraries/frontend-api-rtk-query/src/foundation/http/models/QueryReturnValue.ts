export type QueryReturnValue<T = unknown, TErr = unknown, TMeta = unknown> =
  | {
      error: TErr;
      data?: undefined;
      meta?: TMeta;
    }
  | {
      error?: undefined;
      data: T;
      meta?: TMeta;
    };

import { PayloadAction } from '@reduxjs/toolkit';

interface FullfilledMeta {
  requestStatus: 'fulfilled';
}

interface RejectedMeta {
  requestStatus: 'rejected';
}

export function isFullfilledPayloadAction<
  FP,
  RP,
  T extends string,
  FM extends FullfilledMeta,
  RM extends RejectedMeta,
>(
  payloadAction:
    | PayloadAction<FP, T, FM, never>
    | PayloadAction<RP, T, RM, never>,
): payloadAction is PayloadAction<FP, T, FM, never> {
  return (
    (
      payloadAction as
        | (PayloadAction<FP, T, FM, never> & { meta: FM })
        | (PayloadAction<RP, T, RM, never> & { meta: RM })
    ).meta.requestStatus === 'fulfilled'
  );
}

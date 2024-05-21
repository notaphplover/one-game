import { PayloadAction } from '@reduxjs/toolkit';

interface FullfilledMeta {
  requestStatus: 'fulfilled';
}

interface RejectedMeta {
  requestStatus: 'rejected';
}

export function isFullfilledPayloadAction<
  TFulfilledPayload,
  TRejectedPayload,
  T extends string,
  TFulfilledMeta extends FullfilledMeta,
  TRejectedMeta extends RejectedMeta,
>(
  payloadAction:
    | PayloadAction<TFulfilledPayload, T, TFulfilledMeta, never>
    | PayloadAction<TRejectedPayload, T, TRejectedMeta, never>,
): payloadAction is PayloadAction<TFulfilledPayload, T, TFulfilledMeta, never> {
  return (
    (
      payloadAction as
        | (PayloadAction<TFulfilledPayload, T, TFulfilledMeta, never> & {
            meta: TFulfilledMeta;
          })
        | (PayloadAction<TRejectedPayload, T, TRejectedMeta, never> & {
            meta: TRejectedMeta;
          })
    ).meta.requestStatus === 'fulfilled'
  );
}

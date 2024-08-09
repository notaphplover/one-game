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
    | PayloadAction<TFulfilledPayload, T, TFulfilledMeta>
    | PayloadAction<TRejectedPayload, T, TRejectedMeta>,
): payloadAction is PayloadAction<TFulfilledPayload, T, TFulfilledMeta> {
  return (
    (
      payloadAction as
        | (PayloadAction<TFulfilledPayload, T, TFulfilledMeta> & {
            meta: TFulfilledMeta;
          })
        | (PayloadAction<TRejectedPayload, T, TRejectedMeta> & {
            meta: TRejectedMeta;
          })
    ).meta.requestStatus === 'fulfilled'
  );
}

import { AppErrorKind } from '@cornie-js/frontend-common';

export interface SerializableAppError<
  TKind extends AppErrorKind = AppErrorKind,
> {
  kind: TKind;
  message: string;
}

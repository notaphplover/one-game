import { AppErrorKind } from '@cornie-js/frontend-common';

export interface SerializableAppError {
  kind: AppErrorKind;
  message: string;
}

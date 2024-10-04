import { SerializableAppError } from '@cornie-js/frontend-api-rtk-query';
import { AppErrorKind } from '@cornie-js/frontend-common';

export function isSerializableAppError(
  value: unknown,
): value is SerializableAppError {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const valueObject: Partial<SerializableAppError> =
    value as Partial<SerializableAppError>;

  return (
    valueObject.kind !== undefined &&
    Object.values(AppErrorKind).includes(valueObject.kind) &&
    typeof valueObject.message === 'string'
  );
}

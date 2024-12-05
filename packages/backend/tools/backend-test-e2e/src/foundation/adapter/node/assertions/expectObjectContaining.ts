import * as assert from 'node:assert/strict';

import { Expectations } from '../../../application/models/Expectations';

const ROOT_PATH: string = '/';

export function expectObjectContaining<T extends object>(
  object: T,
  expectations: Expectations<T>,
): void {
  expectObjectContainingAtPath(object, expectations, ROOT_PATH, object);
}

function expectObjectContainingAtPath<T extends object>(
  object: T,
  expectations: Expectations<T>,
  path: string,
  rootObject: object,
): void {
  for (const key of Reflect.ownKeys(expectations)) {
    if (!(key in object)) {
      assert.fail(`Expecting a property in

${JSON.stringify(rootObject)}

at path ${buildNextPath(path, key)}`);
    }

    const objectProperty: unknown = object[key as keyof T];
    const expectation: unknown = expectations[key as keyof T];

    if (isObject(expectation)) {
      const errorMessage: string = `Expecting an object in

${JSON.stringify(rootObject)}

at path ${buildNextPath(path, key)}`;

      assert.ok(isObject(objectProperty), errorMessage);

      expectObjectContainingAtPath(
        objectProperty,
        expectation,
        buildNextPath(path, key),
        rootObject,
      );

      continue;
    }

    if (typeof expectation === 'function') {
      if (objectProperty !== expectation) {
        (
          expectation as (
            value: unknown,
            path: string,
            rootObject: object,
          ) => void
        )(objectProperty, buildNextPath(path, key), rootObject);
      }

      continue;
    }

    const errorMessage: string = `Expecting an equality in

${JSON.stringify(rootObject)}

at path ${buildNextPath(path, key)}`;

    assert.ok(objectProperty === expectation, errorMessage);
  }
}

function buildNextPath(path: string, key: string | symbol): string {
  let nextPath: string;

  if (path === ROOT_PATH) {
    nextPath = `${path}${key.toString()}`;
  } else {
    nextPath = `${path}/${key.toString()}`;
  }

  return nextPath;
}

function isObject(value: unknown): value is object {
  return value !== null && typeof value === 'object';
}

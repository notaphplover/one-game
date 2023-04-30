import { JsonValue } from '@cornie-js/json-schema-utils';

const JSON_STRINGIFY_SPACES: number = 2;

const POINTER_REGEX: RegExp = /^#((?:\/[^\\/]+)*)$/;

export class JsonPointerResolver {
  public resolve(pointer: string, rootObject: JsonValue): JsonValue {
    const pointerElements: RegExpMatchArray | null =
      pointer.match(POINTER_REGEX);

    if (pointerElements === null) {
      throw new Error(
        `Invalid JSON pointer "${pointer}". Only Local refence JSON pointers are allowed.`,
      );
    }

    const fragment: string = pointerElements[1] as string;

    let paths: string[];

    if (fragment.length === 0) {
      paths = [];
    } else {
      paths = fragment.split('/').splice(1);
    }

    return this.#resolvePaths(rootObject, paths, 0);
  }

  #buildInvalidReferenceError(
    object: JsonValue,
    paths: readonly string[],
    path: string,
  ): Error {
    return new Error(`Invalid reference while resolving "${this.#buildJsonPointer(
      paths,
    )}".

No property ${path} was found in:

${JSON.stringify(object, undefined, JSON_STRINGIFY_SPACES)}`);
  }

  #buildJsonPointer(paths: readonly string[]): string {
    return `#/${paths.join('/')}`;
  }

  #resolvePaths(
    object: JsonValue,
    paths: readonly string[],
    index: number,
  ): JsonValue {
    if (index === paths.length) {
      return object;
    }

    const path: string | undefined = paths[index];

    if (path === undefined) {
      throw new Error(
        `Unexpected error resolving path "${this.#buildJsonPointer(paths)}"`,
      );
    }

    if (object === null || typeof object !== 'object') {
      throw this.#buildInvalidReferenceError(object, paths, path);
    }

    let childObject: JsonValue | undefined;

    if (Array.isArray(object)) {
      try {
        childObject = object[parseInt(path)];
      } catch (_error: unknown) {
        throw this.#buildInvalidReferenceError(object, paths, path);
      }
    } else {
      childObject = object[path];
    }

    if (childObject === undefined) {
      throw this.#buildInvalidReferenceError(object, paths, path);
    }

    return this.#resolvePaths(childObject, paths, index + 1);
  }
}

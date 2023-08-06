import { JsonValue } from '@cornie-js/json-schema-utils';
import {
  OpenApi3Dot1Object,
  OpenApi3Dot1ReferenceObject,
} from '@cornie-js/openapi-utils';

import { JsonPointerResolver } from './JsonPointerResolver';

export class OpenApiJsonPointerResolver extends JsonPointerResolver {
  public resolveDeep(
    pointer: string,
    rootObject: OpenApi3Dot1Object,
    uriToJsonMap: Map<string, JsonValue>,
  ): JsonValue {
    const resolvedValue: JsonValue = this.resolve(
      pointer,
      rootObject as unknown as JsonValue,
      uriToJsonMap,
    );

    if (
      resolvedValue === null ||
      typeof resolvedValue !== 'object' ||
      Array.isArray(resolvedValue)
    ) {
      return resolvedValue;
    }

    if (
      typeof (resolvedValue as Partial<OpenApi3Dot1ReferenceObject>).$ref ===
      'string'
    ) {
      return this.resolveDeep(
        (resolvedValue as unknown as OpenApi3Dot1ReferenceObject).$ref,
        rootObject,
        uriToJsonMap,
      );
    } else {
      return resolvedValue;
    }
  }
}

import {
  JsonRootSchema202012,
  JsonSchema202012,
} from '../../json-schema/models/JsonSchema202012';
import { TraverseJsonSchemaCallbackParams } from '../../json-schema/models/TraverseJsonSchemaCallbackParams';

export function traverseJsonSchema(
  schema: JsonRootSchema202012,
  callback: (params: TraverseJsonSchemaCallbackParams) => void,
): void {
  traverseSchema(
    {
      jsonPointer: '',
      parentJsonPointer: undefined,
      parentSchema: undefined,
      rootSchema: schema,
      schema: schema,
    },
    callback,
  );
}

function traverseSchema(
  params: TraverseJsonSchemaCallbackParams,
  callback: (params: TraverseJsonSchemaCallbackParams) => void,
): void {
  callback(params);

  if (params.schema !== true && params.schema !== false) {
    traverseDirectChildSchemaMap(
      params,
      params.schema.$defs,
      '$defs',
      callback,
    );

    traverseDirectChildSchema(
      params,
      params.schema.additionalProperties,
      'additionalProperties',
      callback,
    );

    traverseDirectChildSchemaArray(
      params,
      params.schema.allOf,
      'allOf',
      callback,
    );

    traverseDirectChildSchemaArray(
      params,
      params.schema.anyOf,
      'anyOf',
      callback,
    );

    traverseDirectChildSchema(
      params,
      params.schema.contains,
      'contains',
      callback,
    );

    traverseDirectChildSchemaMap(
      params,
      params.schema.dependentSchemas,
      'dependentSchemas',
      callback,
    );

    traverseDirectChildSchema(params, params.schema.else, 'else', callback);

    traverseDirectChildSchema(params, params.schema.if, 'if', callback);

    traverseDirectChildSchema(params, params.schema.items, 'items', callback);

    traverseDirectChildSchema(params, params.schema.not, 'not', callback);

    traverseDirectChildSchemaArray(
      params,
      params.schema.oneOf,
      'oneOf',
      callback,
    );

    traverseDirectChildSchemaMap(
      params,
      params.schema.patternProperties,
      'patternProperties',
      callback,
    );

    traverseDirectChildSchemaArray(
      params,
      params.schema.prefixItems,
      'prefixItems',
      callback,
    );

    traverseDirectChildSchemaMap(
      params,
      params.schema.properties,
      'properties',
      callback,
    );

    traverseDirectChildSchema(
      params,
      params.schema.propertyNames,
      'propertyNames',
      callback,
    );

    traverseDirectChildSchema(params, params.schema.then, 'then', callback);

    traverseDirectChildSchema(
      params,
      params.schema.unevaluatedItems,
      'unevaluatedItems',
      callback,
    );

    traverseDirectChildSchema(
      params,
      params.schema.unevaluatedProperties,
      'unevaluatedProperties',
      callback,
    );
  }
}

function traverseDirectChildSchema(
  params: TraverseJsonSchemaCallbackParams,
  childSchema: JsonSchema202012 | undefined,
  key: string,
  callback: (params: TraverseJsonSchemaCallbackParams) => void,
): void {
  if (childSchema !== undefined) {
    const traverseChildSchemaCallbackParams: TraverseJsonSchemaCallbackParams =
      {
        jsonPointer: `${params.jsonPointer}/${escapeJsonPtr(key)}`,
        parentJsonPointer: params.jsonPointer,
        parentSchema: params.schema,
        rootSchema: params.rootSchema,
        schema: childSchema,
      };

    traverseSchema(traverseChildSchemaCallbackParams, callback);
  }
}

function traverseDirectChildSchemaArray(
  params: TraverseJsonSchemaCallbackParams,
  childSchemas: JsonSchema202012[] | undefined,
  key: string,
  callback: (params: TraverseJsonSchemaCallbackParams) => void,
): void {
  if (childSchemas !== undefined) {
    for (const [index, schema] of childSchemas.entries()) {
      const traverseChildSchemaCallbackParams: TraverseJsonSchemaCallbackParams =
        {
          jsonPointer: `${params.jsonPointer}/${escapeJsonPtr(key)}/${index}`,
          parentJsonPointer: params.jsonPointer,
          parentSchema: params.schema,
          rootSchema: params.rootSchema,
          schema,
        };

      traverseSchema(traverseChildSchemaCallbackParams, callback);
    }
  }
}

function traverseDirectChildSchemaMap(
  params: TraverseJsonSchemaCallbackParams,
  schemasMap: Record<string, JsonSchema202012> | undefined,
  key: string,
  callback: (params: TraverseJsonSchemaCallbackParams) => void,
): void {
  if (schemasMap !== undefined) {
    for (const [mapKey, schema] of Object.entries(schemasMap)) {
      const traverseChildSchemaCallbackParams: TraverseJsonSchemaCallbackParams =
        {
          jsonPointer: `${params.jsonPointer}/${escapeJsonPtr(key)}/${mapKey}`,
          parentJsonPointer: params.jsonPointer,
          parentSchema: params.schema,
          rootSchema: params.rootSchema,
          schema,
        };

      traverseSchema(traverseChildSchemaCallbackParams, callback);
    }
  }
}

function escapeJsonPtr(str: string): string {
  return str.replace(/~/g, '~0').replace(/\//g, '~1');
}

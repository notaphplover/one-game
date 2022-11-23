import {
  JsonRootSchema202012,
  JsonRootSchema202012KnownPropertiesObject,
  JsonRootSchema202012Object,
  JsonSchema202012,
} from '../models/JsonSchema202012';
import { TraverseJsonSchemaCallbackParams } from '../models/TraverseJsonSchemaCallbackParams';

type JsonRootSchema202012SchemaProperty =
  | JsonSchema202012
  | JsonSchema202012[]
  | Record<string, JsonSchema202012>;

type JsonRootSchema202012SchemaPropertyHandler = (
  params: TraverseJsonSchemaCallbackParams,
  childSchema: JsonRootSchema202012SchemaProperty,
  key: string,
  callback: (params: TraverseJsonSchemaCallbackParams) => void,
) => void;

const jsonRootSchema202012ObjectPropertyToHandlerMap: {
  [TKey in keyof JsonRootSchema202012KnownPropertiesObject]?: (
    params: TraverseJsonSchemaCallbackParams,
    childSchema: Exclude<JsonRootSchema202012Object[TKey], undefined>,
    key: string,
    callback: (params: TraverseJsonSchemaCallbackParams) => void,
  ) => void;
} = {
  $defs: traverseDirectChildSchemaMap,
  additionalProperties: traverseDirectChildSchema,
  allOf: traverseDirectChildSchemaArray,
  anyOf: traverseDirectChildSchemaArray,
  contains: traverseDirectChildSchema,
  dependentSchemas: traverseDirectChildSchemaMap,
  else: traverseDirectChildSchema,
  if: traverseDirectChildSchema,
  items: traverseDirectChildSchema,
  not: traverseDirectChildSchema,
  oneOf: traverseDirectChildSchemaArray,
  patternProperties: traverseDirectChildSchemaMap,
  prefixItems: traverseDirectChildSchemaArray,
  properties: traverseDirectChildSchemaMap,
  propertyNames: traverseDirectChildSchema,
  then: traverseDirectChildSchema,
  unevaluatedItems: traverseDirectChildSchema,
  unevaluatedProperties: traverseDirectChildSchema,
};

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
    for (const key of Object.keys(params.schema)) {
      const handler: JsonRootSchema202012SchemaPropertyHandler | undefined =
        jsonRootSchema202012ObjectPropertyToHandlerMap[
          key as keyof JsonRootSchema202012KnownPropertiesObject
        ] as JsonRootSchema202012SchemaPropertyHandler | undefined;

      if (handler !== undefined) {
        handler(
          params,
          params.schema[key] as JsonRootSchema202012SchemaProperty,
          key,
          callback,
        );
      }
    }
  }
}

function traverseDirectChildSchema(
  params: TraverseJsonSchemaCallbackParams,
  childSchema: JsonSchema202012,
  key: string,
  callback: (params: TraverseJsonSchemaCallbackParams) => void,
): void {
  const traverseChildSchemaCallbackParams: TraverseJsonSchemaCallbackParams = {
    jsonPointer: `${params.jsonPointer}/${escapeJsonPtr(key)}`,
    parentJsonPointer: params.jsonPointer,
    parentSchema: params.schema,
    rootSchema: params.rootSchema,
    schema: childSchema,
  };

  traverseSchema(traverseChildSchemaCallbackParams, callback);
}

function traverseDirectChildSchemaArray(
  params: TraverseJsonSchemaCallbackParams,
  childSchemas: JsonSchema202012[],
  key: string,
  callback: (params: TraverseJsonSchemaCallbackParams) => void,
): void {
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

function traverseDirectChildSchemaMap(
  params: TraverseJsonSchemaCallbackParams,
  schemasMap: Record<string, JsonSchema202012>,
  key: string,
  callback: (params: TraverseJsonSchemaCallbackParams) => void,
): void {
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

function escapeJsonPtr(str: string): string {
  return str.replace(/~/g, '~0').replace(/\//g, '~1');
}

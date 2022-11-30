import { JsonValue } from '@one-game-js/json-schema-utils';

import { OpenApi3Dot1EncodingObject } from './OpenApi3Dot1EncodingObject';
import { OpenApi3Dot1ExampleObject } from './OpenApi3Dot1ExampleObject';
import { OpenApi3Dot1ReferenceObject } from './OpenApi3Dot1ReferenceObject';
import { OpenApi3Dot1SchemaObject } from './OpenApi3Dot1SchemaObject';

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#mediaTypeObject
export interface OpenApi3Dot1MediaTypeObject {
  encoding?: Map<string, OpenApi3Dot1EncodingObject>;
  example?: JsonValue;
  examples?: Map<
    string,
    OpenApi3Dot1ExampleObject | OpenApi3Dot1ReferenceObject
  >;
  schema?: OpenApi3Dot1SchemaObject;
}

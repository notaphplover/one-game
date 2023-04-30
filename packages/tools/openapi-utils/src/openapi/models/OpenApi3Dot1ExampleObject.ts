import { JsonValue } from '@cornie-js/json-schema-utils';

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#exampleObject
export interface OpenApi3Dot1ExampleObject {
  description?: string;
  externalValue?: string;
  summary?: string;
  value?: JsonValue;
}

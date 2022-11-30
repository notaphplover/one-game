import {
  JsonSchema202012,
  JsonSchema202012Object,
} from '@one-game-js/json-schema-utils';

import { OpenApi3Dot1SchemaObjectBaseVocabulary } from './OpenApi3Dot1SchemaObjectBaseVocabulary';

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#schemaObject
export type OpenApi3Dot1SchemaObject =
  | JsonSchema202012
  | (JsonSchema202012Object & OpenApi3Dot1SchemaObjectBaseVocabulary);

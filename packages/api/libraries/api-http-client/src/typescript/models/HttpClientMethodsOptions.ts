import { JsonSchema202012Object } from '@cornie-js/json-schema-utils';
import {
  OpenApi3Dot1PathItemObject,
  OpenApi3Dot1Object,
} from '@cornie-js/openapi-utils';

export interface HttpClientMethodsOptions {
  idToSchemaMap: Map<string, JsonSchema202012Object>;
  path: string;
  pathItem: OpenApi3Dot1PathItemObject;
  root: OpenApi3Dot1Object;
}

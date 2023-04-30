import {
  OpenApi3Dot1PathItemObject,
  OpenApi3Dot1Object,
} from '@cornie-js/openapi-utils';

export interface HttpClientMethodsOptions {
  path: string;
  pathItem: OpenApi3Dot1PathItemObject;
  root: OpenApi3Dot1Object;
}

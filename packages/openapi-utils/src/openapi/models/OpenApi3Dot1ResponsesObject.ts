import { OpenApi3Dot1ReferenceObject } from './OpenApi3Dot1ReferenceObject';
import { OpenApi3Dot1ResponseObject } from './OpenApi3Dot1ResponseObject';

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#responsesObject
export interface OpenApi3Dot1ResponsesObject {
  [statusCode: string]:
    | OpenApi3Dot1ReferenceObject
    | OpenApi3Dot1ResponseObject;
  default?: OpenApi3Dot1ReferenceObject | OpenApi3Dot1ResponseObject;
}

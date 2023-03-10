import { OpenApi3Dot1SecuritySchemeObjectBase } from './OpenApi3Dot1SecuritySchemeObjectBase';
import { OpenApi3Dot1SecuritySchemeObjectType } from './OpenApi3Dot1SecuritySchemeObjectType';

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#securitySchemeObject
export type OpenApi3Dot1SecuritySchemeObjectMutualTls =
  OpenApi3Dot1SecuritySchemeObjectBase<OpenApi3Dot1SecuritySchemeObjectType.mutualTLS>;

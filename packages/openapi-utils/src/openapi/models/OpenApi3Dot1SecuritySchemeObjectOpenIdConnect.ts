import { OpenApi3Dot1SecuritySchemeObjectBase } from './OpenApi3Dot1SecuritySchemeObjectBase';
import { OpenApi3Dot1SecuritySchemeObjectType } from './OpenApi3Dot1SecuritySchemeObjectType';

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#securitySchemeObject
export interface OpenApi3Dot1SecuritySchemeObjectOpenIdConnect
  extends OpenApi3Dot1SecuritySchemeObjectBase<OpenApi3Dot1SecuritySchemeObjectType.openIdConnect> {
  openIdConnectUrl: string;
}

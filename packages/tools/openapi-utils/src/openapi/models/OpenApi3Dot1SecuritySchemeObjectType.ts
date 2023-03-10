// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#securitySchemeObject
export enum OpenApi3Dot1SecuritySchemeObjectType {
  apiKey = 'apiKey',
  http = 'http',
  mutualTLS = 'mutualTLS',
  oauth2 = 'oauth2',
  openIdConnect = 'openIdConnect',
}

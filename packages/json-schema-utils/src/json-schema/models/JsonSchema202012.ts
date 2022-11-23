import { JsonValue } from './JsonValue';

export type NonEmptyArray<T> = [T, ...T[]];

// https://json-schema.org/draft/2020-12/json-schema-core.html#name-boolean-json-schemas
export type JsonSchema202012Boolean = boolean;

// https://json-schema.org/draft/2020-12/json-schema-core.html#name-the-json-schema-core-vocabu
export interface JsonSchema202012CoreVocabularyProperties {
  $anchor?: string;
  $comments?: string;
  $defs?: Record<string, JsonSchema202012>;
  $dynamicAnchor?: string;
  $dynamicRef?: string;
  $id?: string;
  $ref?: string;
}

// https://json-schema.org/draft/2020-12/json-schema-core.html#name-the-json-schema-core-vocabu
export interface JsonRootSchema202012CoreVocabularyProperties {
  $schema: string;
  $vocabulary?: Record<string, boolean>;
}

// https://json-schema.org/draft/2020-12/json-schema-core.html#section-4.3.1-6
export interface JsonSchema202012UnknownProperties {
  [key: string]: JsonValue;
}

export type JsonSchema202012KnownPropertiesObject =
  JsonSchema202012CoreVocabularyProperties &
    JsonSchema202012SubschemeAppliedProperties &
    JsonSchema202012UnevaluatedLocationProperties &
    JsonSchema202012StructuralValidationProperties &
    JsonSchema202012FormatProperties &
    JsonSchema202012StringContentEncodedProperties &
    JsonSchema202012MetadataAnnotationsProperties;

export type JsonSchema202012Object = JsonSchema202012KnownPropertiesObject &
  JsonSchema202012UnknownProperties;

// https://json-schema.org/draft/2020-12/json-schema-core.html#name-a-vocabulary-for-applying-s
export interface JsonSchema202012SubschemeAppliedProperties {
  additionalProperties?: JsonSchema202012;
  allOf?: NonEmptyArray<JsonSchema202012>;
  anyOf?: NonEmptyArray<JsonSchema202012>;
  contains?: JsonSchema202012;
  dependentSchemas?: Record<string, JsonSchema202012>;
  else?: JsonSchema202012;
  if?: JsonSchema202012;
  items?: JsonSchema202012;
  not?: JsonSchema202012;
  oneOf?: NonEmptyArray<JsonSchema202012>;
  patternProperties?: Record<string, JsonSchema202012>;
  prefixItems?: NonEmptyArray<JsonSchema202012>;
  propertyNames?: JsonSchema202012;
  properties?: Record<string, JsonSchema202012>;
  then?: JsonSchema202012;
}

// https://json-schema.org/draft/2020-12/json-schema-core.html#name-a-vocabulary-for-unevaluate
export interface JsonSchema202012UnevaluatedLocationProperties {
  unevaluatedItems?: JsonSchema202012;
  unevaluatedProperties?: JsonSchema202012;
}

// https://json-schema.org/draft/2020-12/json-schema-validation.html#name-a-vocabulary-for-structural
export interface JsonSchema202012StructuralValidationProperties {
  const?: JsonValue;
  dependentRequired?: Record<string, string[]>;
  enum?: NonEmptyArray<JsonValue>;
  exclusiveMaximum?: number;
  exclusiveMinimum?: number;
  maxContains?: number;
  maximum?: number;
  maxItems?: number;
  maxLength?: number;
  maxProperties?: number;
  minContains?: number;
  minimum?: number;
  minItems?: number;
  minLength?: number;
  minProperties?: number;
  multipleOf?: number;
  pattern?: string;
  required?: string[];
  type?: JsonSchema202012Type | JsonSchema202012Type[];
  uniqueItems?: boolean;
}

// https://json-schema.org/draft/2020-12/json-schema-validation.html#name-validation-keywords-for-any
export enum JsonSchema202012Type {
  array = 'array',
  boolean = 'boolean',
  integer = 'integer',
  null = 'null',
  number = 'number',
  object = 'object',
  string = 'string',
}

// https://json-schema.org/draft/2020-12/json-schema-validation.html#name-vocabularies-for-semantic-c
export interface JsonSchema202012FormatProperties {
  format?: JsonSchema202012CustomFormat | JsonSchema202012Format;
}

// https://json-schema.org/draft/2020-12/json-schema-validation.html#name-custom-format-attributes
export type JsonSchema202012CustomFormat = string;

// https://json-schema.org/draft/2020-12/json-schema-validation.html#name-defined-formats
export enum JsonSchema202012Format {
  dateTime = 'date-time',
  date = 'date',
  duration = 'duration',
  email = 'email',
  hostname = 'hostname',
  idnEmail = 'idn-email',
  idnHostname = 'idn-hostname',
  ipV4 = 'ipv4',
  ipV6 = 'ipv6',
  iri = 'iri',
  iriReference = 'iri-reference',
  jsonPointer = 'json-pointer',
  regex = 'regex',
  relativeJsonPointer = 'relative-json-pointer',
  time = 'time',
  uri = 'uri',
  uriReference = 'uri-reference',
  uriTemplate = 'uri-template',
  uuid = 'uuid',
}

// https://json-schema.org/draft/2020-12/json-schema-validation.html#name-a-vocabulary-for-the-conten
export interface JsonSchema202012StringContentEncodedProperties {
  contentEncoding?:
    | JsonSchema202012BaseContentEncoding
    | JsonSchema202012MimeContentTransferEncoding;
  contentMediaType?: string;
  contentSchema?: JsonSchema202012;
}

/*
 * https://json-schema.org/draft/2020-12/json-schema-validation.html#name-contentencoding
 * - https://www.rfc-editor.org/rfc/rfc4648.html
 */
export enum JsonSchema202012BaseContentEncoding {
  base32 = 'base32',
  base32hex = 'base32hex',
  base64 = 'base64',
  base64url = 'base64url',
  hex = 'hex',
}

export enum JsonSchema202012MimeContentTransferEncoding {
  base64 = 'base64',
  bit7 = '7bit',
  bit8 = '8bit',
  binary = 'binary',
  ietfToken = 'ietf-token',
  quotedPrintable = 'quoted-printable',
  xToken = 'x-token',
}

// https://json-schema.org/draft/2020-12/json-schema-validation.html#name-a-vocabulary-for-basic-meta
export interface JsonSchema202012MetadataAnnotationsProperties {
  default?: JsonValue;
  deprecated?: boolean;
  description?: string;
  examples?: JsonValue[];
  readOnly?: boolean;
  title?: string;
  writeOnly?: boolean;
}

export type JsonRootSchema202012KnownPropertiesObject =
  JsonSchema202012KnownPropertiesObject &
    JsonRootSchema202012CoreVocabularyProperties;

export type JsonRootSchema202012Object =
  JsonRootSchema202012KnownPropertiesObject & JsonSchema202012UnknownProperties;

export type JsonSchema202012 = JsonSchema202012Boolean | JsonSchema202012Object;

export type JsonRootSchema202012 =
  | JsonSchema202012Boolean
  | JsonRootSchema202012Object;

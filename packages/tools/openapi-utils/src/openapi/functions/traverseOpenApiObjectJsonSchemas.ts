import {
  traverseJsonSchema,
  TraverseJsonSchemaCallbackParams,
  TraverseJsonSchemaParams,
} from '@one-game-js/json-schema-utils';

import { OpenApi3Dot1CallbackObject } from '../models/OpenApi3Dot1CallbackObject';
import { OpenApi3Dot1ComponentsObject } from '../models/OpenApi3Dot1ComponentsObject';
import { OpenApi3Dot1MediaTypeObject } from '../models/OpenApi3Dot1MediaTypeObject';
import { OpenApi3Dot1Object } from '../models/OpenApi3Dot1Object';
import { OpenApi3Dot1OperationObject } from '../models/OpenApi3Dot1OperationObject';
import { OpenApi3Dot1PathItemObject } from '../models/OpenApi3Dot1PathItemObject';
import { OpenApi3Dot1PathsObject } from '../models/OpenApi3Dot1PathsObject';
import { OpenApi3Dot1ReferenceObject } from '../models/OpenApi3Dot1ReferenceObject';
import { OpenApi3Dot1RequestBodyObject } from '../models/OpenApi3Dot1RequestBodyObject';
import { OpenApi3Dot1ResponseObject } from '../models/OpenApi3Dot1ResponseObject';
import { OpenApi3Dot1ResponsesObject } from '../models/OpenApi3Dot1ResponsesObject';
import { OpenApi3Dot1SchemaObject } from '../models/OpenApi3Dot1SchemaObject';

export function traverseOpenApiObjectJsonSchemas(
  openApiObject: OpenApi3Dot1Object,
  callback: (params: TraverseJsonSchemaCallbackParams) => void,
): void {
  if (openApiObject.components !== undefined) {
    traverseOpenApi3Dot1ComponentsObjectJsonSchemas(
      openApiObject.components,
      callback,
    );
  }

  if (openApiObject.paths !== undefined) {
    traverseOpenApi3Dot1PathsObjectJsonSchemas(openApiObject.paths, callback);
  }

  if (openApiObject.webhooks !== undefined) {
    for (const key of Object.keys(openApiObject.webhooks)) {
      // Consider OpenApi3Dot1PathItemObject as a superset of OpenApi3Dot1ReferenceObject
      traverseOpenApi3Dot1PathItemObjectJsonSchemas(
        openApiObject.webhooks[key] as OpenApi3Dot1PathItemObject,
        callback,
      );
    }
  }
}

export function traverseOpenApi3Dot1MediaTypeObjectJsonSchemas(
  openApi3Dot1MediaTypeObject: OpenApi3Dot1MediaTypeObject,
  callback: (params: TraverseJsonSchemaCallbackParams) => void,
): void {
  if (openApi3Dot1MediaTypeObject.schema !== undefined) {
    const params: TraverseJsonSchemaParams = {
      jsonPointer: '',
      schema: openApi3Dot1MediaTypeObject.schema,
    };

    traverseJsonSchema(params, callback);
  }
}

export function traverseOpenApi3Dot1ComponentsObjectJsonSchemas(
  openApi3Dot1ComponentsObject: OpenApi3Dot1ComponentsObject,
  callback: (params: TraverseJsonSchemaCallbackParams) => void,
): void {
  if (openApi3Dot1ComponentsObject.callbacks !== undefined) {
    for (const key of Object.keys(openApi3Dot1ComponentsObject.callbacks)) {
      const openApi3Dot1CallbackOrReferenceObject:
        | OpenApi3Dot1CallbackObject
        | OpenApi3Dot1ReferenceObject = openApi3Dot1ComponentsObject.callbacks[
        key
      ] as OpenApi3Dot1CallbackObject | OpenApi3Dot1ReferenceObject;

      if (isOpenApi3Dot1CallbackObject(openApi3Dot1CallbackOrReferenceObject)) {
        traverseOpenApi3Dot1CallbackObjectJsonSchemas(
          openApi3Dot1CallbackOrReferenceObject,
          callback,
        );
      }
    }
  }

  if (openApi3Dot1ComponentsObject.pathItems !== undefined) {
    for (const key of Object.keys(openApi3Dot1ComponentsObject.pathItems)) {
      // Consider OpenApi3Dot1PathItemObject as a superset of OpenApi3Dot1ReferenceObject
      traverseOpenApi3Dot1PathItemObjectJsonSchemas(
        openApi3Dot1ComponentsObject.pathItems[
          key
        ] as OpenApi3Dot1PathItemObject,
        callback,
      );
    }
  }

  if (openApi3Dot1ComponentsObject.requestBodies !== undefined) {
    for (const key of Object.keys(openApi3Dot1ComponentsObject.requestBodies)) {
      const requestBody:
        | OpenApi3Dot1RequestBodyObject
        | OpenApi3Dot1ReferenceObject = openApi3Dot1ComponentsObject
        .requestBodies[key] as
        | OpenApi3Dot1RequestBodyObject
        | OpenApi3Dot1ReferenceObject;

      if (isOpenApi3Dot1RequestBodyObject(requestBody)) {
        traverseOpenApi3Dot1RequestBodyObjectJsonSchemas(requestBody, callback);
      }
    }
  }

  if (openApi3Dot1ComponentsObject.schemas !== undefined) {
    for (const key of Object.keys(openApi3Dot1ComponentsObject.schemas)) {
      const params: TraverseJsonSchemaParams = {
        jsonPointer: '',
        schema: openApi3Dot1ComponentsObject.schemas[
          key
        ] as OpenApi3Dot1SchemaObject,
      };

      traverseJsonSchema(params, callback);
    }
  }
}

export function traverseOpenApi3Dot1RequestBodyObjectJsonSchemas(
  openApi3Dot1RequestBodyObject: OpenApi3Dot1RequestBodyObject,
  callback: (params: TraverseJsonSchemaCallbackParams) => void,
): void {
  for (const key of Object.keys(openApi3Dot1RequestBodyObject.content)) {
    traverseOpenApi3Dot1MediaTypeObjectJsonSchemas(
      openApi3Dot1RequestBodyObject.content[key] as OpenApi3Dot1MediaTypeObject,
      callback,
    );
  }
}

export function traverseOpenApi3Dot1ResponseObjectJsonSchemas(
  openApi3Dot1ResponseBodyObject: OpenApi3Dot1ResponseObject,
  callback: (params: TraverseJsonSchemaCallbackParams) => void,
): void {
  if (openApi3Dot1ResponseBodyObject.content !== undefined) {
    for (const key of Object.keys(openApi3Dot1ResponseBodyObject.content)) {
      traverseOpenApi3Dot1MediaTypeObjectJsonSchemas(
        openApi3Dot1ResponseBodyObject.content[
          key
        ] as OpenApi3Dot1MediaTypeObject,
        callback,
      );
    }
  }
}

export function traverseOpenApi3Dot1OperationObjectJsonSchemas(
  openApi3Dot1OperationObject: OpenApi3Dot1OperationObject,
  callback: (params: TraverseJsonSchemaCallbackParams) => void,
): void {
  if (openApi3Dot1OperationObject.callbacks !== undefined) {
    for (const key of Object.keys(openApi3Dot1OperationObject.callbacks)) {
      const openApi3Dot1CallbackOrReferenceObject:
        | OpenApi3Dot1CallbackObject
        | OpenApi3Dot1ReferenceObject = openApi3Dot1OperationObject.callbacks[
        key
      ] as OpenApi3Dot1CallbackObject | OpenApi3Dot1ReferenceObject;

      if (isOpenApi3Dot1CallbackObject(openApi3Dot1CallbackOrReferenceObject)) {
        traverseOpenApi3Dot1CallbackObjectJsonSchemas(
          openApi3Dot1CallbackOrReferenceObject,
          callback,
        );
      }
    }
  }

  if (
    openApi3Dot1OperationObject.requestBody !== undefined &&
    isOpenApi3Dot1RequestBodyObject(openApi3Dot1OperationObject.requestBody)
  ) {
    traverseOpenApi3Dot1RequestBodyObjectJsonSchemas(
      openApi3Dot1OperationObject.requestBody,
      callback,
    );
  }

  if (openApi3Dot1OperationObject.responses !== undefined) {
    traverseOpenApi3Dot1ResponsesObjectJsonSchemas(
      openApi3Dot1OperationObject.responses,
      callback,
    );
  }
}

export function traverseOpenApi3Dot1ResponsesObjectJsonSchemas(
  openApi3Dot1ResponsesBodyObject: OpenApi3Dot1ResponsesObject,
  callback: (params: TraverseJsonSchemaCallbackParams) => void,
): void {
  if (openApi3Dot1ResponsesBodyObject !== undefined) {
    for (const key of Object.keys(openApi3Dot1ResponsesBodyObject)) {
      traverseOpenApi3Dot1ResponseObjectJsonSchemas(
        openApi3Dot1ResponsesBodyObject[key] as OpenApi3Dot1ResponseObject,
        callback,
      );
    }
  }
}

export function traverseOpenApi3Dot1PathItemObjectJsonSchemas(
  openApi3Dot1PathItemObject: OpenApi3Dot1PathItemObject,
  callback: (params: TraverseJsonSchemaCallbackParams) => void,
): void {
  const handlers: Partial<
    Record<
      keyof OpenApi3Dot1PathItemObject,
      (
        openApi3Dot1PathItemObject: OpenApi3Dot1OperationObject,
        callback: (params: TraverseJsonSchemaCallbackParams) => void,
      ) => void
    >
  > = {
    delete: traverseOpenApi3Dot1OperationObjectJsonSchemas,
    get: traverseOpenApi3Dot1OperationObjectJsonSchemas,
    head: traverseOpenApi3Dot1OperationObjectJsonSchemas,
    options: traverseOpenApi3Dot1OperationObjectJsonSchemas,
    patch: traverseOpenApi3Dot1OperationObjectJsonSchemas,
    post: traverseOpenApi3Dot1OperationObjectJsonSchemas,
    trace: traverseOpenApi3Dot1OperationObjectJsonSchemas,
  };

  for (const key of Object.keys(
    openApi3Dot1PathItemObject,
  ) as (keyof OpenApi3Dot1PathItemObject)[]) {
    const handler:
      | ((
          openApi3Dot1PathItemObject: OpenApi3Dot1OperationObject,
          callback: (params: TraverseJsonSchemaCallbackParams) => void,
        ) => void)
      | undefined = handlers[key];

    if (handler !== undefined) {
      handler(
        openApi3Dot1PathItemObject[key] as OpenApi3Dot1OperationObject,
        callback,
      );
    }
  }
}

export function traverseOpenApi3Dot1CallbackObjectJsonSchemas(
  openApi3Dot1CallbackObject: OpenApi3Dot1CallbackObject,
  callback: (params: TraverseJsonSchemaCallbackParams) => void,
): void {
  for (const key of Object.keys(openApi3Dot1CallbackObject)) {
    // Consider OpenApi3Dot1PathItemObject as a superset of OpenApi3Dot1ReferenceObject
    traverseOpenApi3Dot1PathItemObjectJsonSchemas(
      openApi3Dot1CallbackObject[key] as OpenApi3Dot1PathItemObject,
      callback,
    );
  }
}

export function traverseOpenApi3Dot1PathsObjectJsonSchemas(
  openApi3Dot1PathsObject: OpenApi3Dot1PathsObject,
  callback: (params: TraverseJsonSchemaCallbackParams) => void,
): void {
  for (const key of Object.keys(openApi3Dot1PathsObject)) {
    // Consider OpenApi3Dot1PathItemObject as a superset of OpenApi3Dot1ReferenceObject
    traverseOpenApi3Dot1PathItemObjectJsonSchemas(
      openApi3Dot1PathsObject[key] as OpenApi3Dot1PathItemObject,
      callback,
    );
  }
}

function isOpenApi3Dot1CallbackObject(
  openApi3Dot1CallbackObject:
    | OpenApi3Dot1CallbackObject
    | OpenApi3Dot1ReferenceObject,
): openApi3Dot1CallbackObject is OpenApi3Dot1CallbackObject {
  return typeof openApi3Dot1CallbackObject.$ref !== 'string';
}

function isOpenApi3Dot1RequestBodyObject(
  openApi3Dot1RequestBodyOrReferenceObject:
    | OpenApi3Dot1RequestBodyObject
    | OpenApi3Dot1ReferenceObject,
): openApi3Dot1RequestBodyOrReferenceObject is OpenApi3Dot1RequestBodyObject {
  return (
    (openApi3Dot1RequestBodyOrReferenceObject as OpenApi3Dot1RequestBodyObject)
      .content !== undefined
  );
}

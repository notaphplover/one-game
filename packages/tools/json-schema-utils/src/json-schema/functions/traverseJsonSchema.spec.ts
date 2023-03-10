import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { JsonRootSchema202012Fixtures } from '../../json-schema/fixtures/JsonRootSchema202012Fixtures';
import {
  JsonSchema202012,
  JsonRootSchema202012Object,
} from '../../json-schema/models/JsonSchema202012';
import { TraverseJsonSchemaCallbackParams } from '../../json-schema/models/TraverseJsonSchemaCallbackParams';
import { traverseJsonSchema } from './traverseJsonSchema';

describe(traverseJsonSchema.name, () => {
  let callbackMock: jest.Mock<
    (params: TraverseJsonSchemaCallbackParams) => void
  >;

  beforeAll(() => {
    callbackMock = jest.fn();
  });

  describe('when called', () => {
    beforeAll(() => {
      traverseJsonSchema(
        { schema: JsonRootSchema202012Fixtures.any },
        callbackMock,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call callback() with the schema', () => {
      const expectedTraverseJsonSchemaCallbackParams: TraverseJsonSchemaCallbackParams =
        {
          jsonPointer: '',
          parentJsonPointer: undefined,
          parentSchema: undefined,
          schema: JsonRootSchema202012Fixtures.any,
        };

      expect(callbackMock).toHaveBeenCalledTimes(1);
      expect(callbackMock).toHaveBeenCalledWith(
        expectedTraverseJsonSchemaCallbackParams,
      );
    });
  });

  describe.each<[string, JsonRootSchema202012Object]>([
    ['$defs', JsonRootSchema202012Fixtures.with$DefsOne],
    ['dependentSchemas', JsonRootSchema202012Fixtures.withDependentSchemasOne],
    ['patternProperties', JsonRootSchema202012Fixtures.withPatternProperiesOne],
    ['properties', JsonRootSchema202012Fixtures.withProperiesOne],
  ])(
    '(key to schema map) having a schema with "%s"',
    (schemaKey: string, schemaFixture: JsonRootSchema202012Object): void => {
      beforeAll(() => {
        traverseJsonSchema({ schema: schemaFixture }, callbackMock);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call callback() with the schema', () => {
        const expectedTraverseJsonSchemaCallbackParams: TraverseJsonSchemaCallbackParams =
          {
            jsonPointer: '',
            parentJsonPointer: undefined,
            parentSchema: undefined,
            schema: schemaFixture,
          };

        expect(callbackMock).toHaveBeenNthCalledWith(
          1,
          expectedTraverseJsonSchemaCallbackParams,
        );
      });

      it('should call callback() with every subschema', () => {
        const subschemaMap: Record<string, JsonSchema202012> = schemaFixture[
          schemaKey
        ] as Record<string, JsonSchema202012>;

        const subschemaMapEntries: [string, JsonSchema202012][] =
          Object.entries(subschemaMap);

        expect(callbackMock).toHaveBeenCalledTimes(
          subschemaMapEntries.length + 1,
        );

        for (const [
          index,
          [subschemaKey, subschema],
        ] of subschemaMapEntries.entries()) {
          const expectedTraverseJsonSchemaCallbackParams: TraverseJsonSchemaCallbackParams =
            {
              jsonPointer: `/${schemaKey}/${subschemaKey}`,
              parentJsonPointer: '',
              parentSchema: schemaFixture,
              schema: subschema,
            };

          expect(callbackMock).toHaveBeenNthCalledWith(
            index + 2,
            expectedTraverseJsonSchemaCallbackParams,
          );
        }
      });
    },
  );

  describe.each<[string, JsonRootSchema202012Object]>([
    ['allOf', JsonRootSchema202012Fixtures.withAllOfTwo],
    ['anyOf', JsonRootSchema202012Fixtures.withAnyOfTwo],
    ['oneOf', JsonRootSchema202012Fixtures.withOneOfTwo],
    ['prefixItems', JsonRootSchema202012Fixtures.withPrefixItemsOne],
  ])(
    '(schema array) having a schema with "%s"',
    (schemaKey: string, schemaFixture: JsonRootSchema202012Object): void => {
      beforeAll(() => {
        traverseJsonSchema({ schema: schemaFixture }, callbackMock);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call callback() with the schema', () => {
        const expectedTraverseJsonSchemaCallbackParams: TraverseJsonSchemaCallbackParams =
          {
            jsonPointer: '',
            parentJsonPointer: undefined,
            parentSchema: undefined,
            schema: schemaFixture,
          };

        expect(callbackMock).toHaveBeenNthCalledWith(
          1,
          expectedTraverseJsonSchemaCallbackParams,
        );
      });

      it('should call callback() with every subschema', () => {
        const schemaArrays: JsonSchema202012[] = schemaFixture[
          schemaKey
        ] as JsonSchema202012[];

        expect(callbackMock).toHaveBeenCalledTimes(schemaArrays.length + 1);

        for (const [subschemaIndex, subschema] of schemaArrays.entries()) {
          const expectedTraverseJsonSchemaCallbackParams: TraverseJsonSchemaCallbackParams =
            {
              jsonPointer: `/${schemaKey}/${subschemaIndex}`,
              parentJsonPointer: '',
              parentSchema: schemaFixture,
              schema: subschema,
            };

          expect(callbackMock).toHaveBeenNthCalledWith(
            subschemaIndex + 2,
            expectedTraverseJsonSchemaCallbackParams,
          );
        }
      });
    },
  );

  describe.each<[string, JsonRootSchema202012Object]>([
    [
      'additionalProperties',
      JsonRootSchema202012Fixtures.withAdditionalProperties,
    ],
    ['contains', JsonRootSchema202012Fixtures.withContains],
    ['else', JsonRootSchema202012Fixtures.withElse],
    ['if', JsonRootSchema202012Fixtures.withIf],
    ['items', JsonRootSchema202012Fixtures.withItems],
    ['not', JsonRootSchema202012Fixtures.withNot],
    ['propertyNames', JsonRootSchema202012Fixtures.withProperyNames],
    ['then', JsonRootSchema202012Fixtures.withThen],
    ['unevaluatedItems', JsonRootSchema202012Fixtures.withUnevaluatedItems],
    [
      'unevaluatedProperties',
      JsonRootSchema202012Fixtures.withUnevaluatedProperties,
    ],
  ])(
    '(schema) having a schema with "%s"',
    (schemaKey: string, schemaFixture: JsonRootSchema202012Object): void => {
      beforeAll(() => {
        traverseJsonSchema({ schema: schemaFixture }, callbackMock);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call callback() with the schema', () => {
        const expectedTraverseJsonSchemaCallbackParams: TraverseJsonSchemaCallbackParams =
          {
            jsonPointer: '',
            parentJsonPointer: undefined,
            parentSchema: undefined,
            schema: schemaFixture,
          };

        expect(callbackMock).toHaveBeenNthCalledWith(
          1,
          expectedTraverseJsonSchemaCallbackParams,
        );
      });

      it('should call callback() with the subschema', () => {
        const subschema: JsonSchema202012 = schemaFixture[
          schemaKey
        ] as JsonSchema202012;

        expect(callbackMock).toHaveBeenCalledTimes(2);

        const expectedTraverseJsonSchemaCallbackParams: TraverseJsonSchemaCallbackParams =
          {
            jsonPointer: `/${schemaKey}`,
            parentJsonPointer: '',
            parentSchema: schemaFixture,
            schema: subschema,
          };

        expect(callbackMock).toHaveBeenNthCalledWith(
          2,
          expectedTraverseJsonSchemaCallbackParams,
        );
      });
    },
  );
});

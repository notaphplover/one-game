import { beforeAll, describe, expect, it } from '@jest/globals';

import { ResourceLocation } from '../../resource/models/ResourceLocation';
import { ResourceLocationType } from '../../resource/models/ResourceLocationType';
import { jsonSchemaRefToResourceLocation } from './jsonSchemaRefToResourceLocation';

describe(jsonSchemaRefToResourceLocation.name, () => {
  describe('having an empty referenceHostToSchemasRootDirectoryMap', () => {
    let referenceHostToSchemasRootDirectoryMapFixture: Map<string, string>;

    beforeAll(() => {
      referenceHostToSchemasRootDirectoryMapFixture = new Map();
    });

    describe('having an absolute url ref', () => {
      let refFixture: string;

      beforeAll(() => {
        refFixture = 'https://sample.co';
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = jsonSchemaRefToResourceLocation(
            referenceHostToSchemasRootDirectoryMapFixture,
            refFixture,
          );
        });

        it('should return a FileLocation', () => {
          const expectedFileLocation: ResourceLocation = {
            rawLocation: 'https://sample.co/',
            type: ResourceLocationType.url,
          };

          expect(result).toStrictEqual(expectedFileLocation);
        });
      });
    });

    describe('having a relative url ref with a base ref', () => {
      let baseRefFixture: string;
      let refFixture: string;

      beforeAll(() => {
        baseRefFixture = 'https://sample.co';
        refFixture = '/foo';
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = jsonSchemaRefToResourceLocation(
            referenceHostToSchemasRootDirectoryMapFixture,
            refFixture,
            baseRefFixture,
          );
        });

        it('should return a FileLocation', () => {
          const expectedFileLocation: ResourceLocation = {
            rawLocation: 'https://sample.co/foo',
            type: ResourceLocationType.url,
          };

          expect(result).toStrictEqual(expectedFileLocation);
        });
      });
    });
  });

  describe('having a non empty referenceHostToSchemasRootDirectoryMap', () => {
    let referenceHostToSchemasRootDirectoryMapFixture: Map<string, string>;

    beforeAll(() => {
      referenceHostToSchemasRootDirectoryMapFixture = new Map([
        ['sample.co', '/root/path/fixture'],
      ]);
    });

    describe('having an absolute url ref', () => {
      let refFixture: string;

      beforeAll(() => {
        refFixture = 'https://sample.co/subpath';
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = jsonSchemaRefToResourceLocation(
            referenceHostToSchemasRootDirectoryMapFixture,
            refFixture,
          );
        });

        it('should return a FileLocation', () => {
          const expectedFileLocation: ResourceLocation = {
            rawLocation: '/root/path/fixture/subpath',
            type: ResourceLocationType.fsPath,
          };

          expect(result).toStrictEqual(expectedFileLocation);
        });
      });
    });

    describe('having a relative url ref with a base ref', () => {
      let baseRefFixture: string;
      let refFixture: string;

      beforeAll(() => {
        baseRefFixture = 'https://sample.co';
        refFixture = '/foo';
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = jsonSchemaRefToResourceLocation(
            referenceHostToSchemasRootDirectoryMapFixture,
            refFixture,
            baseRefFixture,
          );
        });

        it('should return a FileLocation', () => {
          const expectedFileLocation: ResourceLocation = {
            rawLocation: '/root/path/fixture/foo',
            type: ResourceLocationType.fsPath,
          };

          expect(result).toStrictEqual(expectedFileLocation);
        });
      });
    });
  });
});

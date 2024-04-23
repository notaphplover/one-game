import { beforeAll, describe, expect, it } from '@jest/globals';
import { buildRequestParams } from './buildRequestParams';
import { UseCreateGameContext } from '../models/UseCreateGameContext';
import { HttpApiParams } from '../../../../common/http/models/HttpApiParams';
import { FormFieldsNewGame } from '../../../models/FormFieldsNewGame';

describe(buildRequestParams.name, () => {
  let contextFixture: UseCreateGameContext;

  beforeAll(() => {
    contextFixture = {
      token: 'token-fixture',
    };
  });

  describe('having params with name', () => {
    let paramsFixture: FormFieldsNewGame;

    beforeAll(() => {
      paramsFixture = {
        name: 'name-fixture',
        players: 2,
        options: {
          chainDraw2Draw2Cards: false,
          chainDraw2Draw4Cards: false,
          chainDraw4Draw4Cards: false,
          chainDraw4Draw2Cards: false,
          playCardIsMandatory: false,
          playMultipleSameCards: false,
          playWildDraw4IfNoOtherAlternative: true,
        },
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = buildRequestParams(contextFixture, paramsFixture);
      });

      it('should return request params', () => {
        const expected: HttpApiParams<'createGame'> = [
          {
            authorization: `Bearer ${contextFixture.token}`,
          },
          {
            gameSlotsAmount: paramsFixture.players,
            name: paramsFixture.name as string,
            options: paramsFixture.options,
          },
        ];

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having params without name', () => {
    let paramsFixture: FormFieldsNewGame;

    beforeAll(() => {
      paramsFixture = {
        name: undefined,
        players: 2,
        options: {
          chainDraw2Draw2Cards: false,
          chainDraw2Draw4Cards: false,
          chainDraw4Draw4Cards: false,
          chainDraw4Draw2Cards: false,
          playCardIsMandatory: false,
          playMultipleSameCards: false,
          playWildDraw4IfNoOtherAlternative: true,
        },
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = buildRequestParams(contextFixture, paramsFixture);
      });

      it('should return request params', () => {
        const expected: HttpApiParams<'createGame'> = [
          {
            authorization: `Bearer ${contextFixture.token}`,
          },
          {
            gameSlotsAmount: paramsFixture.players,
            options: paramsFixture.options,
          },
        ];

        expect(result).toStrictEqual(expected);
      });
    });
  });
});

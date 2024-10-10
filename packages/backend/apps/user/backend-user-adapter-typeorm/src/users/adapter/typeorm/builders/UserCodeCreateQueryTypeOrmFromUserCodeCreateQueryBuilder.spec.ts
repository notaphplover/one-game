import { beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder } from '@cornie-js/backend-common';
import {
  UserCodeCreateQuery,
  UserCodeKind,
} from '@cornie-js/backend-user-domain/users';
import { UserCodeCreateQueryFixtures } from '@cornie-js/backend-user-domain/users/fixtures';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { UserCodeDb } from '../models/UserCodeDb';
import { UserCodeKindDb } from '../models/UserCodeKindDb';
import { UserCodeCreateQueryTypeOrmFromUserCodeCreateQueryBuilder } from './UserCodeCreateQueryTypeOrmFromUserCodeCreateQueryBuilder';

describe(UserCodeCreateQueryTypeOrmFromUserCodeCreateQueryBuilder.name, () => {
  let userCodeKindDbFromUserCodeKindBuilderMock: jest.Mocked<
    Builder<UserCodeKindDb, [UserCodeKind]>
  >;

  let userCodeCreateQueryTypeOrmFromUserCodeCreateQueryBuilder: UserCodeCreateQueryTypeOrmFromUserCodeCreateQueryBuilder;

  beforeAll(() => {
    userCodeKindDbFromUserCodeKindBuilderMock = {
      build: jest.fn(),
    };

    userCodeCreateQueryTypeOrmFromUserCodeCreateQueryBuilder =
      new UserCodeCreateQueryTypeOrmFromUserCodeCreateQueryBuilder(
        userCodeKindDbFromUserCodeKindBuilderMock,
      );
  });

  describe('.build', () => {
    let userCodeCreateQueryFixture: UserCodeCreateQuery;

    beforeAll(() => {
      userCodeCreateQueryFixture = UserCodeCreateQueryFixtures.any;
    });

    describe('when called', () => {
      let userCodeKindDbFixture: UserCodeKindDb;

      let result: unknown;

      beforeAll(() => {
        userCodeKindDbFixture = UserCodeKindDb.resetPassword;

        userCodeKindDbFromUserCodeKindBuilderMock.build.mockReturnValueOnce(
          userCodeKindDbFixture,
        );

        result = userCodeCreateQueryTypeOrmFromUserCodeCreateQueryBuilder.build(
          userCodeCreateQueryFixture,
        );
      });

      it('should call userCodeKindDbFromUserCodeKindBuilder.build()', () => {
        expect(
          userCodeKindDbFromUserCodeKindBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          userCodeKindDbFromUserCodeKindBuilderMock.build,
        ).toHaveBeenCalledWith(userCodeCreateQueryFixture.kind);
      });

      it('should return a QueryDeepPartial<UserCodeDb>', () => {
        const expected: QueryDeepPartialEntity<UserCodeDb> = {
          code: userCodeCreateQueryFixture.code,
          id: userCodeCreateQueryFixture.id,
          kind: userCodeKindDbFixture,
          user: {
            id: userCodeCreateQueryFixture.userId,
          },
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});

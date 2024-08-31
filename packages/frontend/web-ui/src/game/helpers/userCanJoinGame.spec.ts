import { beforeAll, describe, expect, it } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';

import { userCanJoinGame } from './userCanJoinGame';

describe(userCanJoinGame.name, () => {
  describe('having an undefined user', () => {
    let gameV1Fixture: apiModels.GameV1;

    beforeAll(() => {
      gameV1Fixture = {
        id: 'game-id',
        isPublic: false,
        state: {
          slots: [],
          status: 'nonStarted',
        },
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = userCanJoinGame(gameV1Fixture, undefined);
      });

      it('should return false', () => {
        expect(result).toBe(false);
      });
    });
  });

  describe('having an user and a finished game', () => {
    let gameV1Fixture: apiModels.FinishedGameV1;
    let userV1Fixture: apiModels.UserV1;

    beforeAll(() => {
      gameV1Fixture = {
        id: 'game-id',
        isPublic: false,
        state: {
          slots: [],
          status: 'finished',
        },
      };

      userV1Fixture = {
        active: true,
        id: 'id',
        name: 'name',
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = userCanJoinGame(gameV1Fixture, userV1Fixture);
      });

      it('should return false', () => {
        expect(result).toBe(false);
      });
    });
  });

  describe('having an user and a non started game with slot with user id', () => {
    let gameV1Fixture: apiModels.NonStartedGameV1;
    let userV1Fixture: apiModels.UserV1;

    beforeAll(() => {
      userV1Fixture = {
        active: true,
        id: 'id',
        name: 'name',
      };

      gameV1Fixture = {
        id: 'game-id',
        isPublic: false,
        state: {
          slots: [
            {
              userId: userV1Fixture.id,
            },
          ],
          status: 'nonStarted',
        },
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = userCanJoinGame(gameV1Fixture, userV1Fixture);
      });

      it('should return false', () => {
        expect(result).toBe(false);
      });
    });
  });

  describe('having an user and a non started game without slot with user id', () => {
    let gameV1Fixture: apiModels.NonStartedGameV1;
    let userV1Fixture: apiModels.UserV1;

    beforeAll(() => {
      userV1Fixture = {
        active: true,
        id: 'id',
        name: 'name',
      };

      gameV1Fixture = {
        id: 'game-id',
        isPublic: false,
        state: {
          slots: [],
          status: 'nonStarted',
        },
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = userCanJoinGame(gameV1Fixture, userV1Fixture);
      });

      it('should return true', () => {
        expect(result).toBe(true);
      });
    });
  });
});

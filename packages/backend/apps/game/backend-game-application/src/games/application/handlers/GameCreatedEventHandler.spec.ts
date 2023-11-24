import { beforeAll, describe, expect, it, jest } from '@jest/globals';

import { GameOptionsFixtures } from '@cornie-js/backend-game-domain/games/fixtures';

import { GameCreatedEventFixtures } from '../fixtures/GameCreatedEventFixtures';
import { GameCreatedEvent } from '../models/GameCreatedEvent';
import { GameOptionsPersistenceOutputPort } from '../ports/output/GameOptionsPersistenceOutputPort';
import { GameSpecPersistenceOutputPort } from '../ports/output/GameSpecPersistenceOutputPort';
import { GameCreatedEventHandler } from './GameCreatedEventHandler';

describe(GameCreatedEventHandler.name, () => {
  let gameOptionsPersistenceOutputPortMock: jest.Mocked<GameOptionsPersistenceOutputPort>;
  let gameSpecPersistenceOutputPortMock: jest.Mocked<GameSpecPersistenceOutputPort>;

  let gameCreatedEventHandler: GameCreatedEventHandler;

  beforeAll(() => {
    gameOptionsPersistenceOutputPortMock = {
      create: jest.fn(),
    } as Partial<
      jest.Mocked<GameOptionsPersistenceOutputPort>
    > as jest.Mocked<GameOptionsPersistenceOutputPort>;
    gameSpecPersistenceOutputPortMock = {
      create: jest.fn(),
    };

    gameCreatedEventHandler = new GameCreatedEventHandler(
      gameOptionsPersistenceOutputPortMock,
      gameSpecPersistenceOutputPortMock,
    );
  });

  describe('.handle', () => {
    let gameCreatedEventFixture: GameCreatedEvent;

    beforeAll(() => {
      gameCreatedEventFixture = GameCreatedEventFixtures.any;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(async () => {
        gameOptionsPersistenceOutputPortMock.create.mockResolvedValueOnce(
          GameOptionsFixtures.any,
        );

        result = await gameCreatedEventHandler.handle(gameCreatedEventFixture);
      });

      it('should call gameOptionsPersistenceOutputPort.create()', () => {
        expect(
          gameOptionsPersistenceOutputPortMock.create,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameOptionsPersistenceOutputPortMock.create,
        ).toHaveBeenCalledWith(
          gameCreatedEventFixture.gameCreateQuery.spec.options,
        );
      });

      it('should call gameSpecPersistenceOutputPort.create()', () => {
        expect(gameSpecPersistenceOutputPortMock.create).toHaveBeenCalledTimes(
          1,
        );
        expect(gameSpecPersistenceOutputPortMock.create).toHaveBeenCalledWith(
          gameCreatedEventFixture.gameCreateQuery.spec,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});

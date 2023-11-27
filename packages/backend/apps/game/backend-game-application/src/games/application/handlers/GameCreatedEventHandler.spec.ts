import { beforeAll, describe, expect, it, jest } from '@jest/globals';

import { GameCreatedEventFixtures } from '../fixtures/GameCreatedEventFixtures';
import { GameCreatedEvent } from '../models/GameCreatedEvent';
import { GameSpecPersistenceOutputPort } from '../ports/output/GameSpecPersistenceOutputPort';
import { GameCreatedEventHandler } from './GameCreatedEventHandler';

describe(GameCreatedEventHandler.name, () => {
  let gameSpecPersistenceOutputPortMock: jest.Mocked<GameSpecPersistenceOutputPort>;

  let gameCreatedEventHandler: GameCreatedEventHandler;

  beforeAll(() => {
    gameSpecPersistenceOutputPortMock = {
      create: jest.fn(),
    } as Partial<
      jest.Mocked<GameSpecPersistenceOutputPort>
    > as jest.Mocked<GameSpecPersistenceOutputPort>;

    gameCreatedEventHandler = new GameCreatedEventHandler(
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
        result = await gameCreatedEventHandler.handle(gameCreatedEventFixture);
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

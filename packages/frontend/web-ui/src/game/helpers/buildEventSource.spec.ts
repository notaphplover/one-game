import { beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock(
  '../../app/store/features/authSlice',
  () => ({
    selectAuthToken: jest.fn(),
  }),
  { virtual: true },
);
jest.mock(
  require.resolve('../../app/store/features/authSlice'),
  () => ({
    selectAuthToken: jest.fn(),
  }),
  { virtual: true },
);
jest.mock(
  '../../app/store/store',
  () => ({
    store: {
      getState: jest.fn(),
    },
  }),
  { virtual: true },
);
jest.mock(
  require.resolve('../../app/store/store'),
  () => ({
    store: {
      getState: jest.fn(),
    },
  }),
  { virtual: true },
);
jest.mock('../../common/env/services/EnvironmentService');
jest.mock('../../common/http/services/CornieEventSource');

import { models as apiModels } from '@cornie-js/api-models';

import { Environment } from '../../common/env/models/Environment';
import {
  EnvironmentService,
  environmentService,
} from '../../common/env/services/EnvironmentService';
import {
  CornieEventSource,
  CornieEventSourceInit,
} from '../../common/http/services/CornieEventSource';
import { buildEventSource } from './buildEventSource';

describe(buildEventSource.name, () => {
  describe('having an active game with last event id', () => {
    let gameFixture: apiModels.ActiveGameV1;
    let setMessageEventsQueueMock: jest.Mock<
      React.Dispatch<React.SetStateAction<[string, apiModels.GameEventV2][]>>
    >;

    beforeAll(() => {
      gameFixture = gameFixture = {
        id: 'game-id',
        isPublic: false,
        state: {
          currentCard: {
            kind: 'wild',
          },
          currentColor: 'blue',
          currentDirection: 'antiClockwise',
          currentPlayingSlotIndex: 0,
          currentTurnCardsDrawn: true,
          currentTurnCardsPlayed: true,
          drawCount: 0,
          lastEventId: 'event-id-fixture',
          slots: [],
          status: 'active',
        },
      };

      setMessageEventsQueueMock = jest.fn();
    });

    describe('when called', () => {
      let environmentFixture: Environment;

      let result: unknown;

      beforeAll(() => {
        environmentFixture = {
          backendBaseUrl: 'backend-base-url-fixture',
        };

        (
          environmentService as jest.Mocked<EnvironmentService>
        ).getEnvironment.mockReturnValueOnce(environmentFixture);

        result = buildEventSource(gameFixture, setMessageEventsQueueMock);
      });

      it('should call CornieEventSource()', () => {
        const expectedUrl: string = `${environmentFixture.backendBaseUrl}/v2/events/games/${gameFixture.id}`;
        const expectedInitDict: CornieEventSourceInit = {
          defaultLastEventId: gameFixture.state.lastEventId as string,
          getAccessToken: expect.any(Function) as unknown as () => string,
        };

        expect(CornieEventSource).toHaveBeenCalledTimes(1);
        expect(CornieEventSource).toHaveBeenCalledWith(
          expectedUrl,
          expectedInitDict,
        );
      });

      it('should call a cornieEventSource.addEventListener()', () => {
        expect(
          (result as CornieEventSource).addEventListener,
        ).toHaveBeenCalledTimes(1);
        expect(
          (result as CornieEventSource).addEventListener,
        ).toHaveBeenCalledWith('message', expect.any(Function));
      });

      it('should return a CornieEventSource', () => {
        const expectedProperties: Partial<CornieEventSource> = {
          addEventListener: expect.any(
            Function,
          ) as unknown as CornieEventSource['addEventListener'],
        };

        expect(result).toStrictEqual(
          expect.objectContaining(expectedProperties),
        );
      });
    });
  });
});

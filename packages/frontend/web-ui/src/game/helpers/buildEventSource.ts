import { models as apiModels } from '@cornie-js/api-models';

import { selectAuthToken } from '../../app/store/features/authSlice';
import { store } from '../../app/store/store';
import { environmentService } from '../../common/env/services/EnvironmentService';
import { CornieEventSource } from '../../common/http/services/CornieEventSource';

export function buildEventSource(
  game: apiModels.ActiveGameV1,
  setMessageEventsQueue: React.Dispatch<
    React.SetStateAction<[string, apiModels.GameEventV2][]>
  >,
): CornieEventSource {
  const url: string = `${environmentService.getEnvironment().backendBaseUrl}/v2/events/games/${game.id}`;

  const eventSource: CornieEventSource = new CornieEventSource(url, {
    defaultLastEventId: game.state.lastEventId ?? undefined,
    getAccessToken: () => selectAuthToken(store.getState()) ?? '',
  });

  const gameEventsListener: (event: MessageEvent<unknown>) => void = (
    event: MessageEvent<unknown>,
  ): void => {
    const parsedGameEventV2: apiModels.GameEventV2 = JSON.parse(
      event.data as string,
    ) as apiModels.GameEventV2;

    setMessageEventsQueue(
      (
        messageEventsQueue: [string, apiModels.GameEventV2][],
      ): [string, apiModels.GameEventV2][] => [
        ...messageEventsQueue,
        [event.lastEventId, parsedGameEventV2],
      ],
    );
  };

  eventSource.addEventListener('message', gameEventsListener);

  return eventSource;
}

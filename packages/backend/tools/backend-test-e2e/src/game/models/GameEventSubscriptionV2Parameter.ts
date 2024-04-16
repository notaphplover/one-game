import { models as apiModels } from '@cornie-js/api-models';
import { EventSource } from '@cornie-js/eventsource';

export interface GameEventSubscriptionV2Parameter {
  eventSource: EventSource;
  gameEvents: apiModels.GameEventV2[];
}

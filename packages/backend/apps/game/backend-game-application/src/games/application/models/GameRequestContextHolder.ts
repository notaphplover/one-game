import { RequestContextHolder } from '@cornie-js/backend-http';

import { GameRequestContext } from './GameRequestContext';

export type GameRequestContextHolder = RequestContextHolder<GameRequestContext>;

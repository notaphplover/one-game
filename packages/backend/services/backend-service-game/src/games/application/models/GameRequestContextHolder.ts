import { RequestContextHolder } from '@one-game-js/backend-http';

import { GameRequestContext } from './GameRequestContext';

export type GameRequestContextHolder = RequestContextHolder<GameRequestContext>;

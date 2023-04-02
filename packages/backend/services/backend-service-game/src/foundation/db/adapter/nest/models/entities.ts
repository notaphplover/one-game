import { GameDb } from '../../../../../games/adapter/typeorm/models/GameDb';
import { GameSlotDb } from '../../../../../games/adapter/typeorm/models/GameSlotDb';

// eslint-disable-next-line @typescript-eslint/ban-types
export const typeOrmEntities: Function[] = [GameDb, GameSlotDb];

import { GameDb } from '../../../../../games/adapter/typeorm/models/GameDb';
import { GameOptionsDb } from '../../../../../games/adapter/typeorm/models/GameOptionsDb';
import { GameSlotDb } from '../../../../../games/adapter/typeorm/models/GameSlotDb';
import { GameSpecDb } from '../../../../../games/adapter/typeorm/models/GameSpecDb';

// eslint-disable-next-line @typescript-eslint/ban-types
export const typeOrmEntities: Function[] = [
  GameDb,
  GameOptionsDb,
  GameSlotDb,
  GameSpecDb,
];

import { GameActionDb } from '../../../../../games/adapter/typeorm/models/GameActionDb';
import { GameDb } from '../../../../../games/adapter/typeorm/models/GameDb';
import { GameInitialSnapshotDb } from '../../../../../games/adapter/typeorm/models/GameInitialSnapshotDb';
import { GameInitialSnapshotSlotDb } from '../../../../../games/adapter/typeorm/models/GameInitialSnapshotSlotDb';
import { GameSlotDb } from '../../../../../games/adapter/typeorm/models/GameSlotDb';
import { GameSpecDb } from '../../../../../games/adapter/typeorm/models/GameSpecDb';

// eslint-disable-next-line @typescript-eslint/ban-types
export const typeOrmEntities: Function[] = [
  GameActionDb,
  GameDb,
  GameInitialSnapshotDb,
  GameInitialSnapshotSlotDb,
  GameSlotDb,
  GameSpecDb,
];

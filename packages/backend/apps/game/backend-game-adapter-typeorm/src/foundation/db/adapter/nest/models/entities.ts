import { GameInitialSnapshotDb } from '../../../../../gameInitialSnapshots/adapter/typeorm/models/GameInitialSnapshotDb';
import { GameInitialSnapshotSlotDb } from '../../../../../gameInitialSnapshots/adapter/typeorm/models/GameInitialSnapshotSlotDb';
import { GameActionDb } from '../../../../../games/adapter/typeorm/models/GameActionDb';
import { GameDb } from '../../../../../games/adapter/typeorm/models/GameDb';
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

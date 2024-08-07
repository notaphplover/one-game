import { GameActionDb } from '../../../../../gameActions/adapter/typeorm/models/GameActionDb';
import { GameDb } from '../../../../../games/adapter/typeorm/models/GameDb';
import { GameSlotDb } from '../../../../../games/adapter/typeorm/models/GameSlotDb';
import { GameSpecDb } from '../../../../../games/adapter/typeorm/models/GameSpecDb';
import { GameInitialSnapshotDb } from '../../../../../gameSnapshots/adapter/typeorm/models/GameInitialSnapshotDb';
import { GameInitialSnapshotSlotDb } from '../../../../../gameSnapshots/adapter/typeorm/models/GameInitialSnapshotSlotDb';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const typeOrmEntities: Function[] = [
  GameActionDb,
  GameDb,
  GameInitialSnapshotDb,
  GameInitialSnapshotSlotDb,
  GameSlotDb,
  GameSpecDb,
];

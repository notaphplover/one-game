import { RefreshTokenDb } from '../../../../../tokens/adapter/typeorm/models/RefreshTokenDb';
import { UserCodeDb } from '../../../../../users/adapter/typeorm/models/UserCodeDb';
import { UserDb } from '../../../../../users/adapter/typeorm/models/UserDb';

// eslint-disable-next-line @typescript-eslint/ban-types
export const typeOrmEntities: Function[] = [RefreshTokenDb, UserCodeDb, UserDb];

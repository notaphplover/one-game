import { provideTypeOrmDataSource } from './app/adapter/typeorm/scripts/provideTypeOrmDatasource';
import { DbModuleOptions } from './foundation/db/adapter/nest/models/DbModuleOptions';
import { DbModule } from './foundation/db/adapter/nest/modules/DbModule';
import { UserDbModule } from './user/adapter/nest/UserDbModule';

export type { DbModuleOptions };

export { DbModule, provideTypeOrmDataSource, UserDbModule };

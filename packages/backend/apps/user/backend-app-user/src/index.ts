import { DataSource } from 'typeorm';

import { AppModule } from './app/adapter/nest/modules/AppModule';
import { provideTypeOrmDataSource } from './app/adapter/nest/scripts/provideTypeOrmDatasource';
import { AuthManagementInputPort } from './auth/application/ports/input/AuthManagementInputPort';
import { UserManagementInputPort } from './user/application/ports/input/UserManagementInputPort';

export const userAppDataSourcePromise: Promise<DataSource> =
  provideTypeOrmDataSource();

export { AppModule, AuthManagementInputPort, UserManagementInputPort };

import { userAppDataSourcePromise } from '@cornie-js/backend-app-user';
import { DataSource } from 'typeorm';

export const dataSource: Promise<DataSource> = userAppDataSourcePromise;

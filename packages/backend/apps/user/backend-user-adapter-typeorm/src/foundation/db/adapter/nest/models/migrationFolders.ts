import path from 'node:path';

const packageRootDirectory: string = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  '..',
  '..',
);

export const typeOrmMigrationFolders: string[] = [
  `${packageRootDirectory}/lib/app/adapter/typeorm/migrations/*.js`,
];

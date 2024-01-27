import { InstanceChecker, ObjectLiteral, QueryBuilder } from 'typeorm';

export function isQueryBuilder<TEntity extends ObjectLiteral>(
  object: unknown,
): object is QueryBuilder<TEntity> {
  return (
    InstanceChecker.isDeleteQueryBuilder(object) ||
    InstanceChecker.isInsertQueryBuilder(object) ||
    InstanceChecker.isRelationQueryBuilder(object) ||
    InstanceChecker.isSelectQueryBuilder(object) ||
    InstanceChecker.isSoftDeleteQueryBuilder(object) ||
    InstanceChecker.isUpdateQueryBuilder(object)
  );
}

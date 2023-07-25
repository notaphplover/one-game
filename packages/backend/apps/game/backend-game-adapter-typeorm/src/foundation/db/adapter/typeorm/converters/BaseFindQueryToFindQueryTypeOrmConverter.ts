import {
  InstanceChecker,
  ObjectLiteral,
  QueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';

export abstract class BaseFindQueryToFindQueryTypeOrmConverter {
  protected _getEntityPrefix(
    queryBuilder: QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
    // eslint-disable-next-line @typescript-eslint/ban-types
    entityType: Function,
  ): string {
    let gamePropertiesPrefix: string;

    if (InstanceChecker.isSelectQueryBuilder(queryBuilder)) {
      gamePropertiesPrefix = `${entityType.name}.`;
    } else {
      // No prefix should be used due to https://github.com/typeorm/typeorm/issues/1798
      gamePropertiesPrefix = '';
    }

    return gamePropertiesPrefix;
  }
}

import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import {
  InstanceChecker,
  ObjectLiteral,
  QueryBuilder,
  ValueTransformer,
  WhereExpressionBuilder,
} from 'typeorm';

export abstract class BaseFindQueryToFindQueryTypeOrmBuilder {
  protected _getEntityPrefix(
    queryBuilder: QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    entityType: Function,
  ): string {
    let propertiesPrefix: string;

    if (InstanceChecker.isSelectQueryBuilder(queryBuilder)) {
      propertiesPrefix = `${entityType.name}.`;
    } else {
      // No prefix should be used due to https://github.com/typeorm/typeorm/issues/1798
      propertiesPrefix = '';
    }

    return propertiesPrefix;
  }

  protected _getSingleValueTransformer(
    queryBuilder: QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    entityType: Function,
    propertyName: string,
  ): ValueTransformer {
    const transformer: ValueTransformer | ValueTransformer[] | undefined =
      queryBuilder.connection
        .getMetadata(entityType)
        .findColumnWithPropertyName(propertyName)?.transformer;

    if (transformer === undefined) {
      throw new AppError(
        AppErrorKind.unknown,
        `Expected transformer not found at "${entityType.name}"."${propertyName}"`,
      );
    }

    if (Array.isArray(transformer)) {
      throw new AppError(
        AppErrorKind.unknown,
        `Unexpected multiple transformers found at "${entityType.name}"."${propertyName}"`,
      );
    }

    return transformer;
  }
}

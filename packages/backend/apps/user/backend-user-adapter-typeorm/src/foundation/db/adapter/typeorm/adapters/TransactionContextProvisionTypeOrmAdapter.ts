import { TypeOrmTransactionContext } from '@cornie-js/backend-db/adapter/typeorm';
import { TransactionContext } from '@cornie-js/backend-db/application';
import { TransactionContextProvisionOutputPort } from '@cornie-js/backend-user-application/foundation/db';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class TransactionContextProvisionTypeOrmAdapter
  implements TransactionContextProvisionOutputPort
{
  readonly #datasource: DataSource;

  constructor(@InjectDataSource() datasource: DataSource) {
    this.#datasource = datasource;
  }

  public async provide(): Promise<TransactionContext> {
    return TypeOrmTransactionContext.build(this.#datasource);
  }
}

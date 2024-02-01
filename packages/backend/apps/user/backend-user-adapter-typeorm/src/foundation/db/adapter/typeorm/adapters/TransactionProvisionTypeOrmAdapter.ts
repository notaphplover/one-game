import { TypeOrmTransactionWrapper } from '@cornie-js/backend-db/adapter/typeorm';
import { TransactionWrapper } from '@cornie-js/backend-db/application';
import { TransactionProvisionOutputPort } from '@cornie-js/backend-user-application/foundation/db';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class TransactionProvisionTypeOrmAdapter
  implements TransactionProvisionOutputPort
{
  readonly #datasource: DataSource;

  constructor(@InjectDataSource() datasource: DataSource) {
    this.#datasource = datasource;
  }

  public async provide(): Promise<TransactionWrapper> {
    return TypeOrmTransactionWrapper.build(this.#datasource);
  }
}

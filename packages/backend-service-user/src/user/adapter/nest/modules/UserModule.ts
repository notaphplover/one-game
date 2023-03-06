import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DbModule } from '../../../../foundation/db/adapter/nest/modules/DbModule';
import { userPersistenceOutputPortSymbol } from '../../../application/ports/output/UserPersistenceOutputPort';
import { UserPersistenceTypeOrmAdapter } from '../../typeorm/adapters/UserPersistenceTypeOrmAdapter';
import { UserCreateQueryToUserCreateQueryTypeOrmConverter } from '../../typeorm/converters/UserCreateQueryToUserCreateQueryTypeOrmConverter';
import { UserDbToUserConverter } from '../../typeorm/converters/UserDbToUserConverter';
import { UserDb } from '../../typeorm/models/UserDb';
import { CreateUserTypeOrmService } from '../../typeorm/services/CreateUserTypeOrmService';

@Module({
  imports: [DbModule, TypeOrmModule.forFeature([UserDb])],
  providers: [
    CreateUserTypeOrmService,
    UserCreateQueryToUserCreateQueryTypeOrmConverter,
    UserDbToUserConverter,
    {
      provide: userPersistenceOutputPortSymbol,
      useClass: UserPersistenceTypeOrmAdapter,
    },
  ],
})
export class UserModule {}

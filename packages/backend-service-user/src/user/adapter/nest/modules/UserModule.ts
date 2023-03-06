import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from '../../../../foundation/common/adapter/nest/modules/CommonModule';
import { DbModule } from '../../../../foundation/db/adapter/nest/modules/DbModule';
import { HashModule } from '../../../../foundation/hash/adapter/nest/modules/HashModule';
import { UserCreateQueryV1ToUserCreateQueryConverter } from '../../../application/converters/UserCreateQueryV1ToUserCreateQueryConverter';
import { userPersistenceOutputPortSymbol } from '../../../application/ports/output/UserPersistenceOutputPort';
import { UserPersistenceTypeOrmAdapter } from '../../typeorm/adapters/UserPersistenceTypeOrmAdapter';
import { UserCreateQueryToUserCreateQueryTypeOrmConverter } from '../../typeorm/converters/UserCreateQueryToUserCreateQueryTypeOrmConverter';
import { UserDbToUserConverter } from '../../typeorm/converters/UserDbToUserConverter';
import { UserDb } from '../../typeorm/models/UserDb';
import { CreateUserTypeOrmService } from '../../typeorm/services/CreateUserTypeOrmService';

@Module({
  imports: [
    CommonModule,
    HashModule,
    DbModule,
    TypeOrmModule.forFeature([UserDb]),
  ],
  providers: [
    CreateUserTypeOrmService,
    UserCreateQueryToUserCreateQueryTypeOrmConverter,
    UserCreateQueryV1ToUserCreateQueryConverter,
    UserDbToUserConverter,
    {
      provide: userPersistenceOutputPortSymbol,
      useClass: UserPersistenceTypeOrmAdapter,
    },
  ],
})
export class UserModule {}

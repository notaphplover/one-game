import { MailModule } from '@cornie-js/backend-adapter-nodemailer';
import {
  DbModule,
  DbModuleOptions,
  TokenDbModule,
  UserDbModule,
} from '@cornie-js/backend-user-adapter-typeorm';
import { UserHttpApiModule as UserHttpApiApplicationModule } from '@cornie-js/backend-user-application';
import { Module } from '@nestjs/common';

import { buildDbModuleOptions } from '../../../../foundation/db/adapter/nest/calculations/buildDbModuleOptions';
import { HttpModule } from '../../../../foundation/http/adapter/nest/modules/HttpModule';
import { buildMailClientOptions } from '../../../../foundation/mail/adapter/nest/calculations/buildMailClientOptions';
import { DeleteV1UsersEmailCodeRequestNestController } from '../controllers/DeleteV1UsersEmailCodeRequestNestController';
import { DeleteV1UsersMeHttpRequestNestController } from '../controllers/DeleteV1UsersMeHttpRequestNestController';
import { GetV1UsersHttpRequestNestController } from '../controllers/GetV1UsersHttpRequestNestController';
import { GetV1UsersMeDetailHttpRequestNestController } from '../controllers/GetV1UsersMeDetailHttpRequestNestController';
import { GetV1UsersMeHttpRequestNestController } from '../controllers/GetV1UsersMeHttpRequestNestController';
import { GetV1UsersUserIdHttpRequestNestController } from '../controllers/GetV1UsersUserIdHttpRequestNestController';
import { PatchV1UsersMeHttpRequestNestController } from '../controllers/PatchV1UsersMeHttpRequestNestController';
import { PostV1UsersEmailCodeRequestNestController } from '../controllers/PostV1UsersEmailCodeRequestNestController';
import { PostV1UsersHttpRequestNestController } from '../controllers/PostV1UsersHttpRequestNestController';

const dbModuleOptions: DbModuleOptions = buildDbModuleOptions();

@Module({
  controllers: [
    // mind the order
    DeleteV1UsersEmailCodeRequestNestController,
    DeleteV1UsersMeHttpRequestNestController,
    GetV1UsersHttpRequestNestController,
    GetV1UsersMeDetailHttpRequestNestController,
    GetV1UsersMeHttpRequestNestController,
    GetV1UsersUserIdHttpRequestNestController,
    PatchV1UsersMeHttpRequestNestController,
    PostV1UsersEmailCodeRequestNestController,
    PostV1UsersHttpRequestNestController,
  ],
  imports: [
    UserHttpApiApplicationModule.forRootAsync([
      DbModule.forTransaction(),
      MailModule.forRootAsync(buildMailClientOptions()),
      TokenDbModule.forRootAsync(dbModuleOptions),
      UserDbModule.forRootAsync(buildDbModuleOptions()),
    ]),
    HttpModule,
  ],
})
export class UserHttpApiModule {}

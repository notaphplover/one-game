import { MailModule } from '@cornie-js/backend-adapter-nodemailer';
import {
  DbModule,
  DbModuleOptions,
  TokenDbModule,
  UserDbModule,
} from '@cornie-js/backend-user-adapter-typeorm';
import { AuthHttpApiModule as AuthHttpApiApplicationModule } from '@cornie-js/backend-user-application';
import { Module } from '@nestjs/common';

import { buildDbModuleOptions } from '../../../../foundation/db/adapter/nest/calculations/buildDbModuleOptions';
import { HttpModule } from '../../../../foundation/http/adapter/nest/modules/HttpModule';
import { buildMailClientOptions } from '../../../../foundation/mail/adapter/nest/calculations/buildMailClientOptions';
import { PostAuthV1HttpRequestNestController } from '../controllers/PostAuthV1HttpRequestNestController';

const dbModuleOptions: DbModuleOptions = buildDbModuleOptions();

@Module({
  controllers: [PostAuthV1HttpRequestNestController],
  imports: [
    AuthHttpApiApplicationModule.forRootAsync([
      DbModule.forTransaction(),
      MailModule.forRootAsync(buildMailClientOptions()),
      TokenDbModule.forRootAsync(dbModuleOptions),
      UserDbModule.forRootAsync(dbModuleOptions),
    ]),
    HttpModule,
  ],
})
export class AuthHttpApiModule {}

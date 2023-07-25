import { MailModuleOptions } from '@cornie-js/backend-adapter-nodemailer';
import {
  EnvModule,
  Environment,
  EnvironmentService,
} from '@cornie-js/backend-app-user-env';
import { MailClientOptions } from '@cornie-js/backend-application-mail';

export function buildMailClientOptions(): MailModuleOptions {
  return {
    imports: [EnvModule],
    inject: [EnvironmentService],
    useFactory: (environmentService: EnvironmentService): MailClientOptions => {
      const environment: Environment = environmentService.getEnvironment();

      return {
        auth: {
          password: environment.mailConfig.authPassword,
          user: environment.mailConfig.authUser,
        },
        host: environment.mailConfig.host,
        port: environment.mailConfig.port,
        useTls: environment.mailConfig.useTls,
      };
    },
  };
}

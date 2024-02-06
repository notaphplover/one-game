import {
  Environment,
  EnvironmentService,
} from '@cornie-js/backend-app-user-env';
import { MailDeliveryOptions } from '@cornie-js/backend-application-mail';
import { Builder } from '@cornie-js/backend-common';
import { User, UserCode } from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';

const USER_ACTIVATION_SUBJECT: string = 'Reset password request';

@Injectable()
export class PasswordResetMailDeliveryOptionsFromUserBuilder
  implements Builder<MailDeliveryOptions, [User, UserCode]>
{
  readonly #frontendBaseUrl: string;
  readonly #sourceMailAddress: string;

  constructor(
    @Inject(EnvironmentService)
    environmentService: EnvironmentService,
  ) {
    const environment: Environment = environmentService.getEnvironment();

    this.#frontendBaseUrl = environment.frontendBaseUrl;
    this.#sourceMailAddress = environment.mailConfig.defaultAddress;
  }

  public build(user: User, userCode: UserCode): MailDeliveryOptions {
    return {
      from: this.#sourceMailAddress,
      html: this.#buildHtmlMessage(user, userCode),
      subject: USER_ACTIVATION_SUBJECT,
      to: [user.email],
    };
  }

  #buildPasswordResetUrl(userCode: UserCode): string {
    return `${this.#frontendBaseUrl}/auth/reset-password?code=${userCode.code}`;
  }

  #buildHtmlMessage(user: User, userCode: UserCode): string {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=">
    <title>${USER_ACTIVATION_SUBJECT}</title>
  </head>
  <body style="font-size: 16px; font-weight: 400; letter-spacing: 0em; margin: 0; padding-bottom: 40px; padding-right: 40px; text-align: left;">
    <table style="border:0;width:100%">
      <tbody>
        <tr>
          <td style="padding-bottom: 6px; padding-top: 38px;">
            Dear ${user.name},
            <br>
            A password reset has been requested. Please follow <a href="${this.#buildPasswordResetUrl(
              userCode,
            )}">this link</a> to proceed.
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`;
  }
}

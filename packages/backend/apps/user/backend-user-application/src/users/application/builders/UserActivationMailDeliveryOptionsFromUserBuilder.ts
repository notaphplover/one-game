import {
  Environment,
  EnvironmentService,
} from '@cornie-js/backend-app-user-env';
import { MailDeliveryOptions } from '@cornie-js/backend-application-mail';
import { Builder } from '@cornie-js/backend-common';
import { User, UserCode } from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';

const USER_ACTIVATION_SUBJECT: string = 'User activation pending';

@Injectable()
export class UserActivationMailDeliveryOptionsFromUserBuilder
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

  #buildConfirmUserUrl(userCode: UserCode): string {
    return `${this.#frontendBaseUrl}/auth/register/confirm?code=${userCode.code}`;
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
            Welcome ${user.name}!,
            <br>
            In order to complete your sign in, please follow <a href="${this.#buildConfirmUserUrl(
              userCode,
            )}">this link</a>.
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`;
  }
}

import {
  MailDeliveryOptions,
  MailDeliveryOutputPort,
} from '@cornie-js/backend-application-mail';
import { mailDeliveryOutputPortSymbol } from '@cornie-js/backend-application-mail/lib/mail/application/ports/output/MailDeliveryOutputPort';
import { Builder, Handler } from '@cornie-js/backend-common';
import { User, UserCode } from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';

import { UserActivationMailDeliveryOptionsFromUserBuilder } from '../builders/UserActivationMailDeliveryOptionsFromUserBuilder';
import { UserCreatedEvent } from '../models/UserCreatedEvent';

@Injectable()
export class UserCreatedEventHandler
  implements Handler<[UserCreatedEvent], void>
{
  readonly #mailDeliveryOutputPort: MailDeliveryOutputPort;
  readonly #userActivationMailDeliveryOptionsFromUserBuilder: Builder<
    MailDeliveryOptions,
    [User, UserCode]
  >;

  constructor(
    @Inject(mailDeliveryOutputPortSymbol)
    mailDeliveryOutputPort: MailDeliveryOutputPort,
    @Inject(UserActivationMailDeliveryOptionsFromUserBuilder)
    userActivationMailDeliveryOptionsFromUserBuilder: Builder<
      MailDeliveryOptions,
      [User, UserCode]
    >,
  ) {
    this.#mailDeliveryOutputPort = mailDeliveryOutputPort;
    this.#userActivationMailDeliveryOptionsFromUserBuilder =
      userActivationMailDeliveryOptionsFromUserBuilder;
  }

  public async handle(userCreatedEvent: UserCreatedEvent): Promise<void> {
    const mailDeliveryOptions: MailDeliveryOptions =
      this.#userActivationMailDeliveryOptionsFromUserBuilder.build(
        userCreatedEvent.user,
        userCreatedEvent.userCode,
      );

    await this.#mailDeliveryOutputPort.send(mailDeliveryOptions);
  }
}

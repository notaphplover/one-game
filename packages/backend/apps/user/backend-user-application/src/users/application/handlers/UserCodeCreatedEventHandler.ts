import {
  MailDeliveryOptions,
  MailDeliveryOutputPort,
} from '@cornie-js/backend-application-mail';
import { mailDeliveryOutputPortSymbol } from '@cornie-js/backend-application-mail/lib/mail/application/ports/output/MailDeliveryOutputPort';
import { Builder, Handler } from '@cornie-js/backend-common';
import { User, UserCode } from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';

import { PasswordResetMailDeliveryOptionsFromUserBuilder } from '../builders/PasswordResetMailDeliveryOptionsFromUserBuilder';
import { UserCodeCreatedEvent } from '../models/UserCodeCreatedEvent';

@Injectable()
export class UserCodeCreatedEventHandler
  implements Handler<[UserCodeCreatedEvent], void>
{
  readonly #mailDeliveryOutputPort: MailDeliveryOutputPort;
  readonly #passwordResetMailDeliveryOptionsFromUserBuilder: Builder<
    MailDeliveryOptions,
    [User, UserCode]
  >;

  constructor(
    @Inject(mailDeliveryOutputPortSymbol)
    mailDeliveryOutputPort: MailDeliveryOutputPort,
    @Inject(PasswordResetMailDeliveryOptionsFromUserBuilder)
    passwordResetMailDeliveryOptionsFromUserBuilder: Builder<
      MailDeliveryOptions,
      [User, UserCode]
    >,
  ) {
    this.#mailDeliveryOutputPort = mailDeliveryOutputPort;
    this.#passwordResetMailDeliveryOptionsFromUserBuilder =
      passwordResetMailDeliveryOptionsFromUserBuilder;
  }

  public async handle(
    userCodeCreatedEvent: UserCodeCreatedEvent,
  ): Promise<void> {
    const mailDeliveryOptions: MailDeliveryOptions =
      this.#passwordResetMailDeliveryOptionsFromUserBuilder.build(
        userCodeCreatedEvent.user,
        userCodeCreatedEvent.userCode,
      );

    await this.#mailDeliveryOutputPort.send(mailDeliveryOptions);
  }
}

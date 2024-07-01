import {
  MailDeliveryOptions,
  MailDeliveryOutputPort,
  mailDeliveryOutputPortSymbol,
} from '@cornie-js/backend-application-mail';
import { Builder, Handler } from '@cornie-js/backend-common';
import {
  User,
  UserCode,
  UserCodeKind,
} from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';

import { PasswordResetMailDeliveryOptionsFromUserBuilder } from '../builders/PasswordResetMailDeliveryOptionsFromUserBuilder';
import { UserActivationMailDeliveryOptionsFromUserBuilder } from '../builders/UserActivationMailDeliveryOptionsFromUserBuilder';
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
  readonly #userActivationMailDeliveryOptionsFromUserBuilder: Builder<
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
    @Inject(UserActivationMailDeliveryOptionsFromUserBuilder)
    userActivationMailDeliveryOptionsFromUserBuilder: Builder<
      MailDeliveryOptions,
      [User, UserCode]
    >,
  ) {
    this.#mailDeliveryOutputPort = mailDeliveryOutputPort;
    this.#passwordResetMailDeliveryOptionsFromUserBuilder =
      passwordResetMailDeliveryOptionsFromUserBuilder;
    this.#userActivationMailDeliveryOptionsFromUserBuilder =
      userActivationMailDeliveryOptionsFromUserBuilder;
  }

  public async handle(
    userCodeCreatedEvent: UserCodeCreatedEvent,
  ): Promise<void> {
    let mailDeliveryOptions: MailDeliveryOptions;

    switch (userCodeCreatedEvent.userCode.kind) {
      case UserCodeKind.registerConfirm:
        mailDeliveryOptions =
          this.#userActivationMailDeliveryOptionsFromUserBuilder.build(
            userCodeCreatedEvent.user,
            userCodeCreatedEvent.userCode,
          );
        break;
      case UserCodeKind.resetPassword:
        mailDeliveryOptions =
          this.#passwordResetMailDeliveryOptionsFromUserBuilder.build(
            userCodeCreatedEvent.user,
            userCodeCreatedEvent.userCode,
          );
        break;
    }

    await this.#mailDeliveryOutputPort.send(mailDeliveryOptions);
  }
}

import {
  UuidProviderOutputPort,
  uuidProviderOutputPortSymbol,
} from '@cornie-js/backend-app-uuid';
import {
  MailDeliveryOptions,
  MailDeliveryOutputPort,
} from '@cornie-js/backend-application-mail';
import { mailDeliveryOutputPortSymbol } from '@cornie-js/backend-application-mail/lib/mail/application/ports/output/MailDeliveryOutputPort';
import { Builder, Handler } from '@cornie-js/backend-common';
import {
  User,
  UserCode,
  UserCodeCreateQuery,
} from '@cornie-js/backend-user-domain/users';
import { Inject, Injectable } from '@nestjs/common';

import { UuidContext } from '../../../foundation/common/application/models/UuidContext';
import { RandomHexStringBuilder } from '../../../foundation/string/application/builders/RandomHexStringBuilder';
import { UserActivationMailDeliveryOptionsFromUserBuilder } from '../builders/UserActivationMailDeliveryOptionsFromUserBuilder';
import { UserCodeCreateQueryFromUserBuilder } from '../builders/UserCodeCreateQueryFromUserBuilder';
import { USER_CODE_LENGHT } from '../data/userCodeLength';
import { UserCodeContext } from '../models/UserCodeContext';
import { UserCreatedEvent } from '../models/UserCreatedEvent';
import {
  UserCodePersistenceOutputPort,
  userCodePersistenceOutputPortSymbol,
} from '../ports/output/UserCodePersistenceOutputPort';

@Injectable()
export class UserCreatedEventHandler
  implements Handler<[UserCreatedEvent], void>
{
  readonly #mailDeliveryOutputPort: MailDeliveryOutputPort;
  readonly #randomHexStringBuilder: Builder<string, [number]>;
  readonly #userActivationMailDeliveryOptionsFromUserBuilder: Builder<
    MailDeliveryOptions,
    [User, UserCode]
  >;
  readonly #userCodeCreateQueryFromUserBuilder: Builder<
    UserCodeCreateQuery,
    [User, UuidContext & UserCodeContext]
  >;
  readonly #userCodePersistenceOutputPort: UserCodePersistenceOutputPort;
  readonly #uuidProviderOutputPort: UuidProviderOutputPort;

  constructor(
    @Inject(mailDeliveryOutputPortSymbol)
    mailDeliveryOutputPort: MailDeliveryOutputPort,
    @Inject(RandomHexStringBuilder)
    randomHexStringBuilder: Builder<string, [number]>,
    @Inject(UserActivationMailDeliveryOptionsFromUserBuilder)
    userActivationMailDeliveryOptionsFromUserBuilder: Builder<
      MailDeliveryOptions,
      [User, UserCode]
    >,
    @Inject(UserCodeCreateQueryFromUserBuilder)
    userCodeCreateQueryFromUserBuilder: Builder<
      UserCodeCreateQuery,
      [User, UuidContext & UserCodeContext]
    >,
    @Inject(userCodePersistenceOutputPortSymbol)
    userCodePersistenceOutputPort: UserCodePersistenceOutputPort,
    @Inject(uuidProviderOutputPortSymbol)
    uuidProviderOutputPort: UuidProviderOutputPort,
  ) {
    this.#mailDeliveryOutputPort = mailDeliveryOutputPort;
    this.#randomHexStringBuilder = randomHexStringBuilder;
    this.#userActivationMailDeliveryOptionsFromUserBuilder =
      userActivationMailDeliveryOptionsFromUserBuilder;
    this.#userCodeCreateQueryFromUserBuilder =
      userCodeCreateQueryFromUserBuilder;
    this.#userCodePersistenceOutputPort = userCodePersistenceOutputPort;
    this.#uuidProviderOutputPort = uuidProviderOutputPort;
  }

  public async handle(userCreatedEvent: UserCreatedEvent): Promise<void> {
    const userCode: UserCode = await this.#createUserCode(userCreatedEvent);

    const mailDeliveryOptions: MailDeliveryOptions =
      this.#userActivationMailDeliveryOptionsFromUserBuilder.build(
        userCreatedEvent.user,
        userCode,
      );

    await this.#mailDeliveryOutputPort.send(mailDeliveryOptions);
  }

  async #createUserCode(userCreatedEvent: UserCreatedEvent): Promise<UserCode> {
    const userCodeCreateQuery: UserCodeCreateQuery =
      this.#userCodeCreateQueryFromUserBuilder.build(userCreatedEvent.user, {
        userCode: this.#randomHexStringBuilder.build(USER_CODE_LENGHT),
        uuid: this.#uuidProviderOutputPort.generateV4(),
      });

    return this.#userCodePersistenceOutputPort.create(
      userCodeCreateQuery,
      userCreatedEvent.transactionContext,
    );
  }
}

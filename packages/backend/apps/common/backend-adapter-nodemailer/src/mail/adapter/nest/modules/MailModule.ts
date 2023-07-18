import { MailClientOptions } from '@cornie-js/backend-application-mail';
import { mailDeliveryOutputPortSymbol } from '@cornie-js/backend-application-mail/lib/mail/application/ports/output/MailDeliveryOutputPort';
import { DynamicModule, Module } from '@nestjs/common';
import nodemailer from 'nodemailer';

import { MailDeliveryNodeMailerAdapter } from '../../nodemailer/adapters/MailDeliveryNodeMailerAdapter';
import { transporterSymbol } from '../../nodemailer/models/transporterSymbol';

@Module({})
export class MailModule {
  public static forRootAsync(options: MailClientOptions): DynamicModule {
    return {
      global: false,
      module: MailModule,
      providers: [
        {
          provide: transporterSymbol,
          useFactory: () =>
            nodemailer.createTransport({
              auth: {
                pass: options.auth.password,
                user: options.auth.user,
              },
              host: options.host,
              port: options.port,
              secure: options.useTls,
            }),
        },
        {
          provide: mailDeliveryOutputPortSymbol,
          useClass: MailDeliveryNodeMailerAdapter,
        },
      ],
    };
  }
}

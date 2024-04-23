import {
  MailClientOptions,
  mailDeliveryOutputPortSymbol,
} from '@cornie-js/backend-application-mail';
import { DynamicModule, Module } from '@nestjs/common';
import nodemailer from 'nodemailer';

import { MailDeliveryNodeMailerAdapter } from '../../nodemailer/adapters/MailDeliveryNodeMailerAdapter';
import { mailClientOptionsSymbol } from '../../nodemailer/models/mailClientOptionsSymbol';
import { transporterSymbol } from '../../nodemailer/models/transporterSymbol';
import { MailModuleOptions } from '../models/MailModuleOptions';

@Module({})
export class MailModule {
  public static forRootAsync(options: MailModuleOptions): DynamicModule {
    return {
      exports: [mailDeliveryOutputPortSymbol],
      global: false,
      imports: [...(options.imports ?? [])],
      module: MailModule,
      providers: [
        {
          inject: options.inject ?? [],
          provide: mailClientOptionsSymbol,
          useFactory: options.useFactory,
        },
        {
          provide: mailDeliveryOutputPortSymbol,
          useClass: MailDeliveryNodeMailerAdapter,
        },
        {
          inject: [mailClientOptionsSymbol],
          provide: transporterSymbol,
          useFactory: (options: MailClientOptions) =>
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
      ],
    };
  }
}

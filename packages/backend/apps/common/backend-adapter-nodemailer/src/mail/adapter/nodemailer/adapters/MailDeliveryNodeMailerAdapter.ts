import {
  MailDeliveryOptions,
  MailDeliveryOutputPort,
} from '@cornie-js/backend-application-mail';
import { Inject, Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';

import { transporterSymbol } from '../models/transporterSymbol';

@Injectable()
export class MailDeliveryNodeMailerAdapter implements MailDeliveryOutputPort {
  readonly #transporter: nodemailer.Transporter<nodemailer.SentMessageInfo>;

  constructor(
    @Inject(transporterSymbol)
    transporter: nodemailer.Transporter<nodemailer.SentMessageInfo>,
  ) {
    this.#transporter = transporter;
  }

  public async send(deliveryOptions: MailDeliveryOptions): Promise<void> {
    const mailOptions: nodemailer.SendMailOptions =
      this.#buildMailOptions(deliveryOptions);

    await this.#transporter.sendMail(mailOptions);
  }

  #buildMailOptions(
    deliveryOptions: MailDeliveryOptions,
  ): nodemailer.SendMailOptions {
    return {
      from: deliveryOptions.from,
      html: deliveryOptions.html,
      subject: deliveryOptions.subject,
      text: deliveryOptions.text,
      to: deliveryOptions.to,
    };
  }
}

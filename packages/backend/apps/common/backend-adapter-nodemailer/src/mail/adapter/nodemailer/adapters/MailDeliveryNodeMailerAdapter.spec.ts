import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { MailDeliveryOptions } from '@cornie-js/backend-application-mail';
import nodemailer from 'nodemailer';

import { MailDeliveryNodeMailerAdapter } from './MailDeliveryNodeMailerAdapter';

describe(MailDeliveryNodeMailerAdapter.name, () => {
  let transporterMock: jest.Mocked<
    nodemailer.Transporter<nodemailer.SentMessageInfo>
  >;

  let mailDeliveryNodeMailerAdapter: MailDeliveryNodeMailerAdapter;

  beforeAll(() => {
    transporterMock = {
      sendMail: jest.fn(),
    } as Partial<
      jest.Mocked<nodemailer.Transporter<nodemailer.SentMessageInfo>>
    > as jest.Mocked<nodemailer.Transporter<nodemailer.SentMessageInfo>>;

    mailDeliveryNodeMailerAdapter = new MailDeliveryNodeMailerAdapter(
      transporterMock,
    );
  });

  describe('.send', () => {
    let mailDeliveryOptionsFixture: MailDeliveryOptions;

    beforeAll(() => {
      mailDeliveryOptionsFixture = {
        from: 'from.address@example.com',
        html: 'html fixture',
        subject: 'subject',
        text: 'text fixture',
        to: ['to.address@example.com'],
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(async () => {
        transporterMock.sendMail.mockResolvedValueOnce(undefined);

        result = await mailDeliveryNodeMailerAdapter.send(
          mailDeliveryOptionsFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call transporter.sendMail()', () => {
        const expectedSendMailOptions: nodemailer.SendMailOptions = {
          from: mailDeliveryOptionsFixture.from,
          html: mailDeliveryOptionsFixture.html,
          subject: mailDeliveryOptionsFixture.subject,
          text: mailDeliveryOptionsFixture.text,
          to: mailDeliveryOptionsFixture.to,
        };

        expect(transporterMock.sendMail).toHaveBeenCalledTimes(1);
        expect(transporterMock.sendMail).toHaveBeenCalledWith(
          expectedSendMailOptions,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});

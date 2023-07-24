import { MaildevMail } from '../types/MaildevMail';
import { MaildevMailAddress } from '../types/MaildevMailAddress';
import { getMaildevServerMails } from './getMaildevServerMails';

export async function getMaildevServerEmailsToUser(
  emailAddress: string,
): Promise<MaildevMail[]> {
  const emails: MaildevMail[] = await getMaildevServerMails();

  const addressEmails: MaildevMail[] = emails.filter(
    (maildevMail: MaildevMail) =>
      maildevMail.to.some(
        (address: MaildevMailAddress) => address.address === emailAddress,
      ),
  );

  return addressEmails;
}

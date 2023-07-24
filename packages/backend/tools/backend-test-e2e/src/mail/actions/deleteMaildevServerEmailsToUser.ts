import { MaildevMail } from '../types/MaildevMail';
import { deleteMaildevServerEmail } from './deleteMaildevServerEmail';
import { getMaildevServerEmailsToUser } from './getMaildevServerEmailsToUser';

export async function deleteMaildevServerEmailsToAddress(
  emailAddress: string,
): Promise<MaildevMail[]> {
  const addressEmails: MaildevMail[] = await getMaildevServerEmailsToUser(
    emailAddress,
  );

  await Promise.all(
    addressEmails.map(async (addressEmail: MaildevMail) =>
      deleteMaildevServerEmail(addressEmail.id),
    ),
  );

  return addressEmails;
}

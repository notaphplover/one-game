import { MaildevMailAddress } from './MaildevMailAddress';

export interface MaildevMail extends Record<string, unknown> {
  id: string;
  from: MaildevMailAddress[];
  html?: string;
  subject: string;
  text?: string;
  to: MaildevMailAddress[];
}

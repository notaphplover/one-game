export interface MailDeliveryOptions {
  from: string;
  html?: string;
  text?: string;
  subject: string;
  to: string[];
}

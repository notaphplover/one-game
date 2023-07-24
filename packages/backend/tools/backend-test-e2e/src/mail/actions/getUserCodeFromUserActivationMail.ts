import { MaildevMail } from '../types/MaildevMail';

const USER_CONFIRMATION_LINK_REGEX: RegExp =
  /<a[\s]+href="[^?]+\?code=([^"]+)">[^<]+<\/a>/;

export function getUserCodeFromUserActivationMail(
  maildevMail: MaildevMail,
): string | undefined {
  if (maildevMail.html === undefined) {
    return undefined;
  }

  const regexpMatches: RegExpMatchArray | null = maildevMail.html.match(
    USER_CONFIRMATION_LINK_REGEX,
  );

  if (regexpMatches === null) {
    return undefined;
  }

  const firstMatch: string | undefined = regexpMatches[1];

  if (firstMatch === undefined) {
    return undefined;
  }

  return firstMatch;
}

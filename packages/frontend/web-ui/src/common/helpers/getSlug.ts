import { PageName } from '../models/PageName';

const NAVBAR_PAGE_NAME_TO_PAGE_SLUG_MAP: { [TPage in PageName]: string } = {
  [PageName.createGame]: '/games/create',
  [PageName.login]: '/auth/login',
  [PageName.game]: '/games',
  [PageName.home]: '/',
  [PageName.joinGame]: '/games/join',
  [PageName.publicGames]: '/games/public',
  [PageName.register]: '/auth/register',
  [PageName.userMe]: '/users/me',
  [PageName.forgot]: '/auth/forgot',
  [PageName.reset]: '/auth/reset-password',
};

export function getSlug(pageName: PageName): string {
  return NAVBAR_PAGE_NAME_TO_PAGE_SLUG_MAP[pageName];
}

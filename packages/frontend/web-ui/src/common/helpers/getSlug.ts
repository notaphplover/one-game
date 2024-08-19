import { NavbarPageName } from '../models/NavbarPageName';

const NAVBAR_PAGE_NAME_TO_PAGE_SLUG_MAP: { [TPage in NavbarPageName]: string } =
  {
    [NavbarPageName.createGame]: '/games',
    [NavbarPageName.login]: '/auth/login',
    [NavbarPageName.logout]: '/',
    [NavbarPageName.register]: '/auth/register',
    [NavbarPageName.user]: '/users/me',
  };

export function getSlug(pageName: NavbarPageName): string {
  return NAVBAR_PAGE_NAME_TO_PAGE_SLUG_MAP[pageName];
}

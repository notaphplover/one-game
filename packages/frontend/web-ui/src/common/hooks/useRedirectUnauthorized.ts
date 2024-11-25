import { useEffect } from 'react';
import {
  Location,
  NavigateFunction,
  useLocation,
  useNavigate,
} from 'react-router';

import { selectAuthenticatedAuth } from '../../app/store/features/authSlice';
import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';
import { useAppSelector } from '../../app/store/hooks';
import { getSlug } from '../helpers/getSlug';
import { PageName } from '../models/PageName';

function buildLoginPageUrl(redirectTo: URL): string {
  return `${getSlug(PageName.login)}?redirectTo=${encodeURIComponent(redirectTo.toString())}`;
}

/**
 * Gets the URL to the current location.
 *
 * Assumptions:
 *  - The current URL host is the same as the destination host.
 *
 * @param location react router location
 */
function getReactStrictModeFriendlyCurrentUrl(location: Location): URL {
  /*
   * Since both source and destination hosts are the same,
   * it's safe to rely on the current href as base URL.
   *
   * Tbh, this sucks, but it doesn't seem to be a better way
   * since React won't provide a more detailed location object...
   */
  return new URL(
    `${location.pathname}${location.search}`,
    window.location.href,
  );
}

export function useRedirectUnauthorized(): void {
  const location: Location = useLocation();
  const navigate: NavigateFunction = useNavigate();

  const auth: AuthenticatedAuthState | null = useAppSelector(
    selectAuthenticatedAuth,
  );

  useEffect(() => {
    if (auth === null) {
      void navigate(
        buildLoginPageUrl(getReactStrictModeFriendlyCurrentUrl(location)),
      );
    }
  }, [auth]);
}

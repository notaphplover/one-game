import { useEffect } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import { selectAuthenticatedAuth } from '../../app/store/features/authSlice';
import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';
import { useAppSelector } from '../../app/store/hooks';
import { getSlug } from '../helpers/getSlug';
import { PageName } from '../models/PageName';

export function useRedirectAuthorized(skip?: boolean): void {
  const navigate: NavigateFunction = useNavigate();

  const auth: AuthenticatedAuthState | null = useAppSelector(
    selectAuthenticatedAuth,
  );

  const shouldSkipNavigation: boolean = skip ?? false;

  useEffect(() => {
    if (auth !== null && !shouldSkipNavigation) {
      navigate(getSlug(PageName.home));
    }
  }, [auth, skip]);
}

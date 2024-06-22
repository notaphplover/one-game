import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { selectAuthenticatedAuth } from '../../app/store/features/authSlice';
import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';
import { useAppSelector } from '../../app/store/hooks';

export function useRedirectUnauthorized(): void {
  const navigate = useNavigate();

  const auth: AuthenticatedAuthState | null = useAppSelector(
    selectAuthenticatedAuth,
  );

  useEffect(() => {
    if (auth === null) {
      navigate('/');
    }
  }, [auth]);
}

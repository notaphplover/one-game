import { AuthStateStatus } from '../../../../app/store/helpers/models/AuthStateStatus';
import { useAppSelector } from '../../../../app/store/hooks';
import { RootState } from '../../../../app/store/store';
import { UseGetGamesContext } from '../models/UseGetGamesContext';

export function buildContext(): UseGetGamesContext {
  const token: string | null = useAppSelector((state: RootState) =>
    state.auth.status === AuthStateStatus.authenticated
      ? state.auth.token
      : null,
  );

  return {
    token,
  };
}

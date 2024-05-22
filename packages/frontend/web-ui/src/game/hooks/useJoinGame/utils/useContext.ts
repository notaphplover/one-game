import { selectAuthToken } from '../../../../app/store/features/authSlice';
import { selectFulfilledUser } from '../../../../app/store/features/userSlice';
import { FulfilledUserState } from '../../../../app/store/helpers/models/UserState';
import { useAppSelector } from '../../../../app/store/hooks';
import { UseJoinGameContext } from '../models/UseJoinGameContext';

export function useContext(): { context: UseJoinGameContext } {
  const token: string | null = useAppSelector(selectAuthToken);
  const user: FulfilledUserState | null = useAppSelector(selectFulfilledUser);

  return {
    context: { token, userId: user?.userId ?? null },
  };
}

import { selectAuthToken } from '../../../../app/store/features/authSlice';
import { useAppSelector } from '../../../../app/store/hooks';
import { UseGetGamesContext } from '../models/UseGetGamesContext';

export function useContext(): { context: UseGetGamesContext } {
  const token: string | null = useAppSelector(selectAuthToken);

  return {
    context: { token },
  };
}

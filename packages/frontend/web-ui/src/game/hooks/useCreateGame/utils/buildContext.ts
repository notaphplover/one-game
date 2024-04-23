import { selectAuthToken } from '../../../../app/store/features/authSlice';
import { useAppSelector } from '../../../../app/store/hooks';
import { UseCreateGameContext } from '../models/UseCreateGameContext';

export function buildContext(): UseCreateGameContext {
  const token: string | null = useAppSelector(selectAuthToken);

  return {
    token,
  };
}

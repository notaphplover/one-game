import { JoinExistingGameStatus } from './JoinExistingGameStatus';

export interface UseJoinExistingGameResult {
  status: JoinExistingGameStatus;
  redirectTo: string | null;
  errorMessage: string | null;
}

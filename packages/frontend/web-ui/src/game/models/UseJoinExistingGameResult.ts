import { JoinExistingGameStatus } from './JoinExistingGameStatus';

export interface UseJoinExistingGameResult {
  status: JoinExistingGameStatus;
  errorMessage: string | null;
}

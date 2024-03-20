import { RegisterConfirmStatus } from './RegisterConfirmStatus';

export interface UseRegisterConfirmResult {
  status: RegisterConfirmStatus;
  errorMessage: string | null;
}

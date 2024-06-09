export enum CreateNewGameStatus {
  initial = 0,
  validatingForm = 1,
  formValidated = 2,
  formValidationError = 3,
  creatingGame = 4,
  gameCreated = 5,
  joiningGame = 6,
  backendError = 7,
  done = 8,
}

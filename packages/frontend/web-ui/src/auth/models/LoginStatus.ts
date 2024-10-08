export enum LoginStatus {
  initial = 0,
  pendingValidation = 1,
  validationKO = 2,
  pendingBackend = 3,
  creatingAuth = 4,
  backendKO = 5,
  backendOK = 6,
}

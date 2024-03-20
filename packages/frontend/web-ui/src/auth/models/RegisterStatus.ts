export enum RegisterStatus {
  initial = 0,
  pendingValidation = 1,
  validationKO = 2,
  pendingBackend = 3,
  backendKO = 4,
  backendOK = 5,
}

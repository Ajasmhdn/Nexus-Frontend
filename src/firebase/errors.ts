
/**
 * @fileOverview Mock exception classes for UI focus.
 */
export class FirestorePermissionError extends Error {
  constructor(info: any) {
    super(`Permission denied: ${JSON.stringify(info)}`);
  }
}

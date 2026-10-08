
let lastError: Error | null = null;

export function captureError(error: Error) {
  lastError = error;
}

export function consumeLastCapturedError(): Error | null {
  const error = lastError;
  lastError = null;
  return error;
}

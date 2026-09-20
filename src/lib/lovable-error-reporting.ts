type LovableErrorOptions = {
  boundary?: string;
};

type LovableEvents = {
  captureException?: (
    error: unknown,
    options?: LovableErrorOptions,
  ) => void;
};

declare global {
  interface Window {
    __lovableEvents?: LovableEvents;
    __lovableReportRuntimeError?: (payload: {
      error: unknown;
      context?: Record<string, unknown>;
    }) => void;
  }
}

export function reportLovableError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  window.__lovableEvents?.captureException?.(
    error,
    context.boundary ? { boundary: String(context.boundary) } : undefined,
  );

  window.__lovableReportRuntimeError?.({
    error,
    context,
  });
}

// Simplified error reporting to avoid complex type issues
// This will be moved to infrastructure layer later

interface LovableEvents {
  captureException?: (error: unknown, context: Record<string, unknown>) => void;
}

interface WindowWithLovable extends Window {
  __lovableEvents?: LovableEvents;
  __lovableReportRuntimeError?: (data: {
    error: unknown;
    context: Record<string, unknown>;
  }) => void;
}

export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  // Try to report to lovable if available
  try {
    const win = window as WindowWithLovable;
    const lovableEvents = win.__lovableEvents;
    if (lovableEvents?.captureException) {
      lovableEvents.captureException(error, context);
    }

    const lovableReportRuntimeError = win.__lovableReportRuntimeError;
    if (lovableReportRuntimeError) {
      lovableReportRuntimeError({ error, context });
    }
  } catch (e) {
    // Fallback to console if lovable integration fails
    console.error("Error reporting failed:", e);
    console.error("Original error:", error);
    console.error("Context:", context);
  }
}

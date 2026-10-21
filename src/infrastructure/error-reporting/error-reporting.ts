// Simplified error reporting to avoid complex type issues
// This will be moved to infrastructure layer later

export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  // Try to report to lovable if available (with type assertion to avoid TS errors)
  try {
    // @ts-ignore - lovable integration
    const lovableEvents = (window as any).__lovableEvents;
    if (lovableEvents?.captureException) {
      lovableEvents.captureException(error, context);
    }

    // @ts-ignore - lovable integration
    const lovableReportRuntimeError = (window as any).__lovableReportRuntimeError;
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

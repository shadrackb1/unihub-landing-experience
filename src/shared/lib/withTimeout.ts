/**
 * Promise timeout utility.
 * Use for Firestore reads/writes that hang (retry forever) when the backend is
 * unreachable — time them out so screens always get real feedback.
 */
export function withTimeout<A>(promise: Promise<A>, ms = 8000, what = "The database"): Promise<A> {
  let timer: ReturnType<typeof setTimeout>;
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      timer = setTimeout(
        () => reject(new Error(`${what} did not respond in time. Please try again in a moment.`)),
        ms,
      );
    }),
  ]).finally(() => clearTimeout(timer!));
}

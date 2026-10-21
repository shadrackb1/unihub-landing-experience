import type {
  ReactNode,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
} from "react";

export const inputCls =
  "w-full min-h-11 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none";
export const btnPrimary =
  "cta-shine inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-50";
export const btnGhost =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-border bg-accent px-4 text-sm font-medium text-foreground hover:bg-secondary disabled:opacity-50";
export const btnDanger =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-destructive/40 px-4 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-secondary-foreground">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

export const TextInput = (p: InputHTMLAttributes<HTMLInputElement>) => (
  <input {...p} className={inputCls} />
);
export const TextArea = (p: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...p} className={`${inputCls} min-h-28`} />
);
export const Select = (p: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...p} className={inputCls} />
);

const tone: Record<string, string> = {
  approved: "bg-status text-status-foreground",
  published: "bg-status text-status-foreground",
  active: "bg-status text-status-foreground",
  pending: "bg-accent text-foreground",
  requested: "bg-accent text-foreground",
  rejected: "bg-destructive/15 text-destructive",
  suspended: "bg-destructive/15 text-destructive",
  hidden: "bg-muted text-muted-foreground",
  none: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${tone[status] ?? tone["none"]}`}
    >
      {label ?? status}
    </span>
  );
}

export function Notice({
  kind = "info",
  children,
}: {
  kind?: "info" | "error";
  children: ReactNode;
}) {
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      className={`rounded-xl border p-4 text-sm ${kind === "error" ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-border bg-accent text-secondary-foreground"}`}
    >
      {children}
    </div>
  );
}

export function errMsg(e: unknown): string {
  const m = e instanceof Error ? e.message : String(e);
  if (m.includes("permission"))
    return "You don't have permission for this action. Check the Firestore security rules.";
  if (m.includes("email-already-in-use"))
    return "An account with this email already exists. Sign in instead.";
  if (m.includes("invalid-credential") || m.includes("wrong-password"))
    return "Incorrect email or password.";
  if (m.includes("weak-password")) return "Password must be at least 6 characters.";
  return m.replace(/^Firebase:\s*/, "");
}

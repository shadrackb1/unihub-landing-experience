import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, Loader2 } from "lucide-react";
import { draftListingDescription } from "./ai.functions";

type Details = {
  title?: string;
  type?: string;
  campus?: string;
  location?: string;
  price?: string;
  deposit?: string;
  amenities?: string;
};

export function AiDescriptionAssistant({
  details,
  onApply,
}: {
  details: Details;
  onApply: (text: string) => void;
}) {
  const draft = useServerFn(draftListingDescription);
  const [notes, setNotes] = useState("");
  const [tone, setTone] = useState<"clear" | "safety" | "budget">("clear");
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await draft({
        data: {
          ...Object.fromEntries(Object.entries(details).map(([k, v]) => [k, String(v ?? "")])),
          notes,
          tone,
        },
      });
      if (r.error) setError(r.error);
      else setResult(r.text);
    } catch {
      setError("Couldn't reach the assistant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card space-y-3 rounded-3xl border border-border p-5">
      <div className="flex items-center gap-2 text-foreground">
        <Sparkles className="h-4 w-4" aria-hidden />
        <h3 className="font-display text-base font-medium">AI description assistant</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        Uses your property details above. Add anything students should know.
      </p>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        maxLength={1200}
        placeholder="e.g. 5 min walk to main gate, borehole water, CCTV, quiet study area"
        className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <div className="flex flex-wrap items-center gap-2">
        {(["clear", "safety", "budget"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTone(t)}
            aria-pressed={tone === t}
            className={`rounded-full border px-3 py-1 text-xs ${tone === t ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground"}`}
          >
            {t === "clear"
              ? "Clear & direct"
              : t === "safety"
                ? "Safety-focused"
                : "Budget-friendly"}
          </button>
        ))}
        <button
          type="button"
          onClick={run}
          disabled={loading}
          className="cta-shine ml-auto inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {loading ? "Drafting…" : result ? "Regenerate" : "Generate with AI"}
        </button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {result && (
        <div className="space-y-2">
          <textarea
            value={result}
            onChange={(e) => setResult(e.target.value)}
            rows={8}
            className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm text-foreground"
          />
          <button
            type="button"
            onClick={() => onApply(result)}
            className="rounded-full border border-border px-4 py-2 text-sm text-foreground hover:bg-accent"
          >
            Use this description
          </button>
        </div>
      )}
    </div>
  );
}

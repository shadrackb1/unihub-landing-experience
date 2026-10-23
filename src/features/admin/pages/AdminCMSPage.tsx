import { useLoaderData } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Save,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Star,
  Palette,
  Users,
  ExternalLink,
  Plus,
  Trash2,
  Info,
} from "lucide-react";
import { sampleListings } from "@/data/listings";
import { invalidateSiteSettings } from "@/shared/hooks/useSiteSettings";
import { cn } from "@/shared/lib/utils";

/**
 * Admin site builder.
 *
 * This is a content surface, not another dashboard: it edits the four things
 * the public site actually reads — the hero, the featured listings, the theme
 * tokens and the team — and saves them to `/api/site-settings` (Prisma), which
 * is the same source the homepage, the About page and the theme loader use.
 *
 * Nothing here talks to Firestore, and the preview is the real published page
 * rather than a mock, so "saved" means what a visitor would see.
 */

interface ThemeForm {
  primaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  borderRadius: string;
  fontFamily: string;
}

interface TeamMemberForm {
  name: string;
  role: string;
  photoUrl: string;
}

interface FormState {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  ctaText: string;
  featuredProperties: string[];
  theme: ThemeForm;
  features: { enableBlog: boolean };
  teamMembers: TeamMemberForm[];
}

const DEFAULT_THEME: ThemeForm = {
  primaryColor: "#c6f24e",
  backgroundColor: "#0d0d0f",
  surfaceColor: "#17171a",
  borderRadius: "1.5rem",
  fontFamily: "Inter",
};

const FONT_OPTIONS = ["Inter", "Space Grotesk", "Poppins", "Roboto", "Nunito"];
const RADIUS_OPTIONS = [
  { value: "0rem", label: "Square" },
  { value: "0.5rem", label: "Small" },
  { value: "1rem", label: "Medium" },
  { value: "1.5rem", label: "Large (current)" },
  { value: "2rem", label: "Extra large" },
];

type Tab = "content" | "theme" | "team";

const TABS: { id: Tab; label: string; icon: typeof Star }[] = [
  { id: "content", label: "Content", icon: Star },
  { id: "theme", label: "Theme", icon: Palette },
  { id: "team", label: "Team", icon: Users },
];

interface RawSettings {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  ctaText?: string;
  featuredProperties?: string[];
  theme?: Partial<ThemeForm>;
  features?: { enableBlog?: boolean };
  teamMembers?: TeamMemberForm[];
  updatedAt?: string | null;
  updatedBy?: string | null;
}

function buildState(settings: RawSettings | null | undefined): FormState {
  return {
    heroTitle: settings?.heroTitle ?? "",
    heroSubtitle: settings?.heroSubtitle ?? "",
    heroImage: settings?.heroImage ?? "",
    ctaText: settings?.ctaText ?? "",
    featuredProperties: settings?.featuredProperties ?? [],
    theme: { ...DEFAULT_THEME, ...(settings?.theme ?? {}) },
    features: { enableBlog: settings?.features?.enableBlog === true },
    teamMembers: settings?.teamMembers ?? [],
  };
}

export const routeOptions = {
  loader: async (): Promise<{ settings: RawSettings | null; error: string | null }> => {
    const response = await fetch("/api/site-settings", {
      headers: { accept: "application/json" },
      credentials: "include",
    });
    if (!response.ok) {
      return { settings: null, error: `Could not load site content (${response.status}).` };
    }
    const payload = (await response.json()) as { settings?: RawSettings };
    return { settings: payload.settings ?? null, error: null };
  },
};

const fieldClass =
  "w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60";

const labelClass = "mb-1.5 block text-sm font-medium text-secondary-foreground";
const hintClass = "mt-1 text-xs leading-relaxed text-muted-foreground";

export const AdminCMSPage = () => {
  const loaderData =
    (useLoaderData({ strict: false }) as
      { settings?: RawSettings | null; error?: string | null } | undefined) ?? {};

  const initial = useMemo(() => buildState(loaderData.settings), [loaderData.settings]);

  const [form, setForm] = useState<FormState>(initial);
  // What the server currently holds. Saving moves the baseline forward so the
  // editor stops reporting "unsaved changes" the moment the save succeeds.
  const [baseline, setBaseline] = useState<FormState>(initial);
  const [tab, setTab] = useState<Tab>("content");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(loaderData.error ?? null);
  const [savedAt, setSavedAt] = useState<string | null>(loaderData.settings?.updatedAt ?? null);
  const [savedBy, setSavedBy] = useState<string | null>(loaderData.settings?.updatedBy ?? null);
  const [success, setSuccess] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    setForm(initial);
    setBaseline(initial);
  }, [initial]);

  const dirty = JSON.stringify(form) !== JSON.stringify(baseline);
  const featuredCount = form.featuredProperties.length;

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setSuccess(false);
  };

  const updateTheme = (key: keyof ThemeForm, value: string) => {
    setForm((previous) => ({ ...previous, theme: { ...previous.theme, [key]: value } }));
    setSuccess(false);
  };

  const toggleFeatured = (id: string) => {
    const next = form.featuredProperties.includes(id)
      ? form.featuredProperties.filter((item) => item !== id)
      : [...form.featuredProperties, id];
    update("featuredProperties", next);
  };

  const updateMember = (index: number, patch: Partial<TeamMemberForm>) => {
    update(
      "teamMembers",
      form.teamMembers.map((member, i) => (i === index ? { ...member, ...patch } : member)),
    );
  };

  const addMember = () => {
    if (form.teamMembers.length >= 12) {
      setError("The team section holds at most 12 people.");
      return;
    }
    update("teamMembers", [...form.teamMembers, { name: "", role: "", photoUrl: "" }]);
  };

  const removeMember = (index: number) => {
    update(
      "teamMembers",
      form.teamMembers.filter((_, i) => i !== index),
    );
  };

  const reset = () => {
    setForm(baseline);
    setError(null);
    setSuccess(false);
  };

  const save = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await fetch("/api/site-settings", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        settings?: RawSettings;
        error?: string;
      };
      if (!response.ok) {
        throw new Error(payload.error ?? `Could not save the site content (${response.status}).`);
      }
      setSavedAt(payload.settings?.updatedAt ?? new Date().toISOString());
      setSavedBy(payload.settings?.updatedBy ?? null);
      setBaseline(form);
      setSuccess(true);
      invalidateSiteSettings();
      setPreviewKey((key) => key + 1);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save the site content.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Site builder</p>
          <h1 className="mt-2 font-display text-2xl font-medium leading-tight sm:text-3xl">
            Public site content
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            What visitors see on the homepage and the About page. Changes go live as soon as you
            save; there is no draft.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={reset}
            disabled={!dirty || isSaving}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:bg-accent disabled:opacity-50"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Discard
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!dirty || isSaving}
            className="cta-shine inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Save className="size-4" aria-hidden="true" />
            )}
            {isSaving ? "Saving…" : dirty ? "Save changes" : "Saved"}
          </button>
        </div>
      </header>

      {success ? (
        <p
          role="status"
          className="flex items-center gap-2 rounded-xl border border-status/30 bg-status/10 px-4 py-3 text-sm text-status"
        >
          <CheckCircle className="size-4 shrink-0" aria-hidden="true" />
          Saved. The homepage and About page now show this content.
        </p>
      ) : null}

      {error ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {savedAt ? (
          <span>
            Last saved {new Date(savedAt).toLocaleString()}
            {savedBy ? ` by ${savedBy}` : ""}
          </span>
        ) : (
          <span>Nothing saved yet — the site is showing its built-in copy.</span>
        )}
        {dirty ? <span className="text-highlight">Unsaved changes</span> : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <div role="tablist" aria-label="Site builder sections" className="flex flex-wrap gap-2">
            {TABS.map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`panel-${item.id}`}
                  id={`tab-${item.id}`}
                  onClick={() => setTab(item.id)}
                  className={cn(
                    "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors",
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card text-secondary-foreground hover:border-foreground/40",
                  )}
                >
                  <item.icon className="size-4" aria-hidden="true" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {tab === "content" ? (
            <section
              id="panel-content"
              role="tabpanel"
              aria-labelledby="tab-content"
              className="mt-4 space-y-5 rounded-2xl border border-border bg-card p-5 sm:p-6"
            >
              <div>
                <label className={labelClass} htmlFor="heroTitle">
                  Hero headline
                </label>
                <input
                  id="heroTitle"
                  value={form.heroTitle}
                  onChange={(event) => update("heroTitle", event.target.value)}
                  className={fieldClass}
                  placeholder="Find your perfect home."
                  maxLength={90}
                  disabled={isSaving}
                />
                <p className={hintClass}>{form.heroTitle.length}/90 characters.</p>
              </div>

              <div>
                <label className={labelClass} htmlFor="heroSubtitle">
                  Hero supporting line
                </label>
                <textarea
                  id="heroSubtitle"
                  value={form.heroSubtitle}
                  onChange={(event) => update("heroSubtitle", event.target.value)}
                  className={fieldClass}
                  rows={3}
                  maxLength={220}
                  placeholder="Browse verified hostels, bedsitters, and rentals near campus."
                  disabled={isSaving}
                />
                <p className={hintClass}>{form.heroSubtitle.length}/220 characters.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="ctaText">
                    Button label
                  </label>
                  <input
                    id="ctaText"
                    value={form.ctaText}
                    onChange={(event) => update("ctaText", event.target.value)}
                    className={fieldClass}
                    placeholder="Browse Listings"
                    maxLength={40}
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="heroImage">
                    Hero image URL
                  </label>
                  <input
                    id="heroImage"
                    type="url"
                    value={form.heroImage}
                    onChange={(event) => update("heroImage", event.target.value)}
                    className={fieldClass}
                    placeholder="https://…"
                    disabled={isSaving}
                  />
                  <p className={hintClass}>
                    Leave blank to keep the video and poster the site ships with.
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-display text-base font-medium">Featured listings</h2>
                  <span className="text-xs text-muted-foreground">
                    {featuredCount} of 12 selected
                  </span>
                </div>
                <p className={hintClass}>
                  Featured listings appear in the homepage rail in the order they are selected.
                </p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {sampleListings.map((listing) => {
                    const id = listing.id ?? listing.title;
                    const checked = form.featuredProperties.includes(id);
                    return (
                      <li key={id}>
                        <label
                          className={cn(
                            "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors",
                            checked
                              ? "border-foreground/40 bg-accent"
                              : "border-border hover:border-foreground/30",
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleFeatured(id)}
                            className="mt-1 size-4"
                            disabled={isSaving}
                          />
                          <span className="min-w-0">
                            <span className="block text-sm font-medium leading-snug">
                              {listing.title}
                            </span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">
                              {listing.location} · {listing.price}
                            </span>
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          ) : null}

          {tab === "theme" ? (
            <section
              id="panel-theme"
              role="tabpanel"
              aria-labelledby="tab-theme"
              className="mt-4 space-y-5 rounded-2xl border border-border bg-card p-5 sm:p-6"
            >
              <p className="flex items-start gap-2 rounded-xl border border-border bg-background/40 p-3 text-xs leading-relaxed text-muted-foreground">
                <Info className="mt-0.5 size-4 shrink-0 text-highlight" aria-hidden="true" />
                The theme is applied to the whole public site the next time a page loads. Admin
                screens keep the console palette so they stay readable while you work.
              </p>

              <div className="grid gap-4 sm:grid-cols-3">
                {(
                  [
                    ["primaryColor", "Accent"],
                    ["backgroundColor", "Background"],
                    ["surfaceColor", "Surface"],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key}>
                    <label className={labelClass} htmlFor={key}>
                      {label}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id={key}
                        type="color"
                        value={form.theme[key]}
                        onChange={(event) => updateTheme(key, event.target.value)}
                        className="size-10 shrink-0 rounded-lg border border-input bg-transparent p-0"
                        disabled={isSaving}
                      />
                      <input
                        aria-label={`${label} hex value`}
                        value={form.theme[key]}
                        onChange={(event) => updateTheme(key, event.target.value)}
                        className={fieldClass}
                        spellCheck={false}
                        disabled={isSaving}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="fontFamily">
                    Font
                  </label>
                  <select
                    id="fontFamily"
                    value={form.theme.fontFamily}
                    onChange={(event) => updateTheme("fontFamily", event.target.value)}
                    className={fieldClass}
                    disabled={isSaving}
                  >
                    {FONT_OPTIONS.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="borderRadius">
                    Corner radius
                  </label>
                  <select
                    id="borderRadius"
                    value={form.theme.borderRadius}
                    onChange={(event) => updateTheme("borderRadius", event.target.value)}
                    className={fieldClass}
                    disabled={isSaving}
                  >
                    {RADIUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-xl border border-border p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Preview</p>
                <div
                  className="mt-3 overflow-hidden border border-border"
                  style={{
                    borderRadius: form.theme.borderRadius,
                    background: form.theme.backgroundColor,
                    fontFamily: `"${form.theme.fontFamily}", sans-serif`,
                  }}
                >
                  <div className="p-5">
                    <p
                      className="font-semibold leading-tight"
                      style={{ color: form.theme.primaryColor }}
                    >
                      {form.heroTitle || "Find your perfect home."}
                    </p>
                    <p className="mt-2 text-sm text-white/70">
                      {form.heroSubtitle || "Verified student housing near campus."}
                    </p>
                    <span
                      className="mt-4 inline-flex px-4 py-2 text-xs font-semibold text-black"
                      style={{
                        background: form.theme.primaryColor,
                        borderRadius: form.theme.borderRadius,
                      }}
                    >
                      {form.ctaText || "Browse Listings"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-5">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={form.features.enableBlog}
                    onChange={(event) =>
                      update("features", { ...form.features, enableBlog: event.target.checked })
                    }
                    className="mt-1 size-4"
                    disabled={isSaving}
                  />
                  <span>
                    <span className="block text-sm font-medium">Show the blog section</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      Reserved for the articles rail. Nothing is shown until published posts exist.
                    </span>
                  </span>
                </label>
              </div>
            </section>
          ) : null}

          {tab === "team" ? (
            <section
              id="panel-team"
              role="tabpanel"
              aria-labelledby="tab-team"
              className="mt-4 space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-base font-medium">Team</h2>
                  <p className={hintClass}>Shown on the About page, in this order.</p>
                </div>
                <button
                  type="button"
                  onClick={addMember}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold hover:bg-accent"
                  disabled={isSaving}
                >
                  <Plus className="size-4" aria-hidden="true" />
                  Add member
                </button>
              </div>

              {form.teamMembers.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  No team members yet. The About page hides this section until at least one is
                  added.
                </p>
              ) : (
                <ul className="space-y-3">
                  {form.teamMembers.map((member, index) => (
                    <li
                      key={index}
                      className="grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-[64px_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-start"
                    >
                      <div className="grid size-16 place-items-center overflow-hidden rounded-lg border border-border bg-background">
                        {member.photoUrl ? (
                          <img
                            src={member.photoUrl}
                            alt=""
                            className="size-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <Users className="size-5 text-muted-foreground" aria-hidden="true" />
                        )}
                      </div>
                      <div>
                        <label className="sr-only" htmlFor={`member-name-${index}`}>
                          Team member {index + 1} name
                        </label>
                        <input
                          id={`member-name-${index}`}
                          value={member.name}
                          onChange={(event) => updateMember(index, { name: event.target.value })}
                          className={fieldClass}
                          placeholder="Full name"
                          maxLength={80}
                          disabled={isSaving}
                        />
                        <label className="sr-only" htmlFor={`member-role-${index}`}>
                          Team member {index + 1} role
                        </label>
                        <input
                          id={`member-role-${index}`}
                          value={member.role}
                          onChange={(event) => updateMember(index, { role: event.target.value })}
                          className={`${fieldClass} mt-2`}
                          placeholder="Role or title"
                          maxLength={80}
                          disabled={isSaving}
                        />
                      </div>
                      <div>
                        <label className="sr-only" htmlFor={`member-photo-${index}`}>
                          Team member {index + 1} photo URL
                        </label>
                        <input
                          id={`member-photo-${index}`}
                          type="url"
                          value={member.photoUrl}
                          onChange={(event) =>
                            updateMember(index, { photoUrl: event.target.value })
                          }
                          className={fieldClass}
                          placeholder="https://… photo URL"
                          disabled={isSaving}
                        />
                        <p className={hintClass}>Optional. A square image works best.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMember(index)}
                        aria-label={`Remove ${member.name || `team member ${index + 1}`}`}
                        className="inline-flex size-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
                        disabled={isSaving}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ) : null}
        </div>

        <aside className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Published homepage
            </p>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-highlight hover:underline"
            >
              Open
              <ExternalLink className="size-3" aria-hidden="true" />
            </a>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-background">
            <iframe
              key={previewKey}
              src="/"
              title="Published homepage preview"
              className="h-[520px] w-full"
              loading="lazy"
            />
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            The preview is the live page. Save to see your changes appear in it.
          </p>
        </aside>
      </div>
    </div>
  );
};

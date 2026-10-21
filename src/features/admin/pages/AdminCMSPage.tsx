import { useLoaderData } from "@tanstack/react-router";
import {
  Settings,
  Save,
  RefreshCw,
  Eye,
  Plus,
  Trash2,
  ImagePlus,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Star,
  Palette,
  Users,
  Layout,
} from "lucide-react";
import { useState } from "react";
import { updateSiteSettingsData, getSiteSettingsData } from "@/shared/services/firestore";
import { uploadToCloudinary } from "@/shared/lib/cloudinary";
import { cn } from "@/shared/lib/utils";
import type { TeamMember } from "@/shared/types/admin";

/** Firestore writes hang (retry forever) when the backend is unreachable;
 *  time them out so the Save button always returns with real user feedback. */
function withTimeout<A>(promise: Promise<A>, ms = 8000): Promise<A> {
  let timer: ReturnType<typeof setTimeout>;
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      timer = setTimeout(
        () =>
          reject(new Error("The database did not respond in time. Please try again in a moment.")),
        ms,
      );
    }),
  ]).finally(() => clearTimeout(timer!));
}

export const routeOptions = {
  loader: async () => {
    const settings = await getSiteSettingsData();
    return { settings };
  },
};

type ThemeForm = {
  primaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  borderRadius: string;
  fontFamily: string;
  animationSpeed: string;
};

type FormState = {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  ctaText: string;
  featuredProperties: string[];
  theme: ThemeForm;
  features: { enableBlog: boolean };
  teamMembers: TeamMember[];
};

const DEFAULT_THEME: ThemeForm = {
  primaryColor: "#3b82f6",
  backgroundColor: "#ffffff",
  surfaceColor: "#f8fafc",
  borderRadius: "0.5rem",
  fontFamily: "Inter, sans-serif",
  animationSpeed: "1s",
};

const THEME_FIELDS: (keyof ThemeForm)[] = [
  "primaryColor",
  "backgroundColor",
  "surfaceColor",
  "borderRadius",
  "fontFamily",
  "animationSpeed",
];

function buildState(settings: any): FormState {
  return {
    heroTitle: settings?.heroTitle || "Find your perfect home",
    heroSubtitle: settings?.heroSubtitle || "Verified properties for everyone",
    heroImage: settings?.heroImage || "",
    ctaText: settings?.ctaText || "Browse Properties",
    featuredProperties: settings?.featuredProperties || [],
    theme: { ...DEFAULT_THEME, ...(settings?.theme || {}) },
    features: { enableBlog: false, ...(settings?.features || {}) },
    teamMembers: settings?.teamMembers || [],
  };
}

export const AdminCMSPage = () => {
  const loaderData = (useLoaderData({ strict: false }) as any) ?? {};
  const settings = loaderData.settings;

  const [formData, setFormData] = useState<FormState>(() => buildState(settings));
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const next = type === "checkbox" ? checked : value;

    if ((THEME_FIELDS as string[]).includes(name)) {
      // Theme controls live under formData.theme, not at the top level —
      // previously these wrote to the wrong key and the pickers did nothing.
      setFormData((prev) => ({ ...prev, theme: { ...prev.theme, [name]: next } as ThemeForm }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: next }));
  };

  const handleFeatureToggle = (feature: keyof FormState["features"], enabled: boolean) => {
    setFormData((prev) => ({ ...prev, features: { ...prev.features, [feature]: enabled } }));
  };

  const updateMember = (index: number, patch: Partial<TeamMember>) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.map((m, i) => (i === index ? { ...m, ...patch } : m)),
    }));
  };

  const addMember = () => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { name: "New Member", role: "Role", photoUrl: "" }],
    }));
  };

  const removeMember = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index),
    }));
  };

  const handlePhotoUpload = async (index: number, file: File) => {
    setUploadingIndex(index);
    try {
      const url = await uploadToCloudinary(file);
      updateMember(index, { photoUrl: url });
    } catch (error) {
      console.error("Photo upload failed:", error);
      setErrorMessage(error instanceof Error ? error.message : "Photo upload failed");
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setShowError(false);
    try {
      await withTimeout(
        updateSiteSettingsData({
          ...formData,
          updatedAt: new Date(),
        }),
      );
      setLastSaved(new Date());
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save CMS settings:", error);
      setShowError(true);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const applyThemeVars = (theme: ThemeForm) => {
    const root = document.documentElement;
    root.style.setProperty("--color-brand-500", theme.primaryColor);
    root.style.setProperty("--color-surface-900", theme.backgroundColor);
    root.style.setProperty("--color-surface-800", theme.surfaceColor);
    root.style.setProperty("--CMS-border-radius", theme.borderRadius);
    root.style.setProperty("--CMS-font-family", `"${theme.fontFamily}", sans-serif`);
  };

  const handlePreview = () => {
    setIsPreviewing((prev) => {
      if (!prev) applyThemeVars(formData.theme);
      return !prev;
    });
  };

  const handleExitPreview = () => {
    setIsPreviewing(false);
    if (settings?.theme) applyThemeVars({ ...DEFAULT_THEME, ...settings.theme });
  };

  const handleReset = () => setFormData(buildState(null));

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navItems = [
    { id: "hero-section", label: "Hero", icon: <Star className="h-4 w-4" /> },
    { id: "featured-section", label: "Featured", icon: <Layout className="h-4 w-4" /> },
    { id: "theme-section", label: "Theme", icon: <Palette className="h-4 w-4" /> },
    { id: "features-section", label: "Features", icon: <Eye className="h-4 w-4" /> },
    { id: "team-section", label: "Team", icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-zinc-200">
          <div className="flex h-16 items-center px-6 border-b border-zinc-200">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-indigo-600" />
              <h1 className="text-xl font-semibold text-gray-800">Site Builder</h1>
            </div>
          </div>

          <div className="px-4 pt-4">
            {lastSaved && (
              <p className="mb-3 text-xs text-green-600">
                Last saved: {lastSaved.toLocaleTimeString()}
              </p>
            )}
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm font-medium text-gray-600 hover:bg-zinc-50"
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="mt-4 space-y-1 border-t border-zinc-200 pt-4">
              <button
                onClick={handleReset}
                className="w-full flex items-center justify-start px-3 py-2 rounded-lg text-left text-sm font-medium text-gray-600 hover:bg-zinc-50"
              >
                <RefreshCw className="h-4 w-4 mr-2 text-gray-500" />
                Reset to Defaults
              </button>
              <button
                onClick={handlePreview}
                className={cn(
                  "w-full flex items-center justify-start px-3 py-2 rounded-lg text-left text-sm font-medium",
                  isPreviewing ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-zinc-50",
                )}
              >
                <Eye className="h-4 w-4 mr-2" />
                {isPreviewing ? "Close Preview" : "Preview Changes"}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Site Configuration</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Content, theme and team shown on the public site. Save to publish.
                </p>
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={cn(
                  "flex items-center px-4 py-2 rounded-lg font-medium transition-colors",
                  isSaving
                    ? "bg-indigo-600/50 text-white"
                    : "bg-indigo-600 text-white hover:bg-indigo-700",
                )}
              >
                {isSaving ? "Saving..." : "Save Changes"}
                <Save className="ml-2 h-4 w-4" />
              </button>
            </div>

            {showSuccess && (
              <div className="flex items-center p-4 bg-green-50 border-l-4 border-green-500">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 shrink-0" />
                <span className="text-green-800">
                  Settings saved successfully! Reload the homepage to see them live.
                </span>
              </div>
            )}

            {showError && (
              <div className="flex items-center p-4 bg-red-50 border-l-4 border-red-500">
                <AlertTriangle className="h-4 w-4 text-red-500 mr-2 shrink-0" />
                <span className="text-red-800">Error: {errorMessage}</span>
              </div>
            )}

            {/* Hero Section */}
            <section
              id="hero-section"
              className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200 scroll-mt-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Hero Section</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="heroTitle"
                  >
                    Hero Title
                  </label>
                  <input
                    id="heroTitle"
                    type="text"
                    name="heroTitle"
                    value={formData.heroTitle}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Find your perfect home"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="heroSubtitle"
                  >
                    Hero Subtitle
                  </label>
                  <input
                    id="heroSubtitle"
                    type="text"
                    name="heroSubtitle"
                    value={formData.heroSubtitle}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Verified properties for everyone"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="ctaText">
                    CTA Button Text
                  </label>
                  <input
                    id="ctaText"
                    type="text"
                    name="ctaText"
                    value={formData.ctaText}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Browse Properties"
                  />
                </div>
                <div className="col-span-2">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="heroImage"
                  >
                    Hero Image URL (optional)
                  </label>
                  <input
                    id="heroImage"
                    type="text"
                    name="heroImage"
                    value={formData.heroImage}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://example.com/hero-image.jpg"
                  />
                </div>
              </div>
            </section>

            {/* Featured Properties */}
            <section
              id="featured-section"
              className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200 scroll-mt-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Featured Properties</h3>
              <p className="text-sm text-gray-600 mb-4">
                Enter property IDs to feature (comma-separated). Leave empty for none.
              </p>
              <input
                type="text"
                name="featuredProperties"
                value={formData.featuredProperties.join(", ")}
                onChange={(e) => {
                  const ids = e.target.value
                    .split(",")
                    .map((id) => id.trim())
                    .filter((id) => id.length > 0);
                  setFormData((prev) => ({ ...prev, featuredProperties: ids }));
                }}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="prop_123, prop_456, prop_789"
              />
            </section>

            {/* Theme Customizer */}
            <section
              id="theme-section"
              className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200 scroll-mt-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Theme Customizer</h3>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-2"
                      htmlFor="primaryColor"
                    >
                      Primary Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id="primaryColor"
                        type="color"
                        name="primaryColor"
                        value={formData.theme.primaryColor}
                        onChange={handleChange}
                        className="w-12 h-10 border border-zinc-300 rounded-md p-0 bg-transparent"
                      />
                      <span className="text-sm font-mono text-gray-600">
                        {formData.theme.primaryColor}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-2"
                      htmlFor="backgroundColor"
                    >
                      Background Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id="backgroundColor"
                        type="color"
                        name="backgroundColor"
                        value={formData.theme.backgroundColor}
                        onChange={handleChange}
                        className="w-12 h-10 border border-zinc-300 rounded-md p-0 bg-transparent"
                      />
                      <span className="text-sm font-mono text-gray-600">
                        {formData.theme.backgroundColor}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-2"
                      htmlFor="surfaceColor"
                    >
                      Surface Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id="surfaceColor"
                        type="color"
                        name="surfaceColor"
                        value={formData.theme.surfaceColor}
                        onChange={handleChange}
                        className="w-12 h-10 border border-zinc-300 rounded-md p-0 bg-transparent"
                      />
                      <span className="text-sm font-mono text-gray-600">
                        {formData.theme.surfaceColor}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-2"
                      htmlFor="borderRadius"
                    >
                      Border Radius
                    </label>
                    <select
                      id="borderRadius"
                      name="borderRadius"
                      value={formData.theme.borderRadius}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="0rem">None</option>
                      <option value="0.25rem">Small</option>
                      <option value="0.5rem">Medium (default)</option>
                      <option value="0.75rem">Large</option>
                      <option value="1rem">Extra Large</option>
                      <option value="9999px">Pill</option>
                    </select>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-2"
                      htmlFor="fontFamily"
                    >
                      Font Family
                    </label>
                    <select
                      id="fontFamily"
                      name="fontFamily"
                      value={formData.theme.fontFamily}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Inter, sans-serif">Inter (default)</option>
                      <option value="'Space Grotesk', sans-serif">Space Grotesk</option>
                      <option value="'Poppins', sans-serif">Poppins</option>
                      <option value="'Roboto', sans-serif">Roboto</option>
                      <option value="'Nunito', sans-serif">Nunito</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-2"
                      htmlFor="animationSpeed"
                    >
                      Animation Speed
                    </label>
                    <select
                      id="animationSpeed"
                      name="animationSpeed"
                      value={formData.theme.animationSpeed}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="0.5s">Fast</option>
                      <option value="1s">Normal (default)</option>
                      <option value="1.5s">Slow</option>
                      <option value="2s">Very Slow</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Toggle */}
            <section
              id="features-section"
              className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200 scroll-mt-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Feature Toggles</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="enableBlog"
                    checked={formData.features.enableBlog}
                    onChange={(e) => handleFeatureToggle("enableBlog", e.target.checked)}
                    className="h-4 w-4 text-indigo-600"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Enable Blog Section
                  </span>
                </label>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Shows the blog and articles tab across the platform when enabled (requires published
                blog content).
              </p>
            </section>

            {/* Team Members */}
            <section
              id="team-section"
              className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200 scroll-mt-6"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-medium text-gray-900">Our Team</h3>
                <button
                  type="button"
                  onClick={addMember}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                >
                  <Plus className="h-4 w-4" /> Add Member
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Team members displayed on the About page.
              </p>

              <div className="space-y-4">
                {formData.teamMembers.length === 0 && (
                  <div className="text-center py-10 border border-dashed border-zinc-300 rounded-xl">
                    <Users className="h-6 w-6 mx-auto text-zinc-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      No team members yet. Add your first one.
                    </p>
                  </div>
                )}

                {formData.teamMembers.map((member, i) => (
                  <div
                    key={i}
                    className="flex gap-4 items-start p-4 bg-zinc-50 border border-zinc-200 rounded-xl group relative"
                  >
                    <div className="w-20 h-20 shrink-0 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden relative">
                      {member.photoUrl ? (
                        <img
                          src={member.photoUrl}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400">
                          {uploadingIndex === i ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <ImagePlus className="h-5 w-5" />
                          )}
                        </div>
                      )}
                      <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                        <span className="text-xs font-medium text-white">Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) void handlePhotoUpload(i, file);
                            e.target.value = "";
                          }}
                        />
                      </label>
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        value={member.name}
                        onChange={(e) => updateMember(i, { name: e.target.value })}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="Full Name"
                      />
                      <input
                        value={member.role}
                        onChange={(e) => updateMember(i, { role: e.target.value })}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="Role / Title"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMember(i)}
                      aria-label={`Remove ${member.name}`}
                      className="p-2 text-zinc-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Live Preview */}
      {isPreviewing && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Live preview"
        >
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Live Hero Preview</h3>
              <button
                onClick={handleExitPreview}
                className="px-3 py-1 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                Close Preview
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Saved theme variables are applied to the app behind this dialog. This mock shows the
              current (unsaved) hero content.
            </p>
            <div
              className="rounded-xl overflow-hidden border border-zinc-200"
              style={{
                background: formData.theme.backgroundColor,
                fontFamily: `"${formData.theme.fontFamily}", sans-serif`,
                borderRadius: formData.theme.borderRadius,
              }}
            >
              <div className="relative h-48 sm:h-60">
                {formData.heroImage ? (
                  <img
                    src={formData.heroImage}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, ${formData.theme.primaryColor}, ${formData.theme.surfaceColor})`,
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative h-full flex flex-col justify-center px-6 sm:px-10">
                  <h2 className="text-2xl sm:text-4xl font-semibold text-white max-w-xl leading-tight">
                    {formData.heroTitle}
                  </h2>
                  <p className="mt-2 text-white/80 text-sm sm:text-base max-w-lg">
                    {formData.heroSubtitle}
                  </p>
                  <span
                    className="mt-4 inline-flex items-center self-start px-5 py-2.5 text-sm font-semibold text-white"
                    style={{
                      background: formData.theme.primaryColor,
                      borderRadius: formData.theme.borderRadius,
                      transitionDuration: formData.theme.animationSpeed,
                    }}
                  >
                    {formData.ctaText}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// @ts-nocheck — ported legacy admin/map code; typed rewrite pending
import { useLoaderData } from "@tanstack/react-router";
import { Loader2, Plus, Search, Settings, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { getSiteSettingsData, updateSiteSettingsData } from "@/shared/services/firestore";
import { cn } from "@/shared/utils/cn";
import { motion } from "motion/react";

export const routeOptions = {
  loader: async () => {
    const settings = await getSiteSettingsData();
    return { settings };
  },
};

export function AdminSettingsPage() {
  const { settings } = useLoaderData({ strict: false }) as any;
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "features" | "advanced">("general");
  const [formData, setFormData] = useState({
    siteName: settings?.siteName || "UniHub",
    siteUrl: settings?.siteUrl || "",
    adminEmail: settings?.adminEmail || "",
    maintenanceMode: settings?.maintenanceMode || false,
    maintenanceMessage:
      settings?.maintenanceMessage || "We are currently performing scheduled maintenance.",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? e.target.checked : value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSiteSettingsData({
        ...formData,
        updatedAt: new Date().toISOString(),
      });
      if (formData.theme) {
        const root = document.documentElement;
        if (formData.primaryColor)
          root.style.setProperty("--color-brand-500", formData.primaryColor);
        if (formData.backgroundColor)
          root.style.setProperty("--color-surface-900", formData.backgroundColor);
        if (formData.surfaceColor)
          root.style.setProperty("--color-surface-800", formData.surfaceColor);
        if (formData.fontFamily)
          root.style.setProperty("--CMS-font-family", `"${formData.fontFamily}", sans-serif`);
        if (formData.borderRadius)
          root.style.setProperty("--CMS-border-radius", formData.borderRadius);
      }
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const renderGeneralTab = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="border-b border-zinc-800 pb-4">
        <h2 className="text-xl font-medium font-display mb-1 text-white">General Settings</h2>
        <p className="text-sm text-zinc-400">Basic site configuration</p>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Site Name</label>
          <input
            name="siteName"
            value={formData.siteName}
            onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Site URL</label>
          <input
            name="siteUrl"
            value={formData.siteUrl}
            onChange={(e) => setFormData({ ...formData, siteUrl: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500"
            placeholder="https://unihub.ke"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Admin Email</label>
          <input
            type="email"
            name="adminEmail"
            value={formData.adminEmail}
            onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500"
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="maintenanceMode"
              checked={formData.maintenanceMode}
              onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
              className="w-5 h-5 accent-brand-500 rounded"
            />
            <div>
              <span className="block font-medium text-white">Maintenance Mode</span>
              <span className="block text-sm text-zinc-500">
                Display maintenance page to visitors
              </span>
            </div>
          </label>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Maintenance Message</label>
          <textarea
            name="maintenanceMessage"
            value={formData.maintenanceMessage}
            onChange={(e) => setFormData({ ...formData, maintenanceMessage: e.target.value })}
            rows={3}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>
    </motion.div>
  );

  const renderFeaturesTab = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="border-b border-zinc-800 pb-4">
        <h2 className="text-xl font-medium font-display mb-1 text-white">Feature Toggles</h2>
        <p className="text-sm text-zinc-400">Enable or disable platform features globally.</p>
      </div>
      <div className="space-y-4">
        <label className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-950 cursor-pointer hover:border-zinc-700 transition-colors">
          <input
            type="checkbox"
            checked={false}
            onChange={(e) => console.log(e.target.checked)}
            className="w-5 h-5 accent-brand-500 rounded"
          />
          <div>
            <span className="block font-medium text-white">Enable Blog Section</span>
            <span className="block text-sm text-zinc-500">
              Shows the blog and articles tab across the platform.
            </span>
          </div>
        </label>
        <label className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-950 cursor-pointer hover:border-zinc-700 transition-colors">
          <input
            type="checkbox"
            checked={false}
            onChange={(e) => console.log(e.target.checked)}
            className="w-5 h-5 accent-brand-500 rounded"
          />
          <div>
            <span className="block font-medium text-white">Enable User Reviews</span>
            <span className="block text-sm text-zinc-500">
              Allow tenants to leave reviews for properties.
            </span>
          </div>
        </label>
        <label className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-950 cursor-pointer hover:border-zinc-700 transition-colors">
          <input
            type="checkbox"
            checked={false}
            onChange={(e) => console.log(e.target.checked)}
            className="w-5 h-5 accent-brand-500 rounded"
          />
          <div>
            <span className="block font-medium text-white">Enable Saved Searches</span>
            <span className="block text-sm text-zinc-500">
              Allow users to save search criteria and get alerts.
            </span>
          </div>
        </label>
      </div>
    </motion.div>
  );

  const renderAdvancedTab = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="border-b border-zinc-800 pb-4">
        <h2 className="text-xl font-medium font-display mb-1 text-white">Advanced Settings</h2>
        <p className="text-sm text-zinc-400">Advanced configuration options. Use with caution.</p>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">
            {"Custom CSS (injected in " + "<head>)"}
          </label>
          <textarea
            rows={6}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-brand-500"
            placeholder="/* Custom CSS here */"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">
            {"Custom JS (injected before " + "</body>)"}
          </label>
          <textarea
            rows={6}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-brand-500"
            placeholder="// Custom JavaScript here"
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={false} className="w-5 h-5 accent-brand-500 rounded" />
            <div>
              <span className="block font-medium text-white">Enable Debug Mode</span>
              <span className="block text-sm text-zinc-500">
                Show debug panel and verbose logging
              </span>
            </div>
          </label>
        </div>
        <div className="border-t border-zinc-800 pt-6">
          <button
            type="button"
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-medium transition-colors"
          >
            Clear All Cache & Rebuild
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-medium text-white flex items-center gap-3">
            <Settings className="w-8 h-8 text-blue-400" />
            Settings
          </h1>
          <p className="text-zinc-400 mt-2">Configure site-wide settings</p>
        </div>
        <button
          type="submit"
          form="settings-form"
          disabled={isSaving}
          className="px-6 py-3 flex items-center gap-2 rounded-xl bg-brand-500 text-black text-sm font-medium hover:bg-white hover:scale-105 transition-all font-display shadow-[0_0_20px_var(--color-brand-500)]"
        >
          <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <form id="settings-form" onSubmit={handleSave} className="space-y-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 shrink-0 flex flex-col gap-2">
            {[
              { id: "general", icon: "🏠", label: "General" },
              { id: "features", icon: "🔧", label: "Features" },
              { id: "advanced", icon: "⚙️", label: "Advanced" },
            ].map((tab) => (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-sm w-full text-left ${
                  activeTab === tab.id
                    ? "bg-zinc-800 text-white shadow-inner border border-zinc-700"
                    : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200 border border-transparent"
                }`}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 lg:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent"></div>

            <div>
              {activeTab === "general" && renderGeneralTab()}
              {activeTab === "features" && renderFeaturesTab()}
              {activeTab === "advanced" && renderAdvancedTab()}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

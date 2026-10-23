import { useLoaderData, useRouter } from "@tanstack/react-router";
import { Loader2, Search, Users } from "lucide-react";
import { getAgents, deleteAgent, createAgent, updateAgent } from "@/shared/services/firestore";
import { formatKenyanPhone, normalizeKenyanPhone } from "@/shared/contact";
import { useState, type FormEvent } from "react";
import type { Agent } from "@/shared/types/admin";

export const routeOptions = {
  loader: async () => {
    const agents = await getAgents();
    return { agents };
  },
};

type AgentDraft = { name: string; phone: string; whatsappNumber: string; isActive: boolean };
const EMPTY_DRAFT: AgentDraft = { name: "", phone: "", whatsappNumber: "", isActive: true };

const fieldCls =
  "w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500";

export function AdminAgentsPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<AgentDraft>(EMPTY_DRAFT);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { agents } = useLoaderData({ strict: false }) as { agents: Agent[] };
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (agent.phone ?? "").includes(searchTerm) ||
      (agent.whatsappNumber ?? "").includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" ||
      (agent.isActive && statusFilter === "active") ||
      (!agent.isActive && statusFilter === "inactive");
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this agent?")) return;
    setDeletingId(id);
    try {
      await deleteAgent(id);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete agent");
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (agent: Agent) => {
    setEditingId(agent.id ?? null);
    setDraft({
      name: agent.name,
      phone: agent.phone,
      whatsappNumber: agent.whatsappNumber,
      isActive: agent.isActive,
    });
    setFormError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
    setFormError(null);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const name = draft.name.trim();
    const phone = normalizeKenyanPhone(draft.phone);
    // The WhatsApp number defaults to the phone number when left empty.
    const whatsapp = draft.whatsappNumber.trim() ? normalizeKenyanPhone(draft.whatsappNumber) : phone;
    if (name.length < 2) return setFormError("Enter the agent's name.");
    if (!phone) return setFormError("Enter a valid Kenyan phone number, e.g. 0746 063 175.");
    if (!whatsapp) return setFormError("The WhatsApp number is not a valid Kenyan number.");
    setSaving(true);
    try {
      const data = { name, phone, whatsappNumber: whatsapp, isActive: draft.isActive };
      if (editingId) await updateAgent(editingId, data);
      else await createAgent(data);
      resetForm();
      await router.invalidate();
    } catch (error) {
      console.error("Save agent failed:", error);
      setFormError("Could not save the agent. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-medium text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-orange-400" />
            Agents
          </h1>
          <p className="text-zinc-400 mt-2">Manage property agents</p>
        </div>
      </div>

      <form
        onSubmit={handleSave}
        className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-xl"
        aria-labelledby="agent-form-title"
      >
        <h2 id="agent-form-title" className="text-lg font-medium text-white">
          {editingId ? "Edit agent" : "Add an agent"}
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          Students contact the agent on these numbers. Type them the way you would dial, for example
          0746 063 175.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <label className="block text-sm text-zinc-300">
            <span className="mb-1 block">Name</span>
            <input
              className={fieldCls}
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              autoComplete="off"
              required
            />
          </label>
          <label className="block text-sm text-zinc-300">
            <span className="mb-1 block">Phone number</span>
            <input
              className={fieldCls}
              type="tel"
              inputMode="tel"
              placeholder="0746 063 175"
              value={draft.phone}
              onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
              autoComplete="off"
              required
            />
          </label>
          <label className="block text-sm text-zinc-300">
            <span className="mb-1 block">WhatsApp number (if different)</span>
            <input
              className={fieldCls}
              type="tel"
              inputMode="tel"
              placeholder="Same as phone"
              value={draft.whatsappNumber}
              onChange={(e) => setDraft({ ...draft, whatsappNumber: e.target.value })}
              autoComplete="off"
            />
          </label>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={draft.isActive}
            onChange={(e) => setDraft({ ...draft, isActive: e.target.checked })}
          />
          Active (shown to students)
        </label>
        {formError ? (
          <p role="alert" className="mt-4 text-sm text-red-400">
            {formError}
          </p>
        ) : null}
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-orange-500 px-5 text-sm font-semibold text-black disabled:opacity-60"
          >
            {saving ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
            {editingId ? "Save changes" : "Add agent"}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              disabled={saving}
              className="min-h-11 rounded-xl border border-zinc-700 px-5 text-sm text-zinc-300"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
            className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-zinc-400 text-sm font-medium border-b border-zinc-800 pb-4">
                <th className="pb-4 text-left">Agent</th>
                <th className="pb-4 text-left">Contact</th>
                <th className="pb-4 text-left">WhatsApp</th>
                <th className="pb-4 text-left">Status</th>
                <th className="pb-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {agents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-zinc-500">
                    No agents are on file yet.
                  </td>
                </tr>
              ) : (
                agents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
                          {agent.profilePhotoURL ? (
                            <img
                              src={agent.profilePhotoURL}
                              alt={agent.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl">👤</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">{agent.name}</p>
                          <p className="text-sm text-zinc-400">{formatKenyanPhone(agent.phone)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-zinc-300">{formatKenyanPhone(agent.phone)}</td>
                    <td className="py-4 text-zinc-300">{formatKenyanPhone(agent.whatsappNumber)}</td>
                    <td className="py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          agent.isActive
                            ? "bg-green-500/20 text-green-400"
                            : "bg-zinc-700 text-zinc-400"
                        }`}
                      >
                        {agent.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(agent)}
                          className="px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => agent.id && handleDelete(agent.id)}
                          disabled={deletingId === agent.id}
                          className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

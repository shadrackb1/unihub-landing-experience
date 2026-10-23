/**
 * Administrator content client.
 *
 * The console used to read Firestore documents directly from the browser.
 * It now talks to `/api/admin/content` and `/api/admin/settings`, which read
 * the same SQLite database as the public site. That is what makes the admin
 * screens work with no network at all — the only server involved is the one
 * running on the same machine.
 *
 * Reads return an empty collection instead of throwing when the server cannot
 * answer, because a loader that throws takes the whole page to the error
 * boundary.
 */
import type {
  Agent,
  Category,
  Hostel,
  Property,
  SiteSettings,
  University,
} from "@/shared/types/admin";

type Json = Record<string, unknown>;

async function request<T>(
  path: string,
  init: { method?: string; body?: unknown } = {},
): Promise<T> {
  const response = await fetch(path, {
    method: init.method ?? "GET",
    credentials: "include",
    ...(init.body === undefined
      ? {}
      : {
          headers: { "content-type": "application/json" },
          body: JSON.stringify(init.body),
        }),
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const payload = (await response.json()) as { error?: unknown };
      if (typeof payload.error === "string") message = payload.error;
    } catch {
      // Non-JSON body; keep the status message.
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}

async function list<T>(resource: string, query = ""): Promise<T[]> {
  try {
    const payload = await request<{ items?: T[] }>(`/api/admin/content/${resource}${query}`);
    return Array.isArray(payload.items) ? payload.items : [];
  } catch (error) {
    console.error(`Could not load ${resource}:`, error);
    return [];
  }
}

/* ------------------------------------------------------------------ agents */

export async function getAgents(): Promise<Agent[]> {
  return list<Agent>("agents");
}

export async function createAgent(data: Omit<Agent, "id">): Promise<string> {
  const { item } = await request<{ item: Agent }>("/api/admin/content/agents", {
    method: "POST",
    body: data,
  });
  return item.id ?? "";
}

export async function updateAgent(id: string, data: Partial<Agent>): Promise<void> {
  await request(`/api/admin/content/agents/${id}`, { method: "PATCH", body: data });
}

export async function deleteAgent(id: string): Promise<void> {
  await request(`/api/admin/content/agents/${id}`, { method: "DELETE" });
}

/* -------------------------------------------------------------- categories */

export async function getCategories(): Promise<Category[]> {
  return list<Category>("categories");
}

export async function createCategory(data: Omit<Category, "id">): Promise<string> {
  const { item } = await request<{ item: Category }>("/api/admin/content/categories", {
    method: "POST",
    body: data,
  });
  return item.id ?? "";
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<void> {
  await request(`/api/admin/content/categories/${id}`, { method: "PATCH", body: data });
}

export async function deleteCategory(id: string): Promise<void> {
  await request(`/api/admin/content/categories/${id}`, { method: "DELETE" });
}

/* -------------------------------------------------------------- properties */

export async function getProperties(status?: string): Promise<Property[]> {
  const items = await list<Property>("properties");
  return status ? items.filter((item) => item.status === status) : items;
}

export async function getProperty(id: string): Promise<Property | null> {
  try {
    const { item } = await request<{ item: Property }>(`/api/admin/content/properties/${id}`);
    return item;
  } catch {
    return null;
  }
}

export async function createProperty(
  data: Omit<Property, "id" | "createdAt" | "updatedAt">,
): Promise<string> {
  const { item } = await request<{ item: Property }>("/api/admin/content/properties", {
    method: "POST",
    body: data,
  });
  return item.id ?? "";
}

export async function updateProperty(id: string, data: Partial<Property>): Promise<void> {
  await request(`/api/admin/content/properties/${id}`, { method: "PATCH", body: data });
}

export async function deleteProperty(id: string): Promise<void> {
  await request(`/api/admin/content/properties/${id}`, { method: "DELETE" });
}

/* ------------------------------------------------------------ universities */

export async function getUniversities(): Promise<University[]> {
  return list<University>("universities");
}

export async function getUniversity(id: string): Promise<University | null> {
  const all = await getUniversities();
  return all.find((item) => item.id === id) ?? null;
}

export async function createUniversity(
  data: Omit<University, "id" | "createdAt" | "updatedAt">,
): Promise<string> {
  const { item } = await request<{ item: University }>("/api/admin/content/universities", {
    method: "POST",
    body: data,
  });
  return item.id ?? "";
}

export async function updateUniversity(id: string, data: Partial<University>): Promise<void> {
  await request(`/api/admin/content/universities/${id}`, { method: "PATCH", body: data });
}

export async function deleteUniversity(id: string): Promise<void> {
  await request(`/api/admin/content/universities/${id}`, { method: "DELETE" });
}

/* ----------------------------------------------------------------- hostels */

export async function getHostels(universityId?: string): Promise<Hostel[]> {
  return list<Hostel>(
    "hostels",
    universityId ? `?universityId=${encodeURIComponent(universityId)}` : "",
  );
}

export async function getHostel(id: string): Promise<Hostel | null> {
  const all = await getHostels();
  return all.find((item) => item.id === id) ?? null;
}

export async function createHostel(
  data: Omit<Hostel, "id" | "createdAt" | "updatedAt">,
): Promise<string> {
  const { item } = await request<{ item: Hostel }>("/api/admin/content/hostels", {
    method: "POST",
    body: data,
  });
  return item.id ?? "";
}

export async function updateHostel(id: string, data: Partial<Hostel>): Promise<void> {
  await request(`/api/admin/content/hostels/${id}`, { method: "PATCH", body: data });
}

export async function deleteHostel(id: string): Promise<void> {
  await request(`/api/admin/content/hostels/${id}`, { method: "DELETE" });
}

/* ---------------------------------------------------------------- settings */

export async function getSiteSettingsData(): Promise<SiteSettings | null> {
  try {
    const { settings } = await request<{ settings: SiteSettings }>("/api/admin/settings");
    return settings;
  } catch (error) {
    console.error("Could not load site settings:", error);
    return null;
  }
}

export async function updateSiteSettingsData(data: Partial<SiteSettings>): Promise<void> {
  await request("/api/admin/settings", { method: "PUT", body: data });
}

/** Kept for callers that only need the collection and not the wrapper. */
export const getAgentsList = getAgents;

export type AdminContentBody = Json;

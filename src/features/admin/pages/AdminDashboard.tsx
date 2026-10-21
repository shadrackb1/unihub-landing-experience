// @ts-nocheck — ported legacy admin/map code; typed rewrite pending
import { useLoaderData } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Home,
  Building,
  Users,
  Tag,
  Monitor,
  TrendingUp,
  Eye,
  Loader2,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  getProperties,
  getHostels,
  getUniversities,
  getAgents,
  getCategories,
} from "@/shared/services/firestore";
import { useEffect, useState } from "react";

export const routeOptions = {
  loader: async () => {
    const [properties, hostels, universities, agents, categories] = await Promise.all([
      getProperties(),
      getHostels(),
      getUniversities(),
      getAgents(),
      getCategories(),
    ]);

    return {
      stats: {
        properties: properties.length,
        hostels: hostels.length,
        universities: universities.length,
        agents: agents.length,
        categories: categories.length,
      },
      recentProperties: properties.slice(0, 5),
      recentHostels: hostels.slice(0, 5),
    };
  },
};

export function AdminDashboard() {
  const { stats, recentProperties, recentHostels } = useLoaderData({ strict: false }) as any;

  const statCards = [
    {
      label: "Properties",
      value: stats.properties,
      icon: Home,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      href: "/admin/properties",
    },
    {
      label: "Hostels",
      value: stats.hostels,
      icon: Building,
      color: "text-green-400",
      bg: "bg-green-500/10",
      href: "/admin/hostels",
    },
    {
      label: "Universities",
      value: stats.universities,
      icon: Building,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      href: "/admin/universities",
    },
    {
      label: "Agents",
      value: stats.agents,
      icon: Users,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      href: "/admin/agents",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-medium text-white flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-brand-400" />
            Dashboard
          </h1>
          <p className="text-zinc-400 mt-2">Welcome to the UniHub Admin Dashboard</p>
        </div>
        <div className="flex gap-4">
          <a
            href="/admin/cms"
            className="px-4 py-2 flex items-center gap-2 rounded-xl border border-zinc-800 text-sm font-medium hover:bg-zinc-800 transition-all font-display"
          >
            <Eye className="w-4 h-4" /> Live Preview
          </a>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.label} to={stat.href} className="block">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-xl hover:border-brand-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="text-3xl font-display font-bold text-white">{stat.value}</span>
              </div>
              <p className="text-zinc-400 text-sm font-medium">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-medium text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-brand-400" />
              Recent Properties
            </h2>
            <a
              href="/admin/properties"
              className="text-sm text-brand-400 hover:text-brand-300 font-medium"
            >
              View All
            </a>
          </div>
          <div className="space-y-4">
            {recentProperties.length === 0 ? (
              <p className="text-zinc-500 text-center py-8">No properties yet</p>
            ) : (
              recentProperties.map((prop) => (
                <div
                  key={prop.id}
                  className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center">
                      <Home className="w-6 h-6 text-brand-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{prop.title}</p>
                      <p className="text-sm text-zinc-400">{prop.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        prop.status === "available"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-zinc-700 text-zinc-400"
                      }`}
                    >
                      {prop.status}
                    </span>
                    <p className="text-sm text-zinc-500 mt-1">KES {prop.price.toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-medium text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-green-400" />
              Recent Hostels
            </h2>
            <a
              href="/admin/hostels"
              className="text-sm text-brand-400 hover:text-brand-300 font-medium"
            >
              View All
            </a>
          </div>
          <div className="space-y-4">
            {recentHostels.length === 0 ? (
              <p className="text-zinc-500 text-center py-8">No hostels yet</p>
            ) : (
              recentHostels.map((hostel) => (
                <div
                  key={hostel.id}
                  className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center">
                      <Building className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{hostel.name}</p>
                      <p className="text-sm text-zinc-400">{hostel.location}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      hostel.status === "active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-zinc-700 text-zinc-400"
                    }`}
                  >
                    {hostel.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

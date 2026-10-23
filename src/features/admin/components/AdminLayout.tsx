import { useState } from "react";
import { Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Home,
  Users,
  Tag,
  Settings,
  LogOut,
  Menu,
  X,
  Monitor,
  School,
  Building,
  UserCheck,
  ClipboardCheck,
  Megaphone,
} from "lucide-react";
import { useAuth } from "@/shared/context/AuthContext";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/ads", icon: Megaphone, label: "Ads & boosts" },
  { to: "/admin/cms", icon: Monitor, label: "Site builder" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
] as const;

export const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname }).replace(/\/$/, "") || "/";
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      /* already signed out */
    }
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground md:flex-row">
      <div className="flex items-center justify-between border-b border-border p-4 md:hidden">
        <div className="font-display text-xl font-medium tracking-tight">UniHub Admin</div>
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
          className="text-muted-foreground"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex-col border-r border-border bg-card md:relative ${open ? "flex" : "hidden md:flex"}`}
      >
        <div className="hidden border-b border-border p-6 md:block">
          <Link to="/" className="font-display text-2xl font-medium tracking-tight">
            UniHub Admin
          </Link>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const active = "end" in item ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"}`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-destructive"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </aside>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-background/70 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

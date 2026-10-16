import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { AuthProvider } from "@/shared/context/AuthContext";
import { AdminLayout } from "@/features/admin/components/AdminLayout";
import { ProtectedRoute } from "@/features/admin/components/ProtectedRoute";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "UniHub Admin" }, { name: "robots", content: "noindex" }] }),
  ssr: false,
  component: AdminRoot,
});

function AdminRoot() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLogin = pathname.startsWith("/admin/login");
  return (
    <AuthProvider>
      {isLogin ? <Outlet /> : <ProtectedRoute />}
    </AuthProvider>
  );
}

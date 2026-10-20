import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Mail, Lock, Loader2, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "@/shared/context/AuthContext";
import { isAdminEmail } from "@/features/admin/requireAdmin";
import { SupportLink } from "@/shared/components/SupportLink";

const inputBase =
  "w-full rounded-xl border border-input bg-background py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";

export function AdminLoginPage() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
      // Signing in is not the same as being an admin. Check the allowlist
      // before routing so a non-admin never lands on the "Admins only" wall
      // with an active session they did not want.
      if (!isAdminEmail(email)) {
        await logout().catch(() => {});
        setError(
          "This account does not have admin access. Use the landlord portal, or ask support for access.",
        );
        return;
      }
      navigate({ to: "/admin" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      setError(
        /invalid|credential|password|email/i.test(message) || !message
          ? "That email and password did not match. Try again."
          : message,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <div className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <p className="eyebrow">UniHub · Admin</p>
            <h1 className="mt-2 font-display text-3xl font-medium leading-tight">
              Sign in to the console
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Review landlords and listings, publish site content, and manage boosts.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            {error ? (
              <div
                id="admin-sign-in-error"
                role="alert"
                className="mb-5 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
              >
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="admin-email"
                  className="mb-1.5 block text-sm font-medium text-secondary-foreground"
                >
                  Admin email
                </label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <input
                    id="admin-email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    aria-describedby={error ? "admin-sign-in-error" : undefined}
                    className={inputBase}
                    placeholder="name@unihub.ke"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="mb-1.5 block text-sm font-medium text-secondary-foreground"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    aria-describedby={error ? "admin-sign-in-error" : undefined}
                    className={`${inputBase} pr-12`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-2 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 space-y-2 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
              <p className="flex items-start gap-2">
                <ShieldCheck
                  className="mt-0.5 size-3.5 shrink-0 text-highlight"
                  aria-hidden="true"
                />
                <span>
                  Admin access is invite-only. Only allowlisted emails can open the console.
                </span>
              </p>
              <p>
                Need access or a password reset?{" "}
                <SupportLink
                  message="Hi UniHub, I need admin access to the console"
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  Contact support
                </SupportLink>
              </p>
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            <Link to="/" className="underline underline-offset-4 hover:text-foreground">
              Back to UniHub
            </Link>
            <span aria-hidden="true"> · </span>
            <Link
              to="/landlord/login"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Landlord sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

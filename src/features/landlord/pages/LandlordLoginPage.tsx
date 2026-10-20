import { useEffect, useState } from "react";
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { signInLandlord, homeForStatus } from "@/features/landlord/services/landlordService";
import { useLandlord } from "@/shared/context/LandlordContext";
import { SupportLink } from "@/shared/components/SupportLink";

const inputBase =
  "w-full rounded-xl border border-input bg-background py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";

export const LandlordLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { user, profile, profileState } = useLandlord();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // A landlord with a live session should never be asked to sign in again.
  useEffect(() => {
    if (user && profileState === "ok" && profile) {
      void navigate({ to: homeForStatus(profile.status), replace: true });
    }
  }, [user, profile, profileState, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const { profile: signedInProfile } = await signInLandlord(email, password);

      if (signedInProfile.state === "missing") {
        throw new Error(
          "No landlord profile is linked to this account. Register as a landlord first — it takes about three minutes.",
        );
      }
      if (signedInProfile.state === "unavailable") {
        throw new Error(signedInProfile.message);
      }

      void navigate({ to: homeForStatus(signedInProfile.profile.status), replace: true });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "That email and password did not match. Try again.",
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
            <p className="eyebrow">UniHub · Landlord portal</p>
            <h1 className="mt-2 font-display text-3xl font-medium leading-tight">Sign in</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Manage your listings, applications, and boosts. Approved landlords see their dashboard
              straight away; everyone else lands on their review status.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            {errorMessage ? (
              <div
                id="sign-in-error"
                role="alert"
                className="mb-5 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
              >
                {errorMessage}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-secondary-foreground"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    aria-describedby={errorMessage ? "sign-in-error" : undefined}
                    className={inputBase}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
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
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    aria-describedby={errorMessage ? "sign-in-error" : undefined}
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

              <div className="flex items-center justify-between gap-3 pt-1 text-sm">
                <Link
                  to="/landlord/register"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Create an account
                </Link>
                <SupportLink
                  message="Hi UniHub, I can't sign in to my landlord account"
                  className="font-medium text-muted-foreground hover:text-foreground"
                >
                  Forgot password?
                </SupportLink>
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

            <p className="mt-5 flex items-start gap-2 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-highlight" aria-hidden="true" />
              <span>
                Locked out? Message support and we will reset access once we have confirmed the
                account is yours.
              </span>
            </p>
          </div>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            <Link to="/" className="underline underline-offset-4 hover:text-foreground">
              Back to UniHub
            </Link>
            <span aria-hidden="true"> · </span>
            <Link
              to="/list-property"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Why list with us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

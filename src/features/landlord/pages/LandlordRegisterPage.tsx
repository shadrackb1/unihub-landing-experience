import { useEffect, useState } from "react";
import {
  Loader2,
  CheckCircle,
  XCircle,
  ShieldCheck,
  Phone,
  MapPin,
  Users,
  Mail,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  registerLandlord,
  homeForStatus,
  type RegisteredLandlord,
} from "@/features/landlord/services/landlordService";
import { useLandlord } from "@/shared/context/LandlordContext";
import { useAuth } from "@/shared/context/AuthContext";
import { ConsentDeclaration } from "@/shared/components/ConsentForm";
import { REQUIRED_DECLARATION_ITEM_IDS } from "@/shared/consentPurposes";
import { cn } from "@/shared/lib/utils";

const STEP_LABELS = ["Account", "Profile", "Verification"] as const;

const CAMPUS_OPTIONS = [
  "Nairobi",
  "Juja",
  "Kahawa",
  "Madaraka",
  "Thika",
  "Kesses",
  "Njoro",
  "Nakuru",
  "Meru",
  "Eldoret",
];

const MIN_PASSWORD_LENGTH = 8;

const inputBase =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60";

const labelClass = "mb-1.5 block text-sm font-medium text-secondary-foreground";
const hintClass = "text-xs leading-relaxed text-muted-foreground";

interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  businessName: string;
  phone: string;
  whatsappNumber: string;
  nationalId: string;
  estimatedProperties: string;
  reviewNote: string;
}

const EMPTY_FORM: FormState = {
  email: "",
  password: "",
  confirmPassword: "",
  fullName: "",
  businessName: "",
  phone: "",
  whatsappNumber: "",
  nationalId: "",
  estimatedProperties: "",
  reviewNote: "",
};

/** Kenyan mobile numbers, accepted as 07…, 01…, or with a +254 prefix. */
function isPhone(value: string): boolean {
  const digits = value.replace(/[\s-]/g, "");
  return /^(?:\+?254|0)?[17]\d{8}$/.test(digits);
}

export const LandlordRegisterPage = () => {
  const navigate = useNavigate();
  const { user, profile, profileState, authLoading } = useLandlord();
  const { refreshSession } = useAuth();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [campuses, setCampuses] = useState<string[]>([]);
  const [consentTicks, setConsentTicks] = useState<Record<string, boolean>>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [consentRecorded, setConsentRecorded] = useState(true);
  const [registered, setRegistered] = useState<RegisteredLandlord | null>(null);

  // A landlord who is already signed in and has a profile skips registration.
  useEffect(() => {
    if (!authLoading && user && profileState === "ok" && profile) {
      void navigate({ to: homeForStatus(profile.status), replace: true });
    }
  }, [authLoading, user, profile, profileState, navigate]);

  const setField = (name: keyof FormState, value: string) => {
    setForm((previous) => ({ ...previous, [name]: value }));
    setErrorMessage("");
  };

  const toggleCampus = (campus: string) => {
    setCampuses((previous) =>
      previous.includes(campus) ? previous.filter((c) => c !== campus) : [...previous, campus],
    );
    setErrorMessage("");
  };

  const toggleConsent = (id: string) => {
    setConsentTicks((previous) => ({ ...previous, [id]: !previous[id] }));
    setErrorMessage("");
  };

  /** Validate only the fields on the step being left. */
  const validateStep = (current: number): string => {
    if (current === 1) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        return "Enter a valid email address.";
      }
      if (form.password.length < MIN_PASSWORD_LENGTH) {
        return `Use a password of at least ${MIN_PASSWORD_LENGTH} characters.`;
      }
      if (form.password !== form.confirmPassword) {
        return "The two passwords do not match.";
      }
    }
    if (current === 2) {
      if (form.fullName.trim().length < 3) {
        return "Enter your full name as it appears on your ID.";
      }
      if (!isPhone(form.phone)) {
        return "Enter a valid Kenyan phone number, for example 0712 345 678.";
      }
      if (!isPhone(form.whatsappNumber)) {
        return "Enter a valid WhatsApp number, for example 0712 345 678.";
      }
    }
    return "";
  };

  const goNext = () => {
    const problem = validateStep(step);
    if (problem) {
      setErrorMessage(problem);
      return;
    }
    setErrorMessage("");
    setStep((current) => Math.min(current + 1, STEP_LABELS.length));
  };

  const goBack = () => {
    setErrorMessage("");
    setStep((current) => Math.max(current - 1, 1));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step < STEP_LABELS.length) {
      goNext();
      return;
    }

    // Last step: everything that was not re-checked on the way here.
    const earlier = validateStep(1) || validateStep(2);
    if (earlier) {
      setErrorMessage(earlier);
      return;
    }
    if (campuses.length === 0) {
      setErrorMessage("Choose at least one area you let property in.");
      return;
    }
    const estimated = Number(form.estimatedProperties);
    if (!form.estimatedProperties.trim() || !Number.isFinite(estimated) || estimated < 0) {
      setErrorMessage("Enter how many properties you manage, for example 3.");
      return;
    }
    const ticked = Object.entries(consentTicks)
      .filter(([, value]) => value)
      .map(([id]) => id);
    const missing = REQUIRED_DECLARATION_ITEM_IDS.filter((id) => !ticked.includes(id));
    if (missing.length > 0) {
      setErrorMessage(
        "Tick every required consent statement. Nothing is ticked for you, and each statement is separate.",
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    try {
      const created = await registerLandlord({
        email: form.email.trim(),
        password: form.password,
        fullName: form.fullName.trim(),
        businessName: form.businessName.trim(),
        phone: form.phone.trim(),
        whatsappNumber: form.whatsappNumber.trim(),
        nationalId: form.nationalId.trim(),
        targetCampuses: campuses,
        estimatedProperties: Math.trunc(estimated),
        reviewNote: form.reviewNote.trim(),
        consentItems: ticked,
      });
      // Publish the new session to the AuthProvider before navigating, so the
      // portal gate reads the account that was just created instead of the
      // signed-out frame it still holds.
      await refreshSession();

      setConsentRecorded(created.consentRecorded);
      setRegistered(created);
      if (created.consentRecorded) {
        void navigate({ to: "/landlord/pending", replace: true });
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : "We could not create your account. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // The account exists but its consent could not be recorded: the honest
  // outcome is to send the person to the consent page, not to pretend the
  // application is complete.
  if (registered && !consentRecorded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-5 py-12">
        <div className="w-full max-w-md rounded-2xl border border-destructive/30 bg-card p-6 sm:p-8">
          <XCircle className="size-8 text-destructive" aria-hidden="true" />
          <h1 className="mt-4 font-display text-2xl font-medium">Finish your consent</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Your account and landlord profile were created, but we could not record your consent.
            Nothing is published until it is recorded.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/consent"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              Open the consent page
            </Link>
            <Link
              to="/landlord/pending"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-semibold hover:bg-accent"
            >
              Go to my application status
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <div className="h-1 w-full bg-gradient-to-r from-highlight via-primary to-highlight opacity-40" />

      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-xl">
          <div className="mb-6">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="size-3.5 text-highlight" aria-hidden="true" />
              Verified landlords only
            </div>
            <h1 className="font-display text-2xl font-medium leading-tight tracking-tight sm:text-3xl">
              Become a verified landlord
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              List student housing on UniHub. We check every account before a listing goes live, so
              students know who they are talking to.
            </p>
          </div>

          {/* Progress */}
          <ol className="mb-6 flex items-center gap-2" aria-label="Registration progress">
            {STEP_LABELS.map((label, index) => {
              const number = index + 1;
              const isActive = number === step;
              const isDone = number < step;
              return (
                <li key={label} className="flex flex-1 items-center gap-2">
                  <span
                    aria-current={isActive ? "step" : undefined}
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                      isDone
                        ? "bg-status/20 text-status"
                        : isActive
                          ? "bg-primary text-primary-foreground shadow-glow"
                          : "border border-border bg-card text-muted-foreground",
                    )}
                  >
                    {isDone ? <CheckCircle className="size-4" aria-hidden="true" /> : number}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-medium sm:text-sm",
                      isActive ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {label}
                  </span>
                  {index < STEP_LABELS.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className={cn("h-px flex-1", isDone ? "bg-status/40" : "bg-border")}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>

          {errorMessage ? (
            <div
              id="registration-error"
              role="alert"
              className="mb-5 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
            >
              <XCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{errorMessage}</span>
            </div>
          ) : null}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-2xl border border-border bg-card p-5 sm:p-7"
          >
            {step === 1 ? (
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-muted-foreground" aria-hidden="true" />
                  <h2 className="font-display text-lg font-medium">Account details</h2>
                </div>

                <div>
                  <label className={labelClass} htmlFor="email">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={(event) => setField("email", event.target.value)}
                    className={inputBase}
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={Boolean(errorMessage && !form.email.includes("@"))}
                    aria-describedby={errorMessage ? "registration-error" : undefined}
                    disabled={isLoading}
                    required
                  />
                  <p className={`mt-1.5 ${hintClass}`}>
                    We use this for your status updates and sign-in.
                  </p>
                </div>

                <div>
                  <label className={labelClass} htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={(event) => setField("password", event.target.value)}
                    className={inputBase}
                    placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
                    autoComplete="new-password"
                    minLength={MIN_PASSWORD_LENGTH}
                    aria-describedby={errorMessage ? "registration-error" : undefined}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="confirmPassword">
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={(event) => setField("confirmPassword", event.target.value)}
                    className={inputBase}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    minLength={MIN_PASSWORD_LENGTH}
                    aria-describedby={errorMessage ? "registration-error" : undefined}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-muted-foreground" aria-hidden="true" />
                  <h2 className="font-display text-lg font-medium">Who you are</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={labelClass} htmlFor="fullName">
                      Full name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={(event) => setField("fullName", event.target.value)}
                      className={inputBase}
                      placeholder="Jane Otieno"
                      autoComplete="name"
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="businessName">
                      Business or agency name
                    </label>
                    <input
                      id="businessName"
                      type="text"
                      name="businessName"
                      value={form.businessName}
                      onChange={(event) => setField("businessName", event.target.value)}
                      className={inputBase}
                      placeholder="Joy Homes Real Estate"
                      autoComplete="organization"
                      disabled={isLoading}
                    />
                    <p className={`mt-1.5 ${hintClass}`}>
                      Optional — leave blank if you list as an individual.
                    </p>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="phone">
                      Phone number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      inputMode="tel"
                      value={form.phone}
                      onChange={(event) => setField("phone", event.target.value)}
                      className={inputBase}
                      placeholder="0712 345 678"
                      autoComplete="tel"
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="whatsappNumber">
                      WhatsApp number
                    </label>
                    <input
                      id="whatsappNumber"
                      type="tel"
                      name="whatsappNumber"
                      inputMode="tel"
                      value={form.whatsappNumber}
                      onChange={(event) => setField("whatsappNumber", event.target.value)}
                      className={inputBase}
                      placeholder="0712 345 678"
                      autoComplete="tel"
                      disabled={isLoading}
                      required
                    />
                    <p className={`mt-1.5 ${hintClass}`}>Students will reach you here.</p>
                  </div>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-muted-foreground" aria-hidden="true" />
                  <h2 className="font-display text-lg font-medium">Verification details</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={labelClass} htmlFor="nationalId">
                      National ID or passport number
                    </label>
                    <input
                      id="nationalId"
                      type="text"
                      name="nationalId"
                      value={form.nationalId}
                      onChange={(event) => setField("nationalId", event.target.value)}
                      className={inputBase}
                      placeholder="12345678"
                      autoComplete="off"
                      disabled={isLoading}
                    />
                    <p className={`mt-1.5 ${hintClass}`}>
                      Used for verification only, never shown publicly. You can add it later if you
                      prefer.
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <fieldset>
                      <legend className={labelClass}>Areas you let property in</legend>
                      <div className="flex flex-wrap gap-2">
                        {CAMPUS_OPTIONS.map((campus) => {
                          const selected = campuses.includes(campus);
                          return (
                            <button
                              key={campus}
                              type="button"
                              onClick={() => toggleCampus(campus)}
                              aria-pressed={selected}
                              disabled={isLoading}
                              className={cn(
                                "inline-flex min-h-9 items-center rounded-full border px-3 text-xs font-medium transition-colors disabled:opacity-60",
                                selected
                                  ? "border-foreground bg-foreground text-background"
                                  : "border-border bg-card text-secondary-foreground hover:border-foreground/50",
                              )}
                            >
                              {campus}
                            </button>
                          );
                        })}
                      </div>
                      <p className={`mt-2 ${hintClass}`}>
                        {campuses.length === 0
                          ? "Tap every area you list in."
                          : `${campuses.length} area${campuses.length === 1 ? "" : "s"} selected.`}
                      </p>
                    </fieldset>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="estimatedProperties">
                      Properties you manage
                    </label>
                    <input
                      id="estimatedProperties"
                      type="number"
                      name="estimatedProperties"
                      inputMode="numeric"
                      min={0}
                      value={form.estimatedProperties}
                      onChange={(event) => setField("estimatedProperties", event.target.value)}
                      className={inputBase}
                      placeholder="5"
                      autoComplete="off"
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelClass} htmlFor="reviewNote">
                      Anything else for our review team?
                    </label>
                    <textarea
                      id="reviewNote"
                      name="reviewNote"
                      value={form.reviewNote}
                      onChange={(event) => setField("reviewNote", event.target.value)}
                      className={inputBase}
                      rows={3}
                      placeholder="Specialisations, certifications, or notes for the review team…"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-base font-medium">Consent declaration</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Each statement is separate and nothing is ticked for you. You can withdraw
                    consent at any time. The full wording is at{" "}
                    <Link to="/consent" className="text-highlight hover:underline">
                      /consent
                    </Link>
                    .
                  </p>
                  <div className="mt-3">
                    <ConsentDeclaration
                      ticked={consentTicks}
                      onToggle={toggleConsent}
                      disabled={isLoading}
                      showBasis={false}
                    />
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-5">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={goBack}
                  disabled={isLoading}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60"
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Back
                </button>
              ) : (
                <Link
                  to="/landlord/login"
                  className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Already registered?
                </Link>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="cta-shine inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Creating your account…
                  </>
                ) : step === STEP_LABELS.length ? (
                  <>
                    Complete registration
                    <CheckCircle className="size-4" aria-hidden="true" />
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-5 rounded-2xl border border-border bg-card/40 p-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/landlord/login"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-highlight" aria-hidden="true" /> Verified
              listings
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="size-3.5 text-highlight" aria-hidden="true" /> WhatsApp-first
              contact
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5 text-highlight" aria-hidden="true" /> Campus-focused areas
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

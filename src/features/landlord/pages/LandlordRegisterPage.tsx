// @ts-nocheck
import { useEffect, useState } from 'react';
import {
  Loader2, Building2, CheckCircle, XCircle,
  ShieldCheck, Phone, MapPin, Users, FileText,
  Mail, ArrowRight,
} from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { registerLandlord, homeForStatus } from '@/features/landlord/services/landlordService';
import { useLandlord } from '@/shared/context/LandlordContext';
import { cn } from '@/shared/lib/utils';

const STEP_LABELS = ['Account', 'Profile', 'Verification'];

const CAMPUS_OPTIONS = [
  'Nairobi', 'Juja', 'Kahawa', 'Madaraka', 'Thika',
  'Kesses', 'Njoro', 'Nakuru', 'Meru', 'Eldoret',
];

export const LandlordRegisterPage = () => {
  const navigate = useNavigate();
  const { user, profile, profileState } = useLandlord();
  const [step, setStep] = useState(1);

  // Returning landlords who already have a profile skip registration.
  useEffect(() => {
    if (user && profileState === 'ok' && profile) {
      void navigate({ to: homeForStatus(profile.status), replace: true });
    }
  }, [user, profile, profileState, navigate]);
  const [consent, setConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    businessName: '',
    phone: '',
    whatsappNumber: '',
    nationalId: '',
    targetCampuses: '',
    estimatedProperties: '',
    reviewNote: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const setField = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowError(false);

    if (step < 3) {
      if (step === 1 && formData.password !== formData.confirmPassword) {
        setShowError(true);
        setErrorMessage('Passwords do not match');
        return;
      }
      setStep((s) => s + 1);
      return;
    }

    if (!consent) {
      setShowError(true);
      setErrorMessage('Please consent to storing your information to continue.');
      return;
    }

    setIsLoading(true);
    try {
      await registerLandlord({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        businessName: formData.businessName,
        phone: formData.phone,
        whatsappNumber: formData.whatsappNumber,
        nationalId: formData.nationalId,
        targetCampuses: formData.targetCampuses
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean),
        estimatedProperties: parseInt(formData.estimatedProperties, 10) || 0,
        reviewNote: formData.reviewNote,
      });

      setShowSuccess(true);
      setTimeout(() => {
        void navigate({ to: '/landlord/pending', replace: true });
      }, 2000);
    } catch (error) {
      console.error('Registration failed:', error);
      setShowError(true);
      setErrorMessage(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase =
    'w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow';

  const labelClass = 'block text-sm font-medium text-secondary-foreground mb-1.5';

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="solid-card p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-status/20">
              <CheckCircle className="h-6 w-6 text-status" />
            </div>
            <h2 className="text-2xl font-display font-medium text-foreground">
              Application Submitted
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Our team will review your details and get back to you, usually within 24 hours.
            </p>
          </div>
          <div className="space-y-3 text-sm text-secondary-foreground">
            <p className="flex items-start gap-2">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              Prepare your property photos and listing details so you are ready to go when approved.
            </p>
            <p className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              Keep an eye on the WhatsApp number you provided — that is how we will reach you.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/"
              className="cta-shine block w-full rounded-full bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary/90"
            >
              Back to homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-highlight via-primary to-highlight opacity-40" />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-xl">
          {/* Header */}
          <div className="mb-6 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground mb-4">
              <ShieldCheck className="h-3.5 w-3.5 text-highlight" />
              Verified landlords only
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
              Become a verified landlord
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              Join landlords who list student housing on UniHub. We verify every account so students can trust who they are dealing with.
            </p>
          </div>

          {/* Progress */}
          <div className="mb-6 flex items-center gap-2">
            {STEP_LABELS.map((label, i) => {
              const idx = i + 1;
              const isActive = idx === step;
              const isDone = idx < step;
              return (
                <div key={label} className="flex items-center gap-2 flex-1">
                  <div
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                      isDone
                        ? 'rounded-full bg-status/20 text-status'
                        : isActive
                        ? 'rounded-full bg-primary text-primary-foreground shadow-glow'
                        : 'rounded-full border border-border bg-card text-muted-foreground'
                    )}
                  >
                    {isDone ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      idx
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-xs font-medium sm:text-sm',
                      isActive ? 'text-foreground' : isDone ? 'text-muted-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {label}
                  </span>
                  {i < STEP_LABELS.length - 1 && (
                    <div
                      className={cn(
                        'flex-1 h-px',
                        isDone ? 'bg-status/40' : 'bg-border'
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Error banner */}
          {showError && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="solid-card p-5 sm:p-7">
            {/* Step 1: Account */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <h2 className="font-display text-lg font-medium text-foreground">Account details</h2>
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass} htmlFor="email">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputBase}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass} htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={inputBase}
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass} htmlFor="confirmPassword">
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={inputBase}
                    placeholder="Repeat your password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div></div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={cn(
                      'cta-shine inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-colors disabled:opacity-50',
                      isLoading ? 'hover:bg-primary/90' : ''
                    )}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating account…
                      </>
                    ) : (
                      <>
                        Next: Profile info
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Profile */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <h2 className="font-display text-lg font-medium text-foreground">Who you are</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className={labelClass} htmlFor="fullName">
                      Full name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={inputBase}
                      placeholder="Jane Otieno"
                      required
                      autoComplete="name"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={labelClass} htmlFor="businessName">
                      Business or agency name
                    </label>
                    <input
                      id="businessName"
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      className={inputBase}
                      placeholder="Joy Homes Real Estate"
                    />
                    <p className="text-xs text-muted-foreground">Optional — leave blank if you list as an individual.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className={labelClass} htmlFor="phone">
                      Phone number
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">+254</span>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={cn(inputBase, 'pl-10')}
                        placeholder="7XX XXX XXX"
                        required
                        autoComplete="tel-national"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className={labelClass} htmlFor="whatsappNumber">
                      WhatsApp number
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">+254</span>
                      <input
                        id="whatsappNumber"
                        type="tel"
                        name="whatsappNumber"
                        value={formData.whatsappNumber}
                        onChange={handleChange}
                        className={cn(inputBase, 'pl-10')}
                        placeholder="7XX XXX XXX"
                        required
                        autoComplete="tel-national"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Students will contact you here.</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={cn(
                      'cta-shine inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-colors disabled:opacity-50',
                      isLoading ? '' : 'hover:bg-primary/90'
                    )}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      <>
                        Next: Verification
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Verification */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  <h2 className="font-display text-lg font-medium text-foreground">Verification details</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className={labelClass} htmlFor="nationalId">
                      National ID or passport number
                    </label>
                    <input
                      id="nationalId"
                      type="text"
                      name="nationalId"
                      value={formData.nationalId}
                      onChange={handleChange}
                      className={inputBase}
                      placeholder="12345678"
                      required
                      autoComplete="off"
                    />
                    <p className="text-xs text-muted-foreground">
                      Used for verification only. Never shown publicly.
                    </p>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className={labelClass} htmlFor="targetCampuses">
                      Areas you serve
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CAMPUS_OPTIONS.map((campus) => (
                        <button
                          key={campus}
                          type="button"
                          onClick={() => {
                            const current = formData.targetCampuses
                              .split(',')
                              .map((c) => c.trim())
                              .filter(Boolean);
                            const exists = current.includes(campus);
                            const next = exists
                              ? current.filter((c) => c !== campus)
                              : [...current, campus];
                            setField('targetCampuses', next.join(', '));
                          }}
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                            formData.targetCampuses.split(',').map((c) => c.trim()).filter(Boolean).includes(campus)
                              ? 'border-foreground bg-foreground text-background'
                              : 'border-border bg-card text-secondary-foreground hover:border-foreground/50'
                          )}
                          aria-pressed={formData.targetCampuses.split(',').map((c) => c.trim()).filter(Boolean).includes(campus)}
                        >
                          {campus}
                        </button>
                      ))}
                    </div>
                    <input
                      id="targetCampuses"
                      type="text"
                      name="targetCampuses"
                      value={formData.targetCampuses}
                      onChange={handleChange}
                      className="sr-only"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Tap the areas you list properties in, or type them comma-separated.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className={labelClass} htmlFor="estimatedProperties">
                      Estimated properties you manage
                    </label>
                    <input
                      id="estimatedProperties"
                      type="number"
                      name="estimatedProperties"
                      value={formData.estimatedProperties}
                      onChange={handleChange}
                      className={inputBase}
                      placeholder="5"
                      required
                      min={0}
                      autoComplete="off"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className={labelClass} htmlFor="reviewNote">
                      Anything else for our review team?
                    </label>
                    <textarea
                      id="reviewNote"
                      name="reviewNote"
                      value={formData.reviewNote}
                      onChange={handleChange}
                      className={inputBase}
                      rows={4}
                      placeholder="Specializations, certifications, or notes for the review team…"
                    />
                  </div>
                </div>

                <div className="space-y-3 rounded-xl border border-border bg-card/40 p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent((e.target as HTMLInputElement).checked)}
                      className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-ring"
                    />
                    <div>
                      <span className="text-sm text-secondary-foreground">
                        I consent to UniHub storing this information to verify my landlord application, and I confirm the details provided are accurate.
                      </span>
                      <p className="mt-1 text-xs text-muted-foreground">
                        You can ask us to delete your data at any time by emailing hello@unihub.ke.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={cn(
                      'cta-shine inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-colors disabled:opacity-50',
                      isLoading ? '' : 'hover:bg-primary/90'
                    )}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      <>
                        Complete registration
                        <CheckCircle className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </form>

          {/* Footer */}
          <div className="mt-5 rounded-xl border border-border bg-card/40 p-4 text-center sm:text-left">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                to="/landlord/login"
                className="text-primary font-medium hover:underline underline-offset-2"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Trust strip */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-highlight" /> Verified listings
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-highlight" /> WhatsApp-first contact
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-highlight" /> Campus-focused areas
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  Loader2, CheckCircle2, XCircle, Plus, Trash2, ArrowLeft, ArrowRight, ImagePlus,
} from 'lucide-react';
import { LandlordShell } from '@/features/landlord/components/LandlordShell';
import { useApprovedLandlord } from '@/features/landlord/hooks/useApprovedLandlord';
import { createListing } from '@/features/marketplace/services';
import { uploadToCloudinary } from '@/shared/lib/cloudinary';
import { AiDescriptionAssistant } from '@/features/marketplace/AiDescriptionAssistant';
import { cn } from '@/shared/lib/utils';

const MAX_IMAGES = 10;

const CAMPUS_OPTIONS = [
  { value: 'UoN', label: 'University of Nairobi (UoN)' },
  { value: 'JKUAT', label: 'Jomo Kenyatta University (JKUAT)' },
  { value: 'KU', label: 'Kenyatta University (KU)' },
  { value: 'SU', label: 'Strathmore University (SU)' },
  { value: 'MU', label: 'Moi University (MU)' },
  { value: 'EGU', label: 'Egerton University (EGU)' },
  { value: 'Thika', label: 'Thika student belt' },
  { value: 'Nairobi', label: 'Nairobi (other areas)' },
  { value: 'Juja', label: 'Juja' },
  { value: 'Kahawa', label: 'Kahawa' },
  { value: 'Madaraka', label: 'Madaraka' },
  { value: 'Kesses', label: 'Kesses' },
  { value: 'Njoro', label: 'Njoro' },
  { value: 'Nakuru', label: 'Nakuru' },
];

const TYPE_OPTIONS = [
  'Bedsitter', 'Studio', 'Single room', 'One bedroom',
  'Two bedroom', 'Three bedroom', 'Apartment', 'Hostel',
];

type Errors = Record<string, string>;

export const LandlordNewListingPage = () => {
  const { uid, profile } = useApprovedLandlord();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    campus: '',
    location: '',
    type: '',
    price: '',
    deposit: '',
    description: '',
    amenities: '',
    images: [] as string[],
  });

  const [step, setStep] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<Errors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [savedId, setSavedId] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: '' } : prev));
  };

  const validateStepOne = (): boolean => {
    const next: Errors = {};
    if (!formData.title.trim()) next['title'] = 'Give the listing a short, clear title.';
    if (!formData.campus) next['campus'] = 'Choose the campus area this property serves.';
    if (!formData.location.trim()) next['location'] = 'Say where it is, e.g. "5 min from main gate".';
    if (!formData.type) next['type'] = 'Pick the property type.';
    const price = Number(formData.price);
    if (!formData.price.trim() || Number.isNaN(price) || price < 1000) {
      next['price'] = 'Enter the monthly rent in KES (at least 1,000).';
    }
    const deposit = Number(formData.deposit);
    if (formData.deposit.trim() && (Number.isNaN(deposit) || deposit < 0)) {
      next['deposit'] = 'Deposit must be a number, or leave it blank.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goToStepTwo = () => {
    if (validateStepOne()) {
      setStep(2);
      setSubmitError('');
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (files.length === 0) return;

    const room = MAX_IMAGES - formData.images.length;
    if (room <= 0) {
      setUploadError(`You can add up to ${MAX_IMAGES} photos.`);
      return;
    }

    setIsUploading(true);
    setUploadError('');
    try {
      const urls = await Promise.all(files.slice(0, room).map((file) => uploadToCloudinary(file)));
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (error) {
      console.error('Photo upload failed:', error);
      setUploadError(
        error instanceof Error
          ? `Photo upload failed: ${error.message}`
          : 'Photo upload failed. Try smaller images, or submit without photos.',
      );
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = (url: string) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((p) => p !== url) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      goToStepTwo();
      return;
    }

    if (!formData.description.trim() || formData.description.trim().length < 30) {
      setErrors({ description: 'Write at least a couple of sentences so students know what to expect.' });
      return;
    }
    if (!uid) {
      setSubmitError('Your session expired. Sign in again to submit this listing.');
      return;
    }

    setIsSaving(true);
    setSubmitError('');
    try {
      const id = await createListing(uid, {
        title: formData.title.trim(),
        campus: formData.campus,
        location: formData.location.trim(),
        type: formData.type,
        price: Number(formData.price),
        deposit: formData.deposit.trim() ? Number(formData.deposit) : 0,
        description: formData.description.trim(),
        amenities: formData.amenities.split(',').map((a) => a.trim()).filter((a) => a.length > 0),
        images: formData.images,
        ...(profile?.fullName ? { landlordName: profile.fullName } : {}),
      });
      setSavedId(id);
    } catch (error) {
      console.error('Failed to create listing:', error);
      setSubmitError(
        error instanceof Error ? error.message : 'We could not save your listing. Please try again.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (savedId) {
    return (
      <LandlordShell>
        <div className="mx-auto max-w-lg rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" aria-hidden="true" />
          <h1 className="mt-4 font-display text-xl font-medium text-emerald-900">Listing submitted</h1>
          <p className="mt-2 text-sm text-emerald-800">
            Your listing is pending review. Once an admin approves it, it appears in campus search.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/landlord/listings"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              View my listings
            </Link>
            <button
              type="button"
              onClick={() => {
                setSavedId(null);
                setFormData({ title: '', campus: '', location: '', type: '', price: '', deposit: '', description: '', amenities: '', images: [] });
                setStep(1);
              }}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-accent"
            >
              Add another
            </button>
          </div>
        </div>
      </LandlordShell>
    );
  }

  const fieldClass = (name: string) =>
    cn(
      'w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring',
      errors[name] ? 'border-destructive' : 'border-border',
    );

  return (
    <LandlordShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <header>
          <Link to="/landlord/listings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to listings
          </Link>
          <h1 className="mt-3 font-display text-2xl font-medium">New listing</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Listings go to review before students see them. Clear photos and honest details get approved faster.
          </p>
        </header>

        <ol className="flex items-center gap-3 text-sm" aria-label="Listing steps">
          <li className={cn('flex items-center gap-2 font-medium', step === 1 ? 'text-foreground' : 'text-muted-foreground')}>
            <span className={cn('flex h-6 w-6 items-center justify-center rounded-full border text-xs', step === 1 ? 'border-primary bg-primary text-primary-foreground' : 'border-border')}>1</span>
            Property details
          </li>
          <li className="h-px flex-1 bg-border" aria-hidden="true" />
          <li className={cn('flex items-center gap-2 font-medium', step === 2 ? 'text-foreground' : 'text-muted-foreground')}>
            <span className={cn('flex h-6 w-6 items-center justify-center rounded-full border text-xs', step === 2 ? 'border-primary bg-primary text-primary-foreground' : 'border-border')}>2</span>
            Photos &amp; description
          </li>
        </ol>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6" noValidate>
          {step === 1 && (
            <>
              <div>
                <label htmlFor="title" className="mb-1 block text-sm font-medium">Property title</label>
                <input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={fieldClass('title')}
                  placeholder="Spacious bedsitter near JKUAT main gate"
                  aria-invalid={Boolean(errors['title'])}
                />
                {errors['title'] && <p className="mt-1 text-xs text-destructive">{errors['title']}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="campus" className="mb-1 block text-sm font-medium">Campus / area</label>
                  <select id="campus" name="campus" value={formData.campus} onChange={handleChange} className={fieldClass('campus')} aria-invalid={Boolean(errors['campus'])}>
                    <option value="">Select campus area</option>
                    {CAMPUS_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  {errors['campus'] && <p className="mt-1 text-xs text-destructive">{errors['campus']}</p>}
                </div>

                <div>
                  <label htmlFor="type" className="mb-1 block text-sm font-medium">Property type</label>
                  <select id="type" name="type" value={formData.type} onChange={handleChange} className={fieldClass('type')} aria-invalid={Boolean(errors['type'])}>
                    <option value="">Select type</option>
                    {TYPE_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {errors['type'] && <p className="mt-1 text-xs text-destructive">{errors['type']}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="location" className="mb-1 block text-sm font-medium">Specific location</label>
                <input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={fieldClass('location')}
                  placeholder="e.g. Near main gate, opposite the supermarket"
                  aria-invalid={Boolean(errors['location'])}
                />
                {errors['location'] && <p className="mt-1 text-xs text-destructive">{errors['location']}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="price" className="mb-1 block text-sm font-medium">Monthly rent (KES)</label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    inputMode="numeric"
                    min="1000"
                    value={formData.price}
                    onChange={handleChange}
                    className={fieldClass('price')}
                    placeholder="15000"
                    aria-invalid={Boolean(errors['price'])}
                  />
                  {errors['price'] && <p className="mt-1 text-xs text-destructive">{errors['price']}</p>}
                </div>
                <div>
                  <label htmlFor="deposit" className="mb-1 block text-sm font-medium">Deposit (KES, optional)</label>
                  <input
                    id="deposit"
                    name="deposit"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={formData.deposit}
                    onChange={handleChange}
                    className={fieldClass('deposit')}
                    placeholder="15000"
                    aria-invalid={Boolean(errors['deposit'])}
                  />
                  {errors['deposit'] && <p className="mt-1 text-xs text-destructive">{errors['deposit']}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <Link to="/landlord/listings" className="text-sm text-muted-foreground hover:text-foreground">Cancel</Link>
                <button
                  type="button"
                  onClick={goToStepTwo}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
                >
                  Next: photos &amp; description
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <AiDescriptionAssistant
                details={{ ...formData, campus: formData.campus, price: formData.price }}
                onApply={(text) => {
                  setFormData((prev) => ({ ...prev, description: text }));
                  setErrors((prev) => ({ ...prev, description: '' }));
                }}
              />

              <div>
                <label htmlFor="description" className="mb-1 block text-sm font-medium">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={7}
                  className={fieldClass('description')}
                  placeholder="Describe the rooms, water and electricity, security, transport links."
                  aria-invalid={Boolean(errors['description'])}
                />
                {errors['description'] && <p className="mt-1 text-xs text-destructive">{errors['description']}</p>}
              </div>

              <div>
                <label htmlFor="amenities" className="mb-1 block text-sm font-medium">Amenities (comma-separated)</label>
                <input
                  id="amenities"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Wi-Fi, 24/7 water, security, parking, gym"
                />
              </div>

              <div>
                <span className="mb-1 block text-sm font-medium">Photos</span>
                <p className="mb-2 text-xs text-muted-foreground">Up to {MAX_IMAGES} images. First photo becomes the cover.</p>

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-accent">
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                  {isUploading ? 'Uploading…' : 'Add photos'}
                  <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="sr-only" disabled={isUploading} />
                </label>

                {uploadError && <p className="mt-2 text-xs text-destructive">{uploadError}</p>}

                {formData.images.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {formData.images.map((url) => (
                      <li key={url} className="relative">
                        <img src={url} alt="Property photo" className="h-20 w-24 rounded-lg border border-border object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(url)}
                          aria-label="Remove photo"
                          className="absolute -right-1.5 -top-1.5 rounded-full border border-border bg-background p-1 text-destructive shadow-sm hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {submitError && (
                <p className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0" /> {submitError}
                </p>
              )}

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {isSaving ? 'Submitting…' : 'Submit for review'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </LandlordShell>
  );
};

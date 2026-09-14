import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { problemsApi } from '../../api/problems.api';
import type { ProblemCategory } from '../../types';

const CATEGORIES: { value: ProblemCategory; label: string; icon: string }[] = [
  { value: 'WATER_SANITATION', label: 'Water & Sanitation', icon: 'water_drop' },
  { value: 'INFRASTRUCTURE',   label: 'Roads & Infrastructure', icon: 'construction' },
  { value: 'HEALTHCARE',       label: 'Healthcare & Clinics', icon: 'local_hospital' },
  { value: 'EDUCATION',        label: 'Primary Education', icon: 'school' },
  { value: 'AGRICULTURE',      label: 'Agriculture & Irrigation', icon: 'agriculture' },
  { value: 'ENVIRONMENT',      label: 'Environment & Waste', icon: 'eco' },
  { value: 'ENERGY',           label: 'Power & Streetlights', icon: 'bolt' },
  { value: 'OTHER',            label: 'Other Civic Grievance', icon: 'category' },
];

interface FormState {
  title: string;
  description: string;
  category: ProblemCategory;
  pincode: string;
  village: string;
  address: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
}

interface LocalityOption {
  name: string;
  block?: string;
  district: string;
  state: string;
}

interface MediaItem {
  file: File;
  previewUrl: string;
  isVideo: boolean;
}

const INITIAL: FormState = {
  title: '',
  description: '',
  category: 'WATER_SANITATION',
  pincode: '',
  village: '',
  address: '',
  district: '',
  state: '',
  latitude: 0,
  longitude: 0,
};

const ProblemSubmit: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>(INITIAL);
  const [localities, setLocalities] = useState<LocalityOption[]>([]);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoStatus, setGeoStatus] = useState<string | null>(null);

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [newProblemId, setNewProblemId] = useState<string | null>(null);

  // Field change
  const setField = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  // ─── 1. HIGH-PRECISION GEOLOCATION ─────────────────────────────────────
  const detectGpsLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLoading(true);
    setGeoStatus('Acquiring high-precision GPS lock…');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lon = Number(pos.coords.longitude.toFixed(6));
        const accuracy = Math.round(pos.coords.accuracy);

        setForm((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lon,
        }));
        setGeoStatus(`GPS Locked: ${lat}° N, ${lon}° E (±${accuracy}m precision)`);

        // Reverse Geocode via OpenStreetMap Nominatim
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const street = addr.road || addr.suburb || addr.neighbourhood || '';
            const detectedDistrict = addr.state_district || addr.county || addr.city || '';
            const detectedState = addr.state || '';
            const detectedPostcode = addr.postcode || '';

            setForm((prev) => ({
              ...prev,
              address: street ? `${street}, ${data.display_name.split(',').slice(0, 2).join(',')}` : prev.address,
              district: detectedDistrict || prev.district,
              state: detectedState || prev.state,
              pincode: detectedPostcode ? detectedPostcode.replace(/\D/g, '') : prev.pincode,
            }));

            // If pincode found, auto-trigger locality search
            if (detectedPostcode && detectedPostcode.length === 6) {
              fetchPincodeDetails(detectedPostcode);
            }
          }
        } catch {
          // Keep GPS coordinates even if reverse geocode service is rate-limited
        } finally {
          setGeoLoading(false);
        }
      },
      (err) => {
        setGeoLoading(false);
        setGeoStatus(`GPS Error: ${err.message}. Please enter PIN code manually.`);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  // ─── 2. INDIAN PIN CODE LOOKUP & VILLAGE AUTO-FILL ─────────────────────
  const fetchPincodeDetails = async (pin: string) => {
    if (pin.length !== 6) return;
    setPincodeLoading(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();

      if (Array.isArray(data) && data[0]?.Status === 'Success') {
        const postOffices = data[0].PostOffice || [];
        const options: LocalityOption[] = postOffices.map((po: any) => ({
          name: po.Name,
          block: po.Block !== 'NA' ? po.Block : undefined,
          district: po.District,
          state: po.State,
        }));

        setLocalities(options);

        // Auto-fill District & State from the first postal record
        if (options.length > 0) {
          setForm((prev) => ({
            ...prev,
            district: options[0].district,
            state: options[0].state,
            village: prev.village || options[0].name,
          }));
        }
      } else {
        setLocalities([]);
      }
    } catch {
      setLocalities([]);
    } finally {
      setPincodeLoading(false);
    }
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setForm((prev) => ({ ...prev, pincode: val }));
    if (val.length === 6) {
      fetchPincodeDetails(val);
    } else {
      setLocalities([]);
    }
  };

  const handleLocalitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setForm((prev) => ({
      ...prev,
      village: selected,
      address: prev.address ? `${selected}, ${prev.address}` : selected,
    }));
  };

  // ─── 3. MULTI-MEDIA UPLOADS (IMAGES & VIDEOS) ──────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    const newItems: MediaItem[] = files.map((file) => {
      const isVideo = file.type.startsWith('video/') || /\.(mp4|mov|webm|mkv)$/i.test(file.name);
      return {
        file,
        previewUrl: URL.createObjectURL(file),
        isVideo,
      };
    });

    setMediaItems((prev) => [...prev, ...newItems].slice(0, 6)); // Max 6 items
  };

  const removeMedia = (index: number) => {
    setMediaItems((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  // ─── 4. FORM SUBMISSION ────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || form.title.trim().length < 8) {
      setServerError('Title must be at least 8 characters long.');
      return;
    }
    if (!form.description.trim() || form.description.trim().length < 25) {
      setServerError('Please provide a detailed description of at least 25 characters.');
      return;
    }
    if (!form.district.trim() || !form.state.trim()) {
      setServerError('District and State are required. Enter your PIN code or use GPS detection.');
      return;
    }

    setServerError(null);
    setLoading(true);

    try {
      const fullAddress = [form.village, form.address, form.pincode ? `PIN: ${form.pincode}` : '']
        .filter(Boolean)
        .join(', ');

      const problem = await problemsApi.create({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        address: fullAddress || `${form.district}, ${form.state}`,
        district: form.district.trim(),
        state: form.state.trim(),
        latitude: form.latitude || 26.8467,
        longitude: form.longitude || 80.9462,
        attachments: mediaItems.map((m) => m.file),
      });

      setNewProblemId(problem.id);
      setSubmitted(true);
    } catch (err: any) {
      setServerError(err.message || 'Problem submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-space-md">
        <div className="max-w-md w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-xl text-center shadow-lg">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-space-md">
            <span className="material-symbols-outlined text-4xl">check_circle</span>
          </div>
          <h2 className="font-headline-lg font-bold text-on-surface mb-space-xs">
            Civic Problem Registered!
          </h2>
          <p className="font-body-md text-on-surface-variant mb-space-md">
            Your grievance has been securely hashed and routed through Samadhan AI's triage network.
          </p>
          {newProblemId && (
            <div className="p-space-sm bg-surface-container rounded-xl font-mono text-xs text-primary mb-space-lg break-all border border-primary/20">
              Reference Token: <strong>{newProblemId}</strong>
            </div>
          )}
          <div className="flex gap-space-sm justify-center">
            <Link
              to="/citizen/problems"
              className="px-space-lg py-2.5 rounded-xl bg-primary text-on-primary font-label-lg font-semibold hover:bg-primary-container transition-all"
            >
              Track in My Problems
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setForm(INITIAL);
                setMediaItems([]);
              }}
              className="px-space-md py-2.5 rounded-xl border border-outline-variant font-label-lg text-on-surface hover:bg-surface-container transition-all"
            >
              Report Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-space-xl px-space-md">
      {/* Header */}
      <div className="mb-space-lg">
        <div className="flex items-center gap-space-xs text-primary font-label-md uppercase tracking-wider mb-space-xs">
          <span className="material-symbols-outlined text-base">add_location_alt</span>
          <span>Grassroots Civic Telemetry Node</span>
        </div>
        <h1 className="font-headline-xl font-bold text-on-surface">
          Report a Community Challenge
        </h1>
        <p className="font-body-md text-on-surface-variant">
          Provide geotagged civic grievances with photo and video evidence for AI automated triage and university R&D matching.
        </p>
      </div>

      {serverError && (
        <div className="mb-space-md p-space-md rounded-xl bg-error-container text-on-error-container font-body-sm flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-error">error</span>
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-space-lg">

        {/* ─── SECTION 1: PROBLEM DETAILS ──────────────────────────────── */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-lg shadow-xs space-y-space-md">
          <h2 className="font-headline-sm font-semibold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">description</span>
            Problem Overview
          </h2>

          <div>
            <label className="block font-label-caps text-on-surface-variant uppercase mb-1">
              Problem Title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={setField('title')}
              placeholder="e.g., Contaminated Drinking Water Supply in Rampur Village"
              required
              className="w-full px-space-md py-3 rounded-xl border border-outline-variant bg-surface font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block font-label-caps text-on-surface-variant uppercase mb-1">
              Detailed Incident Narrative *
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={setField('description')}
              placeholder="Describe what is broken, who is affected (households, schools, farmers), duration, and current danger level…"
              required
              className="w-full px-space-md py-3 rounded-xl border border-outline-variant bg-surface font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="text-xs text-on-surface-variant font-mono">
              {form.description.length} / 1000 characters
            </span>
          </div>

          <div>
            <label className="block font-label-caps text-on-surface-variant uppercase mb-1.5">
              Sector / Category *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm">
              {CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c.value}
                  onClick={() => setForm((prev) => ({ ...prev, category: c.value }))}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                    form.category === c.value
                      ? 'border-primary bg-primary/10 text-primary font-semibold'
                      : 'border-outline-variant/50 hover:bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{c.icon}</span>
                  <span className="text-xs font-medium">{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── SECTION 2: LOCATION PRECISION & PIN CODE AUTO-FILL ──────── */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-lg shadow-xs space-y-space-md">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="font-headline-sm font-semibold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
              Location Precision & Jurisdiction
            </h2>

            {/* GPS Detection Button */}
            <button
              type="button"
              onClick={detectGpsLocation}
              disabled={geoLoading}
              className="px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              {geoLoading ? (
                <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-[16px]">my_location</span>
              )}
              {geoLoading ? 'Detecting GPS…' : 'Detect My Current GPS Location'}
            </button>
          </div>

          {geoStatus && (
            <div className="p-2.5 rounded-xl bg-surface-container text-xs text-primary font-mono border border-outline-variant/40 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {geoStatus}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {/* PIN Code Field */}
            <div>
              <label className="block font-label-caps text-on-surface-variant uppercase mb-1">
                Indian Postal PIN Code (6 Digits)
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  value={form.pincode}
                  onChange={handlePincodeChange}
                  placeholder="e.g. 226001, 110001, 560001"
                  className="w-full px-space-md py-2.5 rounded-xl border border-outline-variant bg-surface font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {pincodeLoading && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary animate-spin text-[18px]">
                    progress_activity
                  </span>
                )}
              </div>
              <p className="text-[11px] text-on-surface-variant mt-1">
                Autofills Village, District, and State across all 19,000+ Indian postal codes.
              </p>
            </div>

            {/* Village / Locality Dropdown */}
            <div>
              <label className="block font-label-caps text-on-surface-variant uppercase mb-1">
                Village / Locality / Post Office
              </label>
              {localities.length > 0 ? (
                <select
                  value={form.village}
                  onChange={handleLocalitySelect}
                  className="w-full px-space-md py-2.5 rounded-xl border border-primary bg-primary/5 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">-- Select Village / Colony / Post Office --</option>
                  {localities.map((loc, i) => (
                    <option key={i} value={loc.name}>
                      {loc.name} {loc.block ? `(${loc.block} Block)` : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={form.village}
                  onChange={setField('village')}
                  placeholder="e.g. Rampur Village or Colony Name"
                  className="w-full px-space-md py-2.5 rounded-xl border border-outline-variant bg-surface font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              )}
            </div>

            {/* Street Address */}
            <div className="md:col-span-2">
              <label className="block font-label-caps text-on-surface-variant uppercase mb-1">
                Specific Landmark / Street Line
              </label>
              <input
                type="text"
                value={form.address}
                onChange={setField('address')}
                placeholder="e.g. Near Primary Health Center, Ward No. 4"
                className="w-full px-space-md py-2.5 rounded-xl border border-outline-variant bg-surface font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* District */}
            <div>
              <label className="block font-label-caps text-on-surface-variant uppercase mb-1">
                District *
              </label>
              <input
                type="text"
                value={form.district}
                onChange={setField('district')}
                placeholder="e.g. Lucknow, Varanasi, Pune"
                required
                className="w-full px-space-md py-2.5 rounded-xl border border-outline-variant bg-surface font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* State */}
            <div>
              <label className="block font-label-caps text-on-surface-variant uppercase mb-1">
                State *
              </label>
              <input
                type="text"
                value={form.state}
                onChange={setField('state')}
                placeholder="e.g. Uttar Pradesh, Maharashtra"
                required
                className="w-full px-space-md py-2.5 rounded-xl border border-outline-variant bg-surface font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* ─── SECTION 3: IMAGE & VIDEO EVIDENCE UPLOAD ────────────────── */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-lg shadow-xs space-y-space-md">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm font-semibold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">perm_media</span>
              Cryptographic Ground Evidence (Photos & Videos)
            </h2>
            <span className="text-xs font-mono text-on-surface-variant">
              {mediaItems.length} / 6 Attached
            </span>
          </div>

          <p className="text-xs text-on-surface-variant">
            Attach photo proof (.jpg, .png, .webp) or recorded video clips (.mp4, .mov, .webm up to 50MB) to verify site conditions.
          </p>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/mp4,video/quicktime,video/webm"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Dropzone Trigger */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-outline-variant/60 hover:border-primary rounded-2xl p-space-lg text-center cursor-pointer transition-all bg-surface/50 hover:bg-primary/5"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
              <span className="material-symbols-outlined text-2xl">cloud_upload</span>
            </div>
            <p className="font-label-lg font-semibold text-on-surface">
              Click to browse or drag & drop Photos and Videos
            </p>
            <p className="text-xs text-on-surface-variant mt-1">
              Supports JPEG, PNG, WEBP, MP4, MOV, WEBM (Up to 50MB per file)
            </p>
          </div>

          {/* Media Previews Grid */}
          {mediaItems.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-md pt-space-xs">
              {mediaItems.map((item, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-xl overflow-hidden border border-outline-variant/40 bg-surface-container shadow-xs"
                >
                  {item.isVideo ? (
                    <div className="aspect-video bg-black flex items-center justify-center">
                      <video
                        src={item.previewUrl}
                        controls
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-surface-container-high overflow-hidden">
                      <img
                        src={item.previewUrl}
                        alt="Evidence"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}

                  <div className="p-2 flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
                    <span className="truncate max-w-[120px]">{item.file.name}</span>
                    <span className="uppercase px-1 rounded bg-surface-container-high text-[9px] font-bold">
                      {item.isVideo ? 'VIDEO' : 'IMAGE'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeMedia(idx)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-error text-on-error flex items-center justify-center text-xs shadow-md opacity-90 hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── SUBMIT BUTTON ────────────────────────────────────────────── */}
        <div className="pt-space-xs">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-primary text-on-primary font-headline-sm hover:bg-primary-container transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>}
            {loading ? 'Hasing Evidence & Routing to AI Triage…' : 'Submit Civic Grievance to Samadhan AI'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default ProblemSubmit;

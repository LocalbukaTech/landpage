"use client";

import {useCallback, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {MainLayout} from "@/components/layout/MainLayout";
import {useCreateRestaurant} from "@/lib/api";
import {useAuth} from "@/context/AuthContext";
import {useToast} from "@/hooks/use-toast";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChefHat,
  Clock,
  DollarSign,
  Globe,
  ImagePlus,
  Info,
  Loader2,
  MapPin,
  Phone,
  Store,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";

// ── Types ──
type Step = 1 | 2 | 3 | 4;

interface FormState {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  lat: string;
  lng: string;
  phone: string;
  website: string;
  cuisine: string;
  priceLevel: number;
  openingHours: Record<string, string>;
  isClaimedByOwner: boolean;
  photos: File[];
  photoPreviewUrls: string[];
}

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const PRICE_LEVELS = [
  {value: 1, label: "₦", desc: "Budget friendly"},
  {value: 2, label: "₦₦", desc: "Moderate"},
  {value: 3, label: "₦₦₦", desc: "Upscale"},
  {value: 4, label: "₦₦₦₦", desc: "Fine dining"},
];

const POPULAR_CUISINES = [
  "Nigerian", "Yoruba", "Igbo", "Hausa", "Calabar", "Edo",
  "Ghanaian", "Senegalese", "Ethiopian", "Kenyan",
  "Fast Food", "Chinese", "Indian", "Italian", "Mexican",
  "Continental", "Seafood", "Grills & BBQ", "Pastries & Bakery",
];

const INITIAL_HOURS: Record<string, string> = {
  monday: "9am-9pm",
  tuesday: "9am-9pm",
  wednesday: "9am-9pm",
  thursday: "9am-9pm",
  friday: "9am-9pm",
  saturday: "10am-8pm",
  sunday: "",
};

const initialForm: FormState = {
  name: "",
  description: "",
  address: "",
  city: "",
  state: "",
  country: "",
  lat: "",
  lng: "",
  phone: "",
  website: "",
  cuisine: "",
  priceLevel: 2,
  openingHours: {...INITIAL_HOURS},
  isClaimedByOwner: true,
  photos: [],
  photoPreviewUrls: [],
};

export default function ListRestaurantPage() {
  const router = useRouter();
  const {toast} = useToast();
  const {isAuthenticated, openAuthModal} = useAuth();
  const createMutation = useCreateRestaurant();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Helpers ──
  const set = useCallback(
      <K extends keyof FormState>(key: K, value: FormState[K]) =>
          setForm((prev) => ({...prev, [key]: value})),
      []
  );

  const toggleCuisine = (c: string) => {
    setSelectedCuisines((prev) =>
        prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (form.photos.length + files.length > 10) {
      toast({title: "Limit reached", description: "Maximum 10 photos allowed.", variant: "destructive"});
      return;
    }
    const newPhotos = [...form.photos, ...files];
    const newPreviews = [
      ...form.photoPreviewUrls,
      ...files.map((f) => URL.createObjectURL(f)),
    ];
    setForm((prev) => ({...prev, photos: newPhotos, photoPreviewUrls: newPreviews}));
  };

  const removePhoto = (idx: number) => {
    URL.revokeObjectURL(form.photoPreviewUrls[idx]);
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx),
      photoPreviewUrls: prev.photoPreviewUrls.filter((_, i) => i !== idx),
    }));
  };

  const setHour = (day: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      openingHours: {...prev.openingHours, [day]: value},
    }));
  };

  // ── Validation ──
  const validateStep = (s: Step): boolean => {
    const errs: Record<string, string> = {};
    if (s === 1) {
      if (!form.name.trim()) errs.name = "Restaurant name is required";
      if (!form.address.trim()) errs.address = "Address is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, 4) as Step);
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1) as Step);

  // ── Submit ──
  const handleSubmit = async () => {
    if (!isAuthenticated) {
      openAuthModal(() => handleSubmit());
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name.trim());
    formData.append("address", form.address.trim());

    if (form.description.trim()) formData.append("description", form.description.trim());
    if (form.city.trim()) formData.append("city", form.city.trim());
    if (form.state.trim()) formData.append("state", form.state.trim());
    if (form.country.trim()) formData.append("country", form.country.trim());
    if (form.lat.trim()) formData.append("lat", form.lat.trim());
    if (form.lng.trim()) formData.append("lng", form.lng.trim());
    if (form.phone.trim()) formData.append("phone", form.phone.trim());
    if (form.website.trim()) formData.append("website", form.website.trim());

    const cuisineStr = selectedCuisines.length > 0
        ? selectedCuisines.join(",")
        : form.cuisine.trim();
    if (cuisineStr) formData.append("cuisine", cuisineStr);

    formData.append("priceLevel", String(form.priceLevel));

    // openingHours as JSON string
    const filteredHours = Object.fromEntries(
        Object.entries(form.openingHours).filter(([, v]) => v.trim() !== "")
    );
    if (Object.keys(filteredHours).length > 0) {
      formData.append("openingHours", JSON.stringify(filteredHours));
    }

    formData.append("isClaimedByOwner", String(form.isClaimedByOwner));

    // Photos
    form.photos.forEach((photo) => formData.append("photos", photo));

    try {
      await createMutation.mutateAsync(formData);
      // Clean up localStorage remnants from old flow
      localStorage.removeItem("listRestaurantForm");
      localStorage.removeItem("selectedCuisines");
      localStorage.removeItem("restaurantHours");
      localStorage.removeItem("summaryHours");
      setStep(4 as Step);
    } catch (e: any) {
      const status = e.response?.status;
      const message = e.response?.data?.message || e.message;
      if (status === 401) {
        toast({
          title: "Authentication required",
          description: "Please log in to list a restaurant.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Submission failed",
          description: message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // ── Step labels ──
  const stepLabels = ["Details", "Extras", "Photos & Hours"];

  return (
      <MainLayout>
        <div
            className="w-full max-w-2xl mx-auto px-4 py-6 overflow-y-auto h-[calc(100vh-3.5rem)] md:h-auto scrollbar-hide">
          {/* Header */}
          {step < 4 && (
              <div className="mb-8">
                <button
                    onClick={() => (step === 1 ? router.back() : prevStep())}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6 group"
                >
                  <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform"/>
                  <span className="text-sm font-medium">
                {step === 1 ? "Back" : "Previous step"}
              </span>
                </button>

                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    List a Restaurant
                  </h1>
                  <span className="text-sm text-zinc-500 font-medium">
                Step {step} of 3
              </span>
                </div>

                {/* Progress bar */}
                <div className="flex gap-2 mt-4">
                  {[1, 2, 3].map((s) => (
                      <div
                          key={s}
                          className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                              s <= step ? "bg-[#fbbe15]" : "bg-white/10"
                          }`}
                      />
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {stepLabels.map((label, i) => (
                      <span
                          key={label}
                          className={`text-xs font-medium ${
                              i + 1 <= step ? "text-[#fbbe15]" : "text-zinc-600"
                          }`}
                      >
                  {label}
                </span>
                  ))}
                </div>
              </div>
          )}

          {/* ═══════════════ STEP 1 — Basic Info & Location ═══════════════ */}
          {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#fbbe15]/10 flex items-center justify-center">
                      <Store size={20} className="text-[#fbbe15]"/>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Basic Information</h2>
                      <p className="text-sm text-zinc-400">Tell us about your restaurant</p>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-zinc-300 mb-2">
                      Restaurant Name <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="e.g. Mama Put Kitchen"
                        className={`w-full px-4 py-3.5 bg-white/5 border ${
                            errors.name ? "border-red-500" : "border-white/10"
                        } rounded-xl text-white placeholder:text-zinc-600 outline-none focus:border-[#fbbe15]/50 focus:ring-1 focus:ring-[#fbbe15]/20 transition-all`}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-zinc-300 mb-2">Description</label>
                    <textarea
                        value={form.description}
                        onChange={(e) => set("description", e.target.value)}
                        placeholder="Describe what makes your restaurant special..."
                        rows={3}
                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 outline-none focus:border-[#fbbe15]/50 focus:ring-1 focus:ring-[#fbbe15]/20 transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Address section */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#fbbe15]/10 flex items-center justify-center">
                      <MapPin size={20} className="text-[#fbbe15]"/>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Location</h2>
                      <p className="text-sm text-zinc-400">Where can people find you?</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-300 mb-2">
                      Street Address <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={form.address}
                        onChange={(e) => set("address", e.target.value)}
                        placeholder="e.g. 12 Allen Avenue"
                        className={`w-full px-4 py-3.5 bg-white/5 border ${
                            errors.address ? "border-red-500" : "border-white/10"
                        } rounded-xl text-white placeholder:text-zinc-600 outline-none focus:border-[#fbbe15]/50 focus:ring-1 focus:ring-[#fbbe15]/20 transition-all`}
                    />
                    {errors.address && <p className="text-red-400 text-xs mt-1.5">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-zinc-300 mb-2">City</label>
                      <input type="text" value={form.city} onChange={(e) => set("city", e.target.value)}
                             placeholder="Lagos"
                             className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 outline-none focus:border-[#fbbe15]/50 transition-all"/>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-zinc-300 mb-2">State</label>
                      <input type="text" value={form.state} onChange={(e) => set("state", e.target.value)}
                             placeholder="Lagos"
                             className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 outline-none focus:border-[#fbbe15]/50 transition-all"/>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-zinc-300 mb-2">Country</label>
                      <input type="text" value={form.country} onChange={(e) => set("country", e.target.value)}
                             placeholder="Nigeria"
                             className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 outline-none focus:border-[#fbbe15]/50 transition-all"/>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-zinc-300 mb-2">Latitude <span
                          className="text-zinc-600">(optional)</span></label>
                      <input type="text" value={form.lat} onChange={(e) => set("lat", e.target.value)}
                             placeholder="6.5244"
                             className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 outline-none focus:border-[#fbbe15]/50 transition-all"/>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-zinc-300 mb-2">Longitude <span
                          className="text-zinc-600">(optional)</span></label>
                      <input type="text" value={form.lng} onChange={(e) => set("lng", e.target.value)}
                             placeholder="3.3792"
                             className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 outline-none focus:border-[#fbbe15]/50 transition-all"/>
                    </div>
                  </div>
                </div>

                <button onClick={nextStep}
                        className="w-full py-4 bg-[#fbbe15] text-[#1a1a1a] font-bold text-base rounded-xl hover:bg-[#e5ac10] transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                  Continue <ArrowRight size={18}/>
                </button>
              </div>
          )}

          {/* ═══════════════ STEP 2 — Contact, Cuisine, Price ═══════════════ */}
          {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Contact */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#fbbe15]/10 flex items-center justify-center">
                      <Phone size={20} className="text-[#fbbe15]"/>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Contact &amp; Links</h2>
                      <p className="text-sm text-zinc-400">How can customers reach you?</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-zinc-300 mb-2">Phone</label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"/>
                        <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)}
                               placeholder="+234 800 123 4567"
                               className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 outline-none focus:border-[#fbbe15]/50 transition-all"/>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-zinc-300 mb-2">Website</label>
                      <div className="relative">
                        <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"/>
                        <input type="url" value={form.website} onChange={(e) => set("website", e.target.value)}
                               placeholder="https://yoursite.com"
                               className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 outline-none focus:border-[#fbbe15]/50 transition-all"/>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cuisine */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#fbbe15]/10 flex items-center justify-center">
                      <ChefHat size={20} className="text-[#fbbe15]"/>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Cuisine Type</h2>
                      <p className="text-sm text-zinc-400">Select all that apply</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_CUISINES.map((c) => (
                        <button key={c} onClick={() => toggleCuisine(c)}
                                className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all border ${selectedCuisines.includes(c) ? "bg-[#fbbe15] text-[#1a1a1a] border-[#fbbe15]" : "bg-white/5 text-zinc-300 border-white/10 hover:border-white/25"}`}>
                          {selectedCuisines.includes(c) && <Check size={14} className="inline mr-1.5 -mt-0.5"/>}
                          {c}
                        </button>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-500 mb-2">Or type custom cuisines
                      (comma-separated)</label>
                    <input type="text" value={form.cuisine} onChange={(e) => set("cuisine", e.target.value)}
                           placeholder="e.g. Suya, Pepper Soup"
                           className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 outline-none focus:border-[#fbbe15]/50 transition-all"/>
                  </div>
                </div>

                {/* Price Level */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#fbbe15]/10 flex items-center justify-center">
                      <DollarSign size={20} className="text-[#fbbe15]"/>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Price Level</h2>
                      <p className="text-sm text-zinc-400">How pricy is the experience?</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {PRICE_LEVELS.map((pl) => (
                        <button key={pl.value} onClick={() => set("priceLevel", pl.value)}
                                className={`flex flex-col items-center gap-1.5 py-4 rounded-xl border transition-all ${form.priceLevel === pl.value ? "bg-[#fbbe15]/10 border-[#fbbe15] text-[#fbbe15]" : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/25"}`}>
                          <span className="text-xl font-bold">{pl.label}</span>
                          <span className="text-[10px] font-medium opacity-70">{pl.desc}</span>
                        </button>
                    ))}
                  </div>
                </div>

                {/* Ownership toggle */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#fbbe15]/10 flex items-center justify-center">
                        <Info size={20} className="text-[#fbbe15]"/>
                      </div>
                      <div>
                        <span className="text-base font-bold text-white block">I own this restaurant</span>
                        <span className="text-sm text-zinc-400">Claim ownership of this listing</span>
                      </div>
                    </div>
                    <button onClick={() => set("isClaimedByOwner", !form.isClaimedByOwner)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${form.isClaimedByOwner ? "bg-[#fbbe15]" : "bg-white/20"}`}>
                      <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${form.isClaimedByOwner ? "translate-x-7" : "translate-x-1"}`}/>
                    </button>
                  </div>
                </div>

                <button onClick={nextStep}
                        className="w-full py-4 bg-[#fbbe15] text-[#1a1a1a] font-bold text-base rounded-xl hover:bg-[#e5ac10] transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                  Continue <ArrowRight size={18}/>
                </button>
              </div>
          )}

          {/* ═══════════════ STEP 3 — Photos, Hours, Review ═══════════════ */}
          {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Photos */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#fbbe15]/10 flex items-center justify-center">
                      <ImagePlus size={20} className="text-[#fbbe15]"/>
                </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Photos</h2>
                      <p className="text-sm text-zinc-400">Upload up to 10 photos of your restaurant</p>
                    </div>
                  </div>

                  <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handlePhotoSelect}
                         className="hidden"/>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {form.photoPreviewUrls.map((url, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                          <Image src={url} alt={`Photo ${i + 1}`} fill className="object-cover"/>
                          <button onClick={() => removePhoto(i)}
                                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <X size={14} className="text-white"/>
                    </button>
                        </div>
                    ))}
                    {form.photos.length < 10 && (
                        <button onClick={() => fileInputRef.current?.click()}
                                className="aspect-square rounded-xl border-2 border-dashed border-white/15 hover:border-[#fbbe15]/40 transition-colors flex flex-col items-center justify-center gap-2 bg-white/2">
                          <Upload size={22} className="text-zinc-500"/>
                          <span className="text-[11px] text-zinc-500 font-medium">{form.photos.length}/10</span>
                        </button>
                    )}
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#fbbe15]/10 flex items-center justify-center">
                      <Clock size={20} className="text-[#fbbe15]"/>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Opening Hours</h2>
                      <p className="text-sm text-zinc-400">Leave blank for days you&apos;re closed</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {DAYS.map((day) => (
                        <div key={day} className="flex items-center gap-4">
                          <span className="w-24 text-sm font-semibold text-zinc-300 capitalize">{day}</span>
                          <input type="text" value={form.openingHours[day] || ""}
                                 onChange={(e) => setHour(day, e.target.value)} placeholder="e.g. 9am-9pm"
                                 className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-zinc-600 outline-none focus:border-[#fbbe15]/50 transition-all"/>
                        </div>
                    ))}
                  </div>
                </div>

                {/* Review Summary */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#fbbe15]/10 flex items-center justify-center">
                      <div className='flex justify-center'>
                        <Image
                            src='/images/localBuka_logo.png'
                            alt='LocalBuka'
                            width={24}
                            height={24}
                            className='w-10 h-10 object-contain rounded-full'
                        />
                      </div>
                    </div>
                    <h2 className="text-lg font-bold text-white">Review &amp; Submit</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1"><span className="text-zinc-500">Name</span><p
                        className="text-white font-medium">{form.name || "—"}</p></div>
                    <div className="space-y-1"><span className="text-zinc-500">Address</span><p
                        className="text-white font-medium">{form.address || "—"}</p></div>
                    <div className="space-y-1"><span className="text-zinc-500">City</span><p
                        className="text-white font-medium">{form.city || "—"}</p></div>
                    <div className="space-y-1"><span className="text-zinc-500">Cuisine</span><p
                        className="text-white font-medium">{selectedCuisines.length > 0 ? selectedCuisines.join(", ") : form.cuisine || "—"}</p>
                    </div>
                    <div className="space-y-1"><span className="text-zinc-500">Price</span><p
                        className="text-white font-medium">{PRICE_LEVELS.find((p) => p.value === form.priceLevel)?.label} — {PRICE_LEVELS.find((p) => p.value === form.priceLevel)?.desc}</p>
                    </div>
                    <div className="space-y-1"><span className="text-zinc-500">Photos</span><p
                        className="text-white font-medium">{form.photos.length} uploaded</p></div>
                  </div>
                  <div className="pt-3 border-t border-white/5">
                    <div className="flex items-start gap-3 text-xs text-zinc-500">
                      <Info size={14} className="mt-0.5 shrink-0"/>
                      <p>By submitting, you agree that your listing may appear publicly on LocalBuka. It will be
                        reviewed by our team before being published.</p>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button onClick={handleSubmit} disabled={createMutation.isPending}
                        className="w-full py-4 bg-[#fbbe15] text-[#1a1a1a] font-bold text-base rounded-xl hover:bg-[#e5ac10] transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed">
                  {createMutation.isPending ? (<><Loader2 size={18}
                                                          className="animate-spin"/> Submitting...</>) : (<>Submit
                    Restaurant <Check size={18}/></>)}
                </button>
              </div>
          )}

          {/* ═══════════════ STEP 4 — SUCCESS ═══════════════ */}
          {step === 4 && (
              <div
                  className="flex flex-col items-center justify-center text-center py-16 animate-in fade-in zoom-in-95 duration-500">
                <div className="relative w-48 h-48 mb-10 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-[#fbbe15]/5 animate-ping"
                       style={{animationDuration: "2s"}}/>
                  <div className="absolute inset-4 rounded-full bg-[#fbbe15]/10"/>
                  <div className="absolute inset-10 rounded-full bg-[#fbbe15]/15 flex items-center justify-center">
                    <span className="text-6xl">🎉</span>
                  </div>
            </div>
                <h1 className="text-3xl font-bold text-white mb-3">Restaurant Submitted!</h1>
                {/*<p className="text-zinc-400 text-base max-w-md mb-10 leading-relaxed">Our team is reviewing your*/}
                {/*  listing. You&apos;ll be notified once it&apos;s approved and published.</p>*/}
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                  <button onClick={() => router.push("/buka/my-restaurant")}
                          className="flex-1 py-3.5 bg-[#fbbe15] text-[#1a1a1a] font-bold rounded-xl hover:bg-[#e5ac10] transition-all">My
                    Restaurants
                  </button>
                  <button onClick={() => router.push("/buka")}
                          className="flex-1 py-3.5 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all">Explore
                    Buka
                  </button>
                </div>
              </div>
          )}
        </div>
      </MainLayout>
  );
}

'use client';

import {useRef, useState} from 'react';
import {MainLayout} from '@/components/layout/MainLayout';
import {useAuth} from '@/context/AuthContext';
import {
  useDeleteRestaurant,
  useMyRestaurants,
  useRemoveSavedRestaurant,
  useSavedRestaurants,
  useUpdateRestaurant,
} from '@/lib/api/services/restaurants.hooks';
import {useToast} from '@/hooks/use-toast';
import type {Restaurant} from '@/lib/api/services/restaurants.service';
import {sortByLatest} from '@/lib/utils';
import {RESTAURANT_PLACEHOLDER_IMG} from '@/lib/constants';
import {
  Check,
  ChefHat,
  Clock,
  DollarSign,
  Eye,
  Globe,
  ImagePlus,
  Info,
  Loader2,
  MapPin,
  MoreVertical,
  Pencil,
  Phone,
  Plus,
  Star,
  Store,
  Bookmark,
  BookmarkX,
  Trash2,
  Upload,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// ── Shared constants ──
const PRICE_LABELS: Record<number, string> = {
  1: '₦',
  2: '₦₦',
  3: '₦₦₦',
  4: '₦₦₦₦',
};

const PRICE_LEVELS = [
  {value: 1, label: '₦', desc: 'Budget friendly'},
  {value: 2, label: '₦₦', desc: 'Moderate'},
  {value: 3, label: '₦₦₦', desc: 'Upscale'},
  {value: 4, label: '₦₦₦₦', desc: 'Fine dining'},
];

const POPULAR_CUISINES = [
  'Nigerian',
  'Yoruba',
  'Igbo',
  'Hausa',
  'Calabar',
  'Edo',
  'Ghanaian',
  'Senegalese',
  'Ethiopian',
  'Kenyan',
  'Fast Food',
  'Chinese',
  'Indian',
  'Italian',
  'Mexican',
  'Continental',
  'Seafood',
  'Grills & BBQ',
  'Pastries & Bakery',
];

const DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const INPUT_CLASS =
  'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#fbbe15]/50 focus:ring-1 focus:ring-[#fbbe15]/20 transition-all placeholder:text-zinc-600';

// ── Collapsible section wrapper (extracted to file-level to avoid react-hooks/static-components) ──
function AccordionSection({
  icon: Icon,
  title,
  subtitle,
  isOpen,
  onToggle,
  children,
}: {
  icon: any;
  title: string;
  subtitle: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className='bg-white/5 border border-white/10 rounded-2xl overflow-hidden'>
      <button
        onClick={onToggle}
        className='w-full px-5 py-4 flex items-center gap-3 hover:bg-white/2 transition-colors'>
        <div className='w-9 h-9 rounded-xl bg-[#fbbe15]/10 flex items-center justify-center shrink-0'>
          <Icon size={18} className='text-[#fbbe15]' />
        </div>
        <div className='flex-1 text-left'>
          <span className='text-sm font-bold text-white block leading-tight'>
            {title}
          </span>
          <span className='text-xs text-zinc-500'>{subtitle}</span>
        </div>
        <div
          className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <svg
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'>
            <polyline points='6 9 12 15 18 9' />
          </svg>
        </div>
      </button>
      {isOpen && <div className='px-5 pb-5 space-y-4'>{children}</div>}
    </div>
  );
}

// ── Edit Modal ──
interface EditModalProps {
  restaurant: Restaurant;
  onClose: () => void;
  onSaved: () => void;
}

function EditModal({restaurant, onClose, onSaved}: EditModalProps) {
  const {toast} = useToast();
  const updateMutation = useUpdateRestaurant();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Text fields ──
  const [name, setName] = useState(restaurant.name || '');
  const [description, setDescription] = useState(restaurant.description || '');
  const [address, setAddress] = useState(restaurant.address || '');
  const [city, setCity] = useState(restaurant.city || '');
  const [state, setState] = useState(restaurant.state || '');
  const [country, setCountry] = useState(restaurant.country || '');
  const [lat, setLat] = useState(
    restaurant.lat != null ? String(restaurant.lat) : '',
  );
  const [lng, setLng] = useState(
    restaurant.lng != null ? String(restaurant.lng) : '',
  );
  const [phone, setPhone] = useState(restaurant.phone || '');
  const [website, setWebsite] = useState(restaurant.website || '');
  const [priceLevel, setPriceLevel] = useState(restaurant.priceLevel || 2);
  const [isClaimedByOwner, setIsClaimedByOwner] = useState(
    restaurant.isClaimedByOwner ?? true,
  );

  // ── Cuisine ──
  const existingCuisines = restaurant.cuisine
    ? restaurant.cuisine
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean)
    : [];
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(
    existingCuisines.filter((c) => POPULAR_CUISINES.includes(c)),
  );
  const [customCuisine, setCustomCuisine] = useState(
    existingCuisines.filter((c) => !POPULAR_CUISINES.includes(c)).join(', '),
  );

  const toggleCuisine = (c: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  };

  // ── Photos ──
  const [existingPhotos, setExistingPhotos] = useState<string[]>(
    restaurant.photos || [],
  );
  const [removedPhotos, setRemovedPhotos] = useState<string[]>([]);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [newPhotoUrls, setNewPhotoUrls] = useState<string[]>([]);

  const totalPhotos = existingPhotos.length + newPhotos.length;

  const removeExistingPhoto = (idx: number) => {
    const url = existingPhotos[idx];
    setRemovedPhotos((prev) => [...prev, url]);
    setExistingPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeNewPhoto = (idx: number) => {
    URL.revokeObjectURL(newPhotoUrls[idx]);
    setNewPhotos((prev) => prev.filter((_, i) => i !== idx));
    setNewPhotoUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (totalPhotos + files.length > 10) {
      toast({
        title: 'Limit reached',
        description: 'Maximum 10 photos allowed.',
        variant: 'destructive',
      });
      return;
    }
    setNewPhotos((prev) => [...prev, ...files]);
    setNewPhotoUrls((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
    // Reset input so re-selecting same file works
    e.target.value = '';
  };

  // ── Opening Hours ──
  const [openingHours, setOpeningHours] = useState<Record<string, string>>(
    () => {
      const existing = restaurant.openingHours || {};
      const hours: Record<string, string> = {};
      DAYS.forEach((day) => {
        hours[day] = existing[day] || '';
      });
      return hours;
    },
  );

  const setHour = (day: string, value: string) => {
    setOpeningHours((prev) => ({...prev, [day]: value}));
  };

  // ── Collapsible sections ──
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basic: true,
    location: false,
    contact: false,
    cuisine: false,
    price: false,
    photos: false,
    hours: false,
    ownership: false,
  });
  const toggle = (key: string) =>
    setOpenSections((prev) => ({...prev, [key]: !prev[key]}));

  // ── Save ──
  const handleSave = async () => {
    if (!restaurant.id) return;

    const formData = new FormData();
    if (name.trim()) formData.append('name', name.trim());
    if (description.trim()) formData.append('description', description.trim());
    if (address.trim()) formData.append('address', address.trim());
    if (city.trim()) formData.append('city', city.trim());
    if (state.trim()) formData.append('state', state.trim());
    if (country.trim()) formData.append('country', country.trim());
    if (lat.trim()) formData.append('lat', lat.trim());
    if (lng.trim()) formData.append('lng', lng.trim());
    if (phone.trim()) formData.append('phone', phone.trim());
    if (website.trim()) formData.append('website', website.trim());

    // Cuisine: merge selected chips + custom
    const cuisineStr = [
      ...selectedCuisines,
      ...customCuisine
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean),
    ].join(',');
    if (cuisineStr) formData.append('cuisine', cuisineStr);

    formData.append('priceLevel', String(priceLevel));
    formData.append('isClaimedByOwner', String(isClaimedByOwner));

    // Opening hours as JSON
    const filteredHours = Object.fromEntries(
      Object.entries(openingHours).filter(([, v]) => v.trim() !== ''),
    );
    if (Object.keys(filteredHours).length > 0) {
      formData.append('openingHours', JSON.stringify(filteredHours));
    }

    // Removed photos
    if (removedPhotos.length > 0) {
      formData.append('removedPhotos', JSON.stringify(removedPhotos));
    }

    // New photos
    newPhotos.forEach((photo) => formData.append('photos', photo));

    try {
      await updateMutation.mutateAsync({id: restaurant.id, data: formData});
      toast({
        title: 'Updated!',
        description: 'Restaurant updated successfully.',
      });
      onSaved();
      onClose();
    } catch (e: any) {
      toast({
        title: 'Update failed',
        description: e.response?.data?.message || 'Something went wrong.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className='fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
      <div className='w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#1e1e1e] border border-white/10 rounded-2xl shadow-2xl scrollbar-hide'>
        {/* Header */}
        <div className='sticky top-0 bg-[#1e1e1e] border-b border-white/10 px-6 py-4 flex items-center justify-between z-10'>
          <h2 className='text-xl font-bold text-white'>Edit Restaurant</h2>
          <button
            onClick={onClose}
            className='w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors'>
            <X size={18} className='text-zinc-400' />
          </button>
        </div>

        <div className='p-5 space-y-3'>
          {/* ── Basic Info ── */}
          <AccordionSection
            icon={Store}
            title='Basic Information'
            subtitle='Name & description'
            isOpen={openSections.basic}
            onToggle={() => toggle('basic')}>
            <div>
              <label className='block text-sm font-semibold text-zinc-300 mb-2'>
                Restaurant Name
              </label>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className='block text-sm font-semibold text-zinc-300 mb-2'>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={`${INPUT_CLASS} resize-none`}
              />
            </div>
          </AccordionSection>

          {/* ── Location ── */}
          <AccordionSection
            icon={MapPin}
            title='Location'
            subtitle='Address & coordinates'
            isOpen={openSections.location}
            onToggle={() => toggle('location')}>
            <div>
              <label className='block text-sm font-semibold text-zinc-300 mb-2'>
                Street Address
              </label>
              <input
                type='text'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
            <div className='grid grid-cols-3 gap-3'>
              <div>
                <label className='block text-sm font-semibold text-zinc-300 mb-2'>
                  City
                </label>
                <input
                  type='text'
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-zinc-300 mb-2'>
                  State
                </label>
                <input
                  type='text'
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-zinc-300 mb-2'>
                  Country
                </label>
                <input
                  type='text'
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className='block text-sm font-semibold text-zinc-300 mb-2'>
                  Latitude <span className='text-zinc-600'>(optional)</span>
                </label>
                <input
                  type='text'
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  placeholder='6.5244'
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-zinc-300 mb-2'>
                  Longitude <span className='text-zinc-600'>(optional)</span>
                </label>
                <input
                  type='text'
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  placeholder='3.3792'
                  className={INPUT_CLASS}
                />
              </div>
            </div>
          </AccordionSection>

          {/* ── Contact ── */}
          <AccordionSection
            icon={Phone}
            title='Contact & Links'
            subtitle='Phone & website'
            isOpen={openSections.contact}
            onToggle={() => toggle('contact')}>
            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className='block text-sm font-semibold text-zinc-300 mb-2'>
                  Phone
                </label>
                <div className='relative'>
                  <Phone
                    size={16}
                    className='absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500'
                  />
                  <input
                    type='tel'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder='+234 800 123 4567'
                    className={`${INPUT_CLASS} pl-11`}
                  />
                </div>
              </div>
              <div>
                <label className='block text-sm font-semibold text-zinc-300 mb-2'>
                  Website
                </label>
                <div className='relative'>
                  <Globe
                    size={16}
                    className='absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500'
                  />
                  <input
                    type='url'
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder='https://yoursite.com'
                    className={`${INPUT_CLASS} pl-11`}
                  />
                </div>
              </div>
            </div>
          </AccordionSection>

          {/* ── Cuisine ── */}
          <AccordionSection
            icon={ChefHat}
            title='Cuisine Type'
            subtitle='Select or type cuisines'
            isOpen={openSections.cuisine}
            onToggle={() => toggle('cuisine')}>
            <div className='flex flex-wrap gap-2'>
              {POPULAR_CUISINES.map((c) => (
                <button
                  key={c}
                  onClick={() => toggleCuisine(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    selectedCuisines.includes(c)
                      ? 'bg-[#fbbe15] text-[#1a1a1a] border-[#fbbe15]'
                      : 'bg-white/5 text-zinc-300 border-white/10 hover:border-white/25'
                  }`}>
                  {selectedCuisines.includes(c) && (
                    <Check size={12} className='inline mr-1 -mt-0.5' />
                  )}
                  {c}
                </button>
              ))}
            </div>
            <div>
              <label className='block text-xs text-zinc-500 mb-2'>
                Or type custom cuisines (comma-separated)
              </label>
              <input
                type='text'
                value={customCuisine}
                onChange={(e) => setCustomCuisine(e.target.value)}
                placeholder='e.g. Suya, Pepper Soup'
                className={INPUT_CLASS}
              />
            </div>
          </AccordionSection>

          {/* ── Price Level ── */}
          <AccordionSection
            icon={DollarSign}
            title='Price Level'
            subtitle='How pricy is the experience?'
            isOpen={openSections.price}
            onToggle={() => toggle('price')}>
            <div className='grid grid-cols-4 gap-3'>
              {PRICE_LEVELS.map((pl) => (
                <button
                  key={pl.value}
                  onClick={() => setPriceLevel(pl.value)}
                  className={`flex flex-col items-center gap-1 py-3 rounded-xl border transition-all ${
                    priceLevel === pl.value
                      ? 'bg-[#fbbe15]/10 border-[#fbbe15] text-[#fbbe15]'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/25'
                  }`}>
                  <span className='text-lg font-bold'>{pl.label}</span>
                  <span className='text-[10px] font-medium opacity-70'>
                    {pl.desc}
                  </span>
                </button>
              ))}
            </div>
          </AccordionSection>

          {/* ── Photos ── */}
          <AccordionSection
            icon={ImagePlus}
            title='Photos'
            subtitle={`${totalPhotos}/10 uploaded`}
            isOpen={openSections.photos}
            onToggle={() => toggle('photos')}>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              multiple
              onChange={handlePhotoSelect}
              className='hidden'
            />

            <div className='grid grid-cols-3 sm:grid-cols-4 gap-3'>
              {/* Existing photos */}
              {existingPhotos.map((url, i) => (
                <div
                  key={`existing-${i}`}
                  className='relative aspect-square rounded-xl overflow-hidden group'>
                  <Image
                    src={url}
                    alt={`Photo ${i + 1}`}
                    fill
                    className='object-cover'
                    sizes='150px'
                  />
                  <button
                    onClick={() => removeExistingPhoto(i)}
                    className='absolute top-1.5 right-1.5 w-6 h-6 bg-red-600/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                    <X size={14} className='text-white' />
                  </button>
                </div>
              ))}

              {/* New photos */}
              {newPhotoUrls.map((url, i) => (
                <div
                  key={`new-${i}`}
                  className='relative aspect-square rounded-xl overflow-hidden group ring-2 ring-[#fbbe15]/30'>
                  <Image
                    src={url}
                    alt={`New photo ${i + 1}`}
                    fill
                    className='object-cover'
                    sizes='150px'
                  />
                  <div className='absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-[#fbbe15] rounded text-[9px] font-bold text-[#1a1a1a]'>
                    NEW
                  </div>
                  <button
                    onClick={() => removeNewPhoto(i)}
                    className='absolute top-1.5 right-1.5 w-6 h-6 bg-red-600/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                    <X size={14} className='text-white' />
                  </button>
                </div>
              ))}

              {/* Add button */}
              {totalPhotos < 10 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className='aspect-square rounded-xl border-2 border-dashed border-white/15 hover:border-[#fbbe15]/40 transition-colors flex flex-col items-center justify-center gap-2 bg-white/2'>
                  <Upload size={20} className='text-zinc-500' />
                  <span className='text-[11px] text-zinc-500 font-medium'>
                    Add
                  </span>
                </button>
              )}
            </div>

            {removedPhotos.length > 0 && (
              <p className='text-xs text-zinc-500'>
                {removedPhotos.length} photo
                {removedPhotos.length !== 1 ? 's' : ''} will be removed on save
              </p>
            )}
          </AccordionSection>

          {/* ── Opening Hours ── */}
          <AccordionSection
            icon={Clock}
            title='Opening Hours'
            subtitle='Leave blank for closed days'
            isOpen={openSections.hours}
            onToggle={() => toggle('hours')}>
            <div className='space-y-2.5'>
              {DAYS.map((day) => (
                <div key={day} className='flex items-center gap-3'>
                  <span className='w-20 text-sm font-semibold text-zinc-300 capitalize'>
                    {day}
                  </span>
                  <input
                    type='text'
                    value={openingHours[day] || ''}
                    onChange={(e) => setHour(day, e.target.value)}
                    placeholder='e.g. 9am-9pm'
                    className='flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-zinc-600 outline-none focus:border-[#fbbe15]/50 transition-all'
                  />
                </div>
              ))}
            </div>
          </AccordionSection>

          {/* ── Ownership ── */}
          <AccordionSection
            icon={Info}
            title='Ownership'
            subtitle='Claim this listing'
            isOpen={openSections.ownership}
            onToggle={() => toggle('ownership')}>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-zinc-300'>
                I own this restaurant
              </span>
              <button
                onClick={() => setIsClaimedByOwner(!isClaimedByOwner)}
                className={`relative w-12 h-6 rounded-full transition-colors ${isClaimedByOwner ? 'bg-[#fbbe15]' : 'bg-white/20'}`}>
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isClaimedByOwner ? 'translate-x-7' : 'translate-x-1'}`}
                />
              </button>
            </div>
          </AccordionSection>
        </div>

        {/* Footer */}
        <div className='sticky bottom-0 bg-[#1e1e1e] border-t border-white/10 px-6 py-4 flex gap-3'>
          <button
            onClick={onClose}
            className='flex-1 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all'>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className='flex-1 py-3 bg-[#fbbe15] text-[#1a1a1a] font-bold rounded-xl hover:bg-[#e5ac10] transition-all disabled:opacity-60 flex items-center justify-center gap-2'>
            {updateMutation.isPending ? (
              <Loader2 size={16} className='animate-spin' />
            ) : (
              <Check size={16} />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete confirm dialog ──
function DeleteDialog({
  name,
  onConfirm,
  onCancel,
  isPending,
}: {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  return (
    <div className='fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
      <div className='w-full max-w-sm bg-[#222] border border-white/10 rounded-2xl p-6 text-center'>
        <div className='w-14 h-14 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center'>
          <Trash2 size={24} className='text-red-400' />
        </div>
        <h3 className='text-lg font-bold text-white mb-2'>
          Delete Restaurant?
        </h3>
        <p className='text-sm text-zinc-400 mb-6'>
          Are you sure you want to delete{' '}
          <span className='text-white font-semibold'>&ldquo;{name}&rdquo;</span>
          ? This action cannot be undone.
        </p>
        <div className='flex gap-3'>
          <button
            onClick={onCancel}
            className='flex-1 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all'>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className='flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2'>
            {isPending ? (
              <Loader2 size={16} className='animate-spin' />
            ) : (
              <Trash2 size={16} />
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Restaurant Card ──
function RestaurantCard({
  restaurant,
  onEdit,
  onDelete,
}: {
  restaurant: Restaurant;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const coverPhoto =
    restaurant.photos && restaurant.photos.length > 0
      ? restaurant.photos[0]
      : RESTAURANT_PLACEHOLDER_IMG;
  const hours = restaurant.openingHours;
  const priceLabel = restaurant.priceLevel
    ? PRICE_LABELS[restaurant.priceLevel] || ''
    : '';

  return (
    <div className='bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/15 transition-all group'>
      {/* Cover */}
      <div className='relative h-40 bg-white/3'>
        {coverPhoto === RESTAURANT_PLACEHOLDER_IMG ? (
          <div className='w-full h-full bg-zinc-800 flex items-center justify-center'>
            <UtensilsCrossed size={48} className='text-zinc-600' />
          </div>
        ) : (
          <Image
            src={coverPhoto}
            alt={restaurant.name}
            fill
            className='object-cover'
          />
        )}
        {/* Overlay gradient */}
        <div className='absolute inset-0 bg-linear-to-t from-black/60 to-transparent' />

        {/* Action menu */}
        <div className='absolute top-3 right-3'>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className='w-8 h-8 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors'>
            <MoreVertical size={16} className='text-white' />
          </button>
          {menuOpen && (
            <>
              <div
                className='fixed inset-0 z-10'
                onClick={() => setMenuOpen(false)}
              />
              <div className='absolute top-10 right-0 z-20 bg-[#2a2a2a] border border-white/10 rounded-xl shadow-xl overflow-hidden min-w-[140px]'>
                <button
                  onClick={() => {
                    onEdit();
                    setMenuOpen(false);
                  }}
                  className='w-full px-4 py-2.5 flex items-center gap-3 text-sm text-zinc-300 hover:bg-white/5 transition-colors'>
                  <Pencil size={14} /> Edit
                </button>
                {restaurant.id && (
                  <Link
                    href={`/buka/restaurant/${restaurant.id}`}
                    className='w-full px-4 py-2.5 flex items-center gap-3 text-sm text-zinc-300 hover:bg-white/5 transition-colors'
                    onClick={() => setMenuOpen(false)}>
                    <Eye size={14} /> View
                  </Link>
                )}
                <button
                  onClick={() => {
                    onDelete();
                    setMenuOpen(false);
                  }}
                  className='w-full px-4 py-2.5 flex items-center gap-3 text-sm text-red-400 hover:bg-red-500/5 transition-colors'>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </>
          )}
        </div>

        {/* Rating badge */}
        {restaurant.avgRating > 0 && (
          <div className='absolute bottom-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg'>
            <Star size={14} className='text-[#fbbe15] fill-[#fbbe15]' />
            <span className='text-white text-xs font-bold'>
              {restaurant.avgRating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Photo count badge */}
        {restaurant.photos && restaurant.photos.length > 1 && (
          <div className='absolute bottom-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg'>
            <ImagePlus size={12} className='text-zinc-300' />
            <span className='text-zinc-300 text-xs font-medium'>
              {restaurant.photos.length}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className='p-5 space-y-3'>
        <div className='flex items-start justify-between gap-2'>
          <h3 className='text-base font-bold text-white leading-tight'>
            {restaurant.name}
          </h3>
          {priceLabel && (
            <span className='text-[#fbbe15] text-sm font-bold shrink-0'>
              {priceLabel}
            </span>
          )}
        </div>

        {restaurant.description && (
          <p className='text-sm text-zinc-400 line-clamp-2 leading-relaxed'>
            {restaurant.description}
          </p>
        )}

        <div className='flex flex-wrap gap-2'>
          {restaurant.cuisine &&
            restaurant.cuisine.split(',').map((c) => (
              <span
                key={c.trim()}
                className='px-2.5 py-1 bg-[#fbbe15]/10 text-[#fbbe15] text-xs font-medium rounded-full'>
                {c.trim()}
              </span>
            ))}
        </div>

        <div className='pt-2 border-t border-white/5 space-y-2'>
          {restaurant.address && (
            <div className='flex items-center gap-2 text-zinc-500 text-sm'>
              <MapPin size={14} className='shrink-0' />
              <span className='truncate'>
                {restaurant.address}
                {restaurant.city ? `, ${restaurant.city}` : ''}
              </span>
            </div>
          )}
          {restaurant.phone && (
            <div className='flex items-center gap-2 text-zinc-500 text-sm'>
              <Phone size={14} className='shrink-0' />
              <span>{restaurant.phone}</span>
            </div>
          )}
          {hours && Object.keys(hours).length > 0 && (
            <div className='flex items-center gap-2 text-zinc-500 text-sm'>
              <Clock size={14} className='shrink-0' />
              <span>{Object.keys(hours).length} days listed</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──
// ── Saved/Wishlist Card ──
function WishlistCard({restaurant}: {restaurant: Restaurant}) {
  const {toast} = useToast();
  const removeMutation = useRemoveSavedRestaurant();
  const coverPhoto =
    restaurant.photos && restaurant.photos.length > 0
      ? restaurant.photos[0]
      : RESTAURANT_PLACEHOLDER_IMG;
  const priceLabel = restaurant.priceLevel
    ? PRICE_LABELS[restaurant.priceLevel] || ''
    : '';

  const handleUnsave = () => {
    if (!restaurant.id) return;
    removeMutation.mutate(restaurant.id, {
      onSuccess: () =>
        toast({
          title: 'Removed',
          description: `${restaurant.name} removed from wishlist.`,
        }),
      onError: () =>
        toast({
          title: 'Error',
          description: 'Could not remove from wishlist.',
          variant: 'destructive',
        }),
    });
  };

  const displayRating =
    restaurant.avgRating > 0
      ? restaurant.avgRating
      : (restaurant.googleRating ?? 0);
  const hours = restaurant.openingHours;

  return (
    <Link
      href={restaurant.id ? `/buka/restaurant/${restaurant.id}` : '#'}
      className='block'>
      <div className='bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all group'>
        <div className='relative h-40'>
          {coverPhoto === RESTAURANT_PLACEHOLDER_IMG ? (
            <div className='w-full h-full bg-zinc-800 flex items-center justify-center'>
              <UtensilsCrossed size={40} className='text-zinc-600' />
            </div>
          ) : (
            <Image
              src={coverPhoto}
              alt={restaurant.name}
              fill
              className='object-cover'
            />
          )}
          <div className='absolute inset-0 bg-linear-to-t from-black/60 to-transparent' />
          {displayRating > 0 && (
            <div className='absolute bottom-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg'>
              <Star size={12} className='text-[#fbbe15] fill-[#fbbe15]' />
              <span className='text-white text-xs font-bold'>
                {displayRating.toFixed(1)}
              </span>
            </div>
          )}
          {restaurant.photos && restaurant.photos.length > 1 && (
            <div className='absolute bottom-3 right-12 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg'>
              <ImagePlus size={12} className='text-zinc-300' />
              <span className='text-zinc-300 text-xs font-medium'>
                {restaurant.photos.length}
              </span>
            </div>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              handleUnsave();
            }}
            disabled={removeMutation.isPending}
            className='absolute top-2 right-2 w-8 h-8 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-red-500/60 transition-colors'
            title='Remove from wishlist'>
            {removeMutation.isPending ? (
              <Loader2 size={14} className='animate-spin text-white' />
            ) : (
              <BookmarkX size={14} className='text-white' />
            )}
          </button>
        </div>
        <div className='p-5 space-y-3'>
          <div className='flex items-start justify-between gap-2'>
            <h3 className='text-base font-bold text-white leading-tight'>
              {restaurant.name}
            </h3>
            {priceLabel && (
              <span className='text-[#fbbe15] text-sm font-bold shrink-0'>
                {priceLabel}
              </span>
            )}
          </div>
          {restaurant.description && (
            <p className='text-sm text-zinc-400 line-clamp-2 leading-relaxed'>
              {restaurant.description}
            </p>
          )}
          {restaurant.cuisine && (
            <div className='flex flex-wrap gap-2'>
              {restaurant.cuisine.split(',').map((c) => (
                <span
                  key={c.trim()}
                  className='px-2.5 py-1 bg-[#fbbe15]/10 text-[#fbbe15] text-xs font-medium rounded-full'>
                  {c.trim()}
                </span>
              ))}
            </div>
          )}
          <div className='pt-2 border-t border-white/5 space-y-2'>
            {restaurant.address && (
              <div className='flex items-center gap-2 text-zinc-500 text-sm'>
                <MapPin size={14} className='shrink-0' />
                <span className='truncate'>
                  {restaurant.address}
                  {restaurant.city ? `, ${restaurant.city}` : ''}
                </span>
              </div>
            )}
            {restaurant.phone && (
              <div className='flex items-center gap-2 text-zinc-500 text-sm'>
                <Phone size={14} className='shrink-0' />
                <span>{restaurant.phone}</span>
              </div>
            )}
            {hours && Object.keys(hours).length > 0 && (
              <div className='flex items-center gap-2 text-zinc-500 text-sm'>
                <Clock size={14} className='shrink-0' />
                <span>{Object.keys(hours).length} days listed</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function MyRestaurantPage() {
  const {toast} = useToast();
  const {isAuthenticated, openAuthModal} = useAuth();
  const {data: myData, isLoading, refetch} = useMyRestaurants();
  const {data: savedData, isLoading: isLoadingSaved} = useSavedRestaurants();
  const deleteMutation = useDeleteRestaurant();

  const [showWishlist, setShowWishlist] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(
    null,
  );
  const [deletingRestaurant, setDeletingRestaurant] =
    useState<Restaurant | null>(null);

  // Extract saved restaurants
  // API shape: { data: [ { id, savedAt, restaurant: {...} } ], total }
  const savedRestaurants: Restaurant[] = (() => {
    if (!savedData) return [];
    const d = savedData as any;
    const list: any[] = Array.isArray(d.data)
      ? d.data
      : Array.isArray(d)
        ? d
        : [];
    return list.map((item: any) => item.restaurant || item).filter(Boolean);
  })();

  // Extract restaurants array from response, sorted by latest updatedAt
  const restaurants: Restaurant[] = (() => {
    if (!myData) return [];
    const d = myData as any;
    let list: Restaurant[] = [];
    if (Array.isArray(d.data)) list = d.data;
    else if (Array.isArray(d)) list = d;
    return sortByLatest(list, 'updatedAt');
  })();

  const handleDelete = async () => {
    if (!deletingRestaurant?.id) return;
    try {
      await deleteMutation.mutateAsync(deletingRestaurant.id);
      toast({title: 'Deleted', description: 'Restaurant has been removed.'});
      setDeletingRestaurant(null);
      refetch();
    } catch (e: any) {
      toast({
        title: 'Delete failed',
        description: e.response?.data?.message || 'Something went wrong.',
        variant: 'destructive',
      });
    }
  };

  // Auth gate
  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className='w-full max-w-2xl mx-auto px-4 py-20 text-center'>
          <div className='w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center'>
            <Store size={32} className='text-zinc-600' />
          </div>
          <h1 className='text-2xl font-bold text-white mb-3'>
            Sign in to manage restaurants
          </h1>
          <p className='text-zinc-400 mb-8 max-w-md mx-auto'>
            You need to be logged in to list and manage your restaurants on
            LocalBuka.
          </p>
          <button
            onClick={() => openAuthModal()}
            className='px-8 py-3.5 bg-[#fbbe15] text-[#1a1a1a] font-bold rounded-xl hover:bg-[#e5ac10] transition-all'>
            Sign In
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className='w-full max-w-4xl mx-auto px-4 py-6 overflow-y-auto h-[calc(100vh-3.5rem)] md:h-auto scrollbar-hide'>
        {/* Header */}
        <div className='mb-8'>
          {/*<button*/}
          {/*  onClick={() => router.push("/buka")}*/}
          {/*  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6 group"*/}
          {/*>*/}
          {/*  <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />*/}
          {/*  <span className="text-sm font-medium">Back to Buka</span>*/}
          {/*</button>*/}

          <div className='flex items-center justify-between flex-wrap gap-4'>
            <div>
              <h1 className='text-2xl md:text-3xl font-bold text-white'>
                My Restaurants
              </h1>
              <p className='text-zinc-400 text-sm mt-1'>
                {showWishlist
                  ? 'Your saved restaurant wishlist'
                  : 'Manage your restaurant listings'}
              </p>
            </div>
            <div className='flex items-center gap-3'>
              {/* Wishlist toggle */}
              <button
                onClick={() => setShowWishlist(!showWishlist)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  showWishlist
                    ? 'bg-[#fbbe15]/10 border-[#fbbe15] text-[#fbbe15]'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/25 hover:text-white'
                }`}>
                <Bookmark
                  size={16}
                  className={showWishlist ? 'fill-[#fbbe15]' : ''}
                />
                Wishlist
                {savedRestaurants.length > 0 && (
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                      showWishlist
                        ? 'bg-[#fbbe15] text-[#1a1a1a]'
                        : 'bg-white/10 text-zinc-400'
                    }`}>
                    {savedRestaurants.length}
                  </span>
                )}
              </button>
              {!showWishlist && (
                <Link
                  href='/buka/list-resturant'
                  className='flex items-center gap-2 px-5 py-3 bg-[#fbbe15] text-[#1a1a1a] font-bold text-sm rounded-xl hover:bg-[#e5ac10] transition-all active:scale-[0.98]'>
                  <Plus size={18} />
                  List New
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {showWishlist ? (
          /* Wishlist View */
          isLoadingSaved ? (
            <div className='flex items-center justify-center py-20'>
              <Loader2 size={28} className='animate-spin text-[#fbbe15]' />
            </div>
          ) : savedRestaurants.length === 0 ? (
            <div className='text-center py-20'>
              <div className='w-24 h-24 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center'>
                <Bookmark size={36} className='text-zinc-600' />
              </div>
              <h2 className='text-xl font-bold text-white mb-2'>
                No saved restaurants
              </h2>
              <p className='text-zinc-400 text-sm mb-8 max-w-sm mx-auto'>
                Save restaurants you love to revisit them here anytime.
              </p>
              <Link
                href='/buka'
                className='inline-flex items-center gap-2 px-8 py-3.5 bg-[#fbbe15] text-[#1a1a1a] font-bold rounded-xl hover:bg-[#e5ac10] transition-all'>
                Explore Restaurants
              </Link>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
              {savedRestaurants.map((r) => (
                <WishlistCard key={r.id || r.name} restaurant={r} />
              ))}
            </div>
          )
        ) : /* My Restaurants View */
        isLoading ? (
          <div className='flex items-center justify-center py-20'>
            <Loader2 size={28} className='animate-spin text-[#fbbe15]' />
          </div>
        ) : restaurants.length === 0 ? (
          <div className='text-center py-20'>
            <div className='w-24 h-24 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center'>
              <Store size={36} className='text-zinc-600' />
            </div>
            <h2 className='text-xl font-bold text-white mb-2'>
              No restaurants yet
            </h2>
            <p className='text-zinc-400 text-sm mb-8 max-w-sm mx-auto'>
              Get started by listing your first restaurant. It takes less than 5
              minutes.
            </p>
            <Link
              href='/buka/list-resturant'
              className='inline-flex items-center gap-2 px-8 py-3.5 bg-[#fbbe15] text-[#1a1a1a] font-bold rounded-xl hover:bg-[#e5ac10] transition-all'>
              <Plus size={18} />
              List Your Restaurant
            </Link>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            {restaurants.map((r) => (
              <RestaurantCard
                key={r.id || r.name}
                restaurant={r}
                onEdit={() => setEditingRestaurant(r)}
                onDelete={() => setDeletingRestaurant(r)}
              />
            ))}
          </div>
        )}

        {/* Stats bar */}
        {!showWishlist && restaurants.length > 0 && (
          <div className='mt-8 flex items-center gap-6 bg-white/5 border border-white/10 rounded-xl p-4'>
            <div className='flex items-center gap-2'>
              <Store size={16} className='text-[#fbbe15]' />
              <span className='text-sm text-zinc-300'>
                <span className='font-bold text-white'>
                  {restaurants.length}
                </span>{' '}
                restaurant{restaurants.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <Star size={16} className='text-[#fbbe15]' />
              <span className='text-sm text-zinc-300'>
                <span className='font-bold text-white'>
                  {restaurants.reduce((sum, r) => sum + r.reviewCount, 0)}
                </span>{' '}
                total reviews
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {editingRestaurant && (
        <EditModal
          restaurant={editingRestaurant}
          onClose={() => setEditingRestaurant(null)}
          onSaved={() => refetch()}
        />
      )}

      {deletingRestaurant && (
        <DeleteDialog
          name={deletingRestaurant.name}
          onConfirm={handleDelete}
          onCancel={() => setDeletingRestaurant(null)}
          isPending={deleteMutation.isPending}
        />
      )}
    </MainLayout>
  );
}

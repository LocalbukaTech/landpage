'use client';

import { useState } from 'react';
import {
  Building2,
  ExternalLink,
  ImagePlus,
  Loader2,
  Phone,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  DEFAULT_ABOUT_US_CONTENT,
  DEFAULT_CONTACT_INFO_CONTENT,
  type AboutUsContent,
  type ContactInfoContent,
  type CoreValueItem,
} from '@/lib/api/services/contact.service';
import {
  useSiteSettingsQuery,
  useUpdateSiteSettingsMutation,
} from '@/lib/api/services/contact.hooks';
import apiClient from '@/lib/api/client';

type EditorSubTab = 'about' | 'contact-info';

export function AboutUsContactEditor() {
  const { data: settingsResponse, isLoading } = useSiteSettingsQuery();
  const updateMutation = useUpdateSiteSettingsMutation();

  const [subTab, setSubTab] = useState<EditorSubTab>('about');
  const [aboutDraft, setAboutDraft] = useState<AboutUsContent | null>(null);
  const [contactDraft, setContactDraft] = useState<ContactInfoContent | null>(
    null
  );
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [statusFeedback, setStatusFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const serverAbout: AboutUsContent = {
    ...DEFAULT_ABOUT_US_CONTENT,
    ...(settingsResponse?.data?.aboutUs ?? {}),
    coreValues:
      settingsResponse?.data?.aboutUs?.coreValues &&
      settingsResponse.data.aboutUs.coreValues.length > 0
        ? settingsResponse.data.aboutUs.coreValues
        : DEFAULT_ABOUT_US_CONTENT.coreValues,
  };

  const serverContact: ContactInfoContent = {
    ...DEFAULT_CONTACT_INFO_CONTENT,
    ...(settingsResponse?.data?.contactInfo ?? {}),
  };

  const about = aboutDraft ?? serverAbout;
  const contactInfo = contactDraft ?? serverContact;
  const updatedAt = settingsResponse?.data?.updatedAt;

  const patchAbout = (updates: Partial<AboutUsContent>) => {
    setStatusFeedback(null);
    setAboutDraft({ ...about, ...updates });
  };

  const patchContact = (updates: Partial<ContactInfoContent>) => {
    setStatusFeedback(null);
    setContactDraft({ ...contactInfo, ...updates });
  };

  const handleCoreValueChange = (
    index: number,
    field: keyof CoreValueItem,
    value: string
  ) => {
    const nextValues = about.coreValues.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    patchAbout({ coreValues: nextValues });
  };

  const handleAddCoreValue = () => {
    if (about.coreValues.length >= 12) return;
    patchAbout({
      coreValues: [
        ...about.coreValues,
        { title: '', description: '' },
      ],
    });
  };

  const handleRemoveCoreValue = (index: number) => {
    if (about.coreValues.length <= 1) return;
    patchAbout({
      coreValues: about.coreValues.filter((_, i) => i !== index),
    });
  };

  const handleImageUpload = async (
    file: File,
    target: 'about-hero' | 'about-story' | 'contact-hero'
  ) => {
    setUploadingField(target);
    setStatusFeedback(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await apiClient.post<any>('/images/upload', formData);
      const payload = res?.data;
      const url =
        payload?.secure_url ||
        payload?.url ||
        payload?.data?.secure_url ||
        payload?.data?.url;

      if (typeof url === 'string' && url.startsWith('http')) {
        const httpsUrl = url.replace(/^http:\/\//i, 'https://');
        if (target === 'about-hero') patchAbout({ heroImageUrl: httpsUrl });
        if (target === 'about-story') patchAbout({ storyImageUrl: httpsUrl });
        if (target === 'contact-hero') patchContact({ heroImageUrl: httpsUrl });
        setStatusFeedback({
          type: 'success',
          message: 'Image uploaded. Click "Save Changes" to publish it live.',
        });
      } else {
        throw new Error('Upload succeeded without a valid image URL.');
      }
    } catch (err: any) {
      setStatusFeedback({
        type: 'error',
        message:
          err?.response?.data?.message ||
          err?.message ||
          'Failed to upload image. Please try again.',
      });
    } finally {
      setUploadingField(null);
    }
  };

  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusFeedback(null);
    const cleanedValues = about.coreValues
      .map((v) => ({
        title: v.title.trim(),
        description: v.description.trim(),
      }))
      .filter((v) => v.title && v.description);

    if (cleanedValues.length === 0) {
      setStatusFeedback({
        type: 'error',
        message: 'Add at least one core value with both a title and description.',
      });
      return;
    }

    updateMutation.mutate(
      { aboutUs: { ...about, coreValues: cleanedValues } },
      {
        onSuccess: () => {
          setAboutDraft(null);
          setStatusFeedback({
            type: 'success',
            message: 'About Us content saved and published to /about.',
          });
        },
        onError: (err: any) => {
          setStatusFeedback({
            type: 'error',
            message:
              err?.response?.data?.message ||
              'Failed to save About Us changes. Please check your entries.',
          });
        },
      }
    );
  };

  const handleSaveContactInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusFeedback(null);
    updateMutation.mutate(
      { contactInfo },
      {
        onSuccess: () => {
          setContactDraft(null);
          setStatusFeedback({
            type: 'success',
            message: 'Contact Info saved and published to /contact.',
          });
        },
        onError: (err: any) => {
          setStatusFeedback({
            type: 'error',
            message:
              err?.response?.data?.message ||
              'Failed to save Contact Info changes. Please check email formats.',
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground text-sm gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-[#fbbe15]" />
        <span>Loading About Us &amp; Contact Info settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sub-navigation + Live Preview Links */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSubTab('about');
              setStatusFeedback(null);
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              subTab === 'about'
                ? 'bg-[#1a1a1a] text-white dark:bg-[#fbbe15] dark:text-[#1a1a1a]'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-foreground'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>About Us Page Content</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSubTab('contact-info');
              setStatusFeedback(null);
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              subTab === 'contact-info'
                ? 'bg-[#1a1a1a] text-white dark:bg-[#fbbe15] dark:text-[#1a1a1a]'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-foreground'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Public Contact Channels</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {updatedAt && (
            <span className="text-muted-foreground">
              Last saved:{' '}
              {new Date(updatedAt).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </span>
          )}
          <a
            href="/about"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 font-semibold text-foreground hover:border-[#fbbe15] transition-colors"
          >
            <span>Preview /about</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#fbbe15]" />
          </a>
          <a
            href="/contact"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 font-semibold text-foreground hover:border-[#fbbe15] transition-colors"
          >
            <span>Preview /contact</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#fbbe15]" />
          </a>
        </div>
      </div>

      {/* Live Status Banner */}
      {statusFeedback && (
        <div
          role={statusFeedback.type === 'error' ? 'alert' : 'status'}
          aria-live="polite"
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-medium border ${
            statusFeedback.type === 'success'
              ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
              : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
          }`}
        >
          {statusFeedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusFeedback.message}</span>
        </div>
      )}

      {subTab === 'about' ? (
        <form
          onSubmit={handleSaveAbout}
          aria-labelledby="about-cms-heading"
          className="space-y-6"
        >
          <h2 id="about-cms-heading" className="sr-only">
            About Us Content Management Form
          </h2>

          {/* Section 1: Hero & Our Story */}
          <fieldset className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-5">
            <legend className="text-sm font-bold text-foreground px-1">
              Hero &amp; Our Story
            </legend>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="space-y-1.5 lg:col-span-2">
                <label
                  htmlFor="about-hero-subtitle"
                  className="block text-xs font-semibold text-foreground"
                >
                  Hero Subtitle <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id="about-hero-subtitle"
                  name="heroSubtitle"
                  rows={2}
                  required
                  value={about.heroSubtitle}
                  onChange={(e) => patchAbout({ heroSubtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-[#fbbe15]"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="about-hero-cta-text"
                  className="block text-xs font-semibold text-foreground"
                >
                  Hero CTA Button Text
                </label>
                <input
                  id="about-hero-cta-text"
                  name="heroCtaText"
                  type="text"
                  value={about.heroCtaText}
                  onChange={(e) => patchAbout({ heroCtaText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-[#fbbe15]"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="about-hero-image"
                  className="block text-xs font-semibold text-foreground"
                >
                  Hero Background Image URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="about-hero-image"
                    name="heroImageUrl"
                    type="text"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    value={about.heroImageUrl}
                    onChange={(e) =>
                      patchAbout({ heroImageUrl: e.target.value })
                    }
                    className="flex-1 px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-[#fbbe15]"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-xs font-semibold text-foreground hover:border-[#fbbe15] cursor-pointer shrink-0">
                    {uploadingField === 'about-hero' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ImagePlus className="w-4 h-4 text-[#fbbe15]" />
                    )}
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void handleImageUpload(file, 'about-hero');
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="about-story-heading"
                  className="block text-xs font-semibold text-foreground"
                >
                  Story Section Heading <span aria-hidden="true">*</span>
                </label>
                <input
                  id="about-story-heading"
                  name="storyHeading"
                  type="text"
                  required
                  value={about.storyHeading}
                  onChange={(e) => patchAbout({ storyHeading: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-[#fbbe15]"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="about-story-image"
                  className="block text-xs font-semibold text-foreground"
                >
                  Story Photo URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="about-story-image"
                    name="storyImageUrl"
                    type="text"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    value={about.storyImageUrl}
                    onChange={(e) =>
                      patchAbout({ storyImageUrl: e.target.value })
                    }
                    className="flex-1 px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-[#fbbe15]"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-xs font-semibold text-foreground hover:border-[#fbbe15] cursor-pointer shrink-0">
                    {uploadingField === 'about-story' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ImagePlus className="w-4 h-4 text-[#fbbe15]" />
                    )}
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void handleImageUpload(file, 'about-story');
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-1.5 lg:col-span-2">
                <label
                  htmlFor="about-story-p1"
                  className="block text-xs font-semibold text-foreground"
                >
                  Story Paragraph 1 <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id="about-story-p1"
                  name="storyParagraph1"
                  rows={3}
                  required
                  value={about.storyParagraph1}
                  onChange={(e) =>
                    patchAbout({ storyParagraph1: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-[#fbbe15]"
                />
              </div>

              <div className="space-y-1.5 lg:col-span-2">
                <label
                  htmlFor="about-story-p2"
                  className="block text-xs font-semibold text-foreground"
                >
                  Story Paragraph 2 <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id="about-story-p2"
                  name="storyParagraph2"
                  rows={4}
                  required
                  value={about.storyParagraph2}
                  onChange={(e) =>
                    patchAbout({ storyParagraph2: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-[#fbbe15]"
                />
              </div>
            </div>
          </fieldset>

          {/* Section 2: Mission & Vision */}
          <fieldset className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-5">
            <legend className="text-sm font-bold text-foreground px-1">
              Mission &amp; Vision
            </legend>

            <div className="space-y-1.5">
              <label
                htmlFor="about-mv-title"
                className="block text-xs font-semibold text-foreground"
              >
                Section Heading
              </label>
              <input
                id="about-mv-title"
                name="missionSectionTitle"
                type="text"
                value={about.missionSectionTitle}
                onChange={(e) =>
                  patchAbout({ missionSectionTitle: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-[#fbbe15]"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700">
                <div className="space-y-1.5">
                  <label
                    htmlFor="about-mission-heading"
                    className="block text-xs font-semibold text-foreground"
                  >
                    Mission Subheading
                  </label>
                  <input
                    id="about-mission-heading"
                    name="missionHeading"
                    type="text"
                    value={about.missionHeading}
                    onChange={(e) =>
                      patchAbout({ missionHeading: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-foreground"
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="about-mission-body"
                    className="block text-xs font-semibold text-foreground"
                  >
                    Mission Statement <span aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="about-mission-body"
                    name="missionBody"
                    rows={4}
                    required
                    value={about.missionBody}
                    onChange={(e) =>
                      patchAbout({ missionBody: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700">
                <div className="space-y-1.5">
                  <label
                    htmlFor="about-vision-heading"
                    className="block text-xs font-semibold text-foreground"
                  >
                    Vision Subheading
                  </label>
                  <input
                    id="about-vision-heading"
                    name="visionHeading"
                    type="text"
                    value={about.visionHeading}
                    onChange={(e) =>
                      patchAbout({ visionHeading: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-foreground"
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="about-vision-body"
                    className="block text-xs font-semibold text-foreground"
                  >
                    Vision Statement <span aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="about-vision-body"
                    name="visionBody"
                    rows={4}
                    required
                    value={about.visionBody}
                    onChange={(e) => patchAbout({ visionBody: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-foreground"
                  />
                </div>
              </div>
            </div>
          </fieldset>

          {/* Section 3: Core Values */}
          <fieldset className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-5">
            <legend className="text-sm font-bold text-foreground px-1">
              Core Values ({about.coreValues.length})
            </legend>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="about-values-title"
                  className="block text-xs font-semibold text-foreground"
                >
                  Values Heading
                </label>
                <input
                  id="about-values-title"
                  name="valuesSectionTitle"
                  type="text"
                  value={about.valuesSectionTitle}
                  onChange={(e) =>
                    patchAbout({ valuesSectionTitle: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="about-values-subtitle"
                  className="block text-xs font-semibold text-foreground"
                >
                  Values Subtitle
                </label>
                <input
                  id="about-values-subtitle"
                  name="valuesSectionSubtitle"
                  type="text"
                  value={about.valuesSectionSubtitle}
                  onChange={(e) =>
                    patchAbout({ valuesSectionSubtitle: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-foreground"
                />
              </div>
            </div>

            <div className="space-y-3">
              {about.coreValues.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#fbbe15]">
                      Value #{idx + 1}
                    </span>
                    {about.coreValues.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCoreValue(idx)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label
                        htmlFor={`core-value-title-${idx}`}
                        className="block text-xs font-medium text-foreground"
                      >
                        Title
                      </label>
                      <input
                        id={`core-value-title-${idx}`}
                        name={`coreValueTitle_${idx}`}
                        type="text"
                        required
                        value={item.title}
                        onChange={(e) =>
                          handleCoreValueChange(idx, 'title', e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-foreground"
                      />
                    </div>
                    <div className="space-y-1 lg:col-span-2">
                      <label
                        htmlFor={`core-value-desc-${idx}`}
                        className="block text-xs font-medium text-foreground"
                      >
                        Description
                      </label>
                      <textarea
                        id={`core-value-desc-${idx}`}
                        name={`coreValueDesc_${idx}`}
                        rows={2}
                        required
                        value={item.description}
                        onChange={(e) =>
                          handleCoreValueChange(
                            idx,
                            'description',
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-foreground"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {about.coreValues.length < 12 && (
                <button
                  type="button"
                  onClick={handleAddCoreValue}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 text-xs font-semibold text-foreground hover:border-[#fbbe15] cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#fbbe15]" />
                  <span>Add Core Value</span>
                </button>
              )}
            </div>
          </fieldset>

          {/* Section 4: Bottom CTA Banner */}
          <fieldset className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-4">
            <legend className="text-sm font-bold text-foreground px-1">
              Bottom Call-to-Action Banner
            </legend>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="about-cta-heading"
                  className="block text-xs font-semibold text-foreground"
                >
                  CTA Heading
                </label>
                <input
                  id="about-cta-heading"
                  name="ctaHeading"
                  type="text"
                  value={about.ctaHeading}
                  onChange={(e) => patchAbout({ ctaHeading: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-foreground"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="about-cta-button"
                  className="block text-xs font-semibold text-foreground"
                >
                  CTA Button Text
                </label>
                <input
                  id="about-cta-button"
                  name="ctaButtonText"
                  type="text"
                  value={about.ctaButtonText}
                  onChange={(e) =>
                    patchAbout({ ctaButtonText: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-foreground"
                />
              </div>
              <div className="space-y-1.5 lg:col-span-2">
                <label
                  htmlFor="about-cta-subtitle"
                  className="block text-xs font-semibold text-foreground"
                >
                  CTA Subtitle
                </label>
                <textarea
                  id="about-cta-subtitle"
                  name="ctaSubtitle"
                  rows={2}
                  value={about.ctaSubtitle}
                  onChange={(e) => patchAbout({ ctaSubtitle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-foreground"
                />
              </div>
            </div>
          </fieldset>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setAboutDraft({ ...DEFAULT_ABOUT_US_CONTENT });
                setStatusFeedback(null);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-semibold text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default Copy</span>
            </button>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#fbbe15] hover:bg-[#e5ad13] text-[#1a1a1a] font-bold text-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save About Us Changes</span>
            </button>
          </div>
        </form>
      ) : (
        <form
          onSubmit={handleSaveContactInfo}
          aria-labelledby="contact-info-cms-heading"
          className="space-y-6"
        >
          <h2 id="contact-info-cms-heading" className="sr-only">
            Public Contact Channels Form
          </h2>

          {/* Contact Hero */}
          <fieldset className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-4">
            <legend className="text-sm font-bold text-foreground px-1">
              Contact Page Header
            </legend>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="contact-hero-badge"
                  className="block text-xs font-semibold text-foreground"
                >
                  Badge Label
                </label>
                <input
                  id="contact-hero-badge"
                  name="heroBadge"
                  type="text"
                  value={contactInfo.heroBadge}
                  onChange={(e) => patchContact({ heroBadge: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="contact-hero-headline"
                  className="block text-xs font-semibold text-foreground"
                >
                  Hero Headline
                </label>
                <input
                  id="contact-hero-headline"
                  name="heroHeadline"
                  type="text"
                  value={contactInfo.heroHeadline}
                  onChange={(e) =>
                    patchContact({ heroHeadline: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-foreground"
                />
              </div>

              <div className="space-y-1.5 lg:col-span-2">
                <label
                  htmlFor="contact-hero-subtitle"
                  className="block text-xs font-semibold text-foreground"
                >
                  Hero Subtitle
                </label>
                <textarea
                  id="contact-hero-subtitle"
                  name="heroSubtitle"
                  rows={2}
                  value={contactInfo.heroSubtitle}
                  onChange={(e) =>
                    patchContact({ heroSubtitle: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-foreground"
                />
              </div>

              <div className="space-y-1.5 lg:col-span-2">
                <label
                  htmlFor="contact-hero-image"
                  className="block text-xs font-semibold text-foreground"
                >
                  Hero Image URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="contact-hero-image"
                    name="contactHeroImageUrl"
                    type="text"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    value={contactInfo.heroImageUrl}
                    onChange={(e) =>
                      patchContact({ heroImageUrl: e.target.value })
                    }
                    className="flex-1 px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-foreground"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-xs font-semibold text-foreground hover:border-[#fbbe15] cursor-pointer shrink-0">
                    {uploadingField === 'contact-hero' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ImagePlus className="w-4 h-4 text-[#fbbe15]" />
                    )}
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void handleImageUpload(file, 'contact-hero');
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </fieldset>

          {/* Official Emails, Phones, Location & Hours */}
          <fieldset className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-4">
            <legend className="text-sm font-bold text-foreground px-1">
              Official Support Emails, Phone Lines &amp; Office Hours
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="contact-support-email"
                  className="block text-xs font-semibold text-foreground"
                >
                  Support Email <span aria-hidden="true">*</span>
                </label>
                <input
                  id="contact-support-email"
                  name="supportEmail"
                  type="email"
                  required
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={contactInfo.supportEmail}
                  onChange={(e) =>
                    patchContact({ supportEmail: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="contact-general-email"
                  className="block text-xs font-semibold text-foreground"
                >
                  General / Partnerships Email <span aria-hidden="true">*</span>
                </label>
                <input
                  id="contact-general-email"
                  name="generalEmail"
                  type="email"
                  required
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={contactInfo.generalEmail}
                  onChange={(e) =>
                    patchContact({ generalEmail: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="contact-gmail-target"
                  className="block text-xs font-semibold text-foreground"
                >
                  Admin Gmail Forward Target
                </label>
                <input
                  id="contact-gmail-target"
                  name="gmailForwardTarget"
                  type="email"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={contactInfo.gmailForwardTarget}
                  onChange={(e) =>
                    patchContact({ gmailForwardTarget: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="contact-primary-phone"
                  className="block text-xs font-semibold text-foreground"
                >
                  Primary Support Phone
                </label>
                <input
                  id="contact-primary-phone"
                  name="primaryPhone"
                  type="tel"
                  value={contactInfo.primaryPhone}
                  onChange={(e) =>
                    patchContact({ primaryPhone: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="contact-tollfree-phone"
                  className="block text-xs font-semibold text-foreground"
                >
                  Toll-Free / Secondary Line
                </label>
                <input
                  id="contact-tollfree-phone"
                  name="tollFreePhone"
                  type="text"
                  value={contactInfo.tollFreePhone}
                  onChange={(e) =>
                    patchContact({ tollFreePhone: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="contact-location-city"
                  className="block text-xs font-semibold text-foreground"
                >
                  Headquarters / Location
                </label>
                <input
                  id="contact-location-city"
                  name="locationCity"
                  type="text"
                  value={contactInfo.locationCity}
                  onChange={(e) =>
                    patchContact({ locationCity: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-foreground"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label
                  htmlFor="contact-location-subtitle"
                  className="block text-xs font-semibold text-foreground"
                >
                  Location Subtitle
                </label>
                <input
                  id="contact-location-subtitle"
                  name="locationSubtitle"
                  type="text"
                  value={contactInfo.locationSubtitle}
                  onChange={(e) =>
                    patchContact({ locationSubtitle: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="contact-weekday-hours"
                  className="block text-xs font-semibold text-foreground"
                >
                  Weekday Support Hours
                </label>
                <input
                  id="contact-weekday-hours"
                  name="weekdayHours"
                  type="text"
                  value={contactInfo.weekdayHours}
                  onChange={(e) =>
                    patchContact({ weekdayHours: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="contact-weekend-hours"
                  className="block text-xs font-semibold text-foreground"
                >
                  Weekend Support Hours
                </label>
                <input
                  id="contact-weekend-hours"
                  name="weekendHours"
                  type="text"
                  value={contactInfo.weekendHours}
                  onChange={(e) =>
                    patchContact({ weekendHours: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-foreground"
                />
              </div>
            </div>
          </fieldset>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setContactDraft({ ...DEFAULT_CONTACT_INFO_CONTENT });
                setStatusFeedback(null);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-semibold text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default Info</span>
            </button>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#fbbe15] hover:bg-[#e5ad13] text-[#1a1a1a] font-bold text-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save Contact Info</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

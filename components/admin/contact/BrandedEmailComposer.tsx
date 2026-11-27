'use client';

import { useState, useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  LayoutTemplate,
  Loader2,
  Pencil,
  Send,
} from 'lucide-react';
import {
  ADMIN_EMAIL_TEMPLATES,
  getDefaultTemplateForSubject,
  getTemplatePreset,
  renderAdminBrandedEmailHtml,
  type AdminEmailTemplateId,
} from '@/lib/email/templates/admin-reply';
import {
  useReplyContactMutation,
  useSendTemplateEmailMutation,
} from '@/lib/api/services/contact.hooks';
import type { ContactInquiry } from '@/lib/api/services/contact.service';

interface BrandedEmailComposerProps {
  mode: 'reply' | 'standalone';
  inquiry?: ContactInquiry;
  onReplySent?: (res: {
    emailDelivered: boolean;
    emailReason?: string | null;
    updatedInquiry?: ContactInquiry;
  }) => void;
}

export function BrandedEmailComposer({
  mode,
  inquiry,
  onReplySent,
}: BrandedEmailComposerProps) {
  const initialTemplateId: AdminEmailTemplateId =
    mode === 'reply'
      ? getDefaultTemplateForSubject(inquiry?.subject)
      : 'support_reply';
  const initialPreset = getTemplatePreset(initialTemplateId);

  const [templateId, setTemplateId] =
    useState<AdminEmailTemplateId>(initialTemplateId);
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>(
    mode === 'standalone' ? 'split' : 'edit'
  );
  const [showAdvancedHeader, setShowAdvancedHeader] = useState(false);

  const [toEmail, setToEmail] = useState(inquiry?.email || '');
  const [recipientName, setRecipientName] = useState(inquiry?.name || '');
  const [subject, setSubject] = useState(
    inquiry
      ? `Re: ${inquiry.subject.replace(/_/g, ' ')} - LocalBuka Support`
      : initialPreset.defaultSubject
  );
  const [categoryTitle, setCategoryTitle] = useState(
    initialPreset.categoryTitle
  );
  const [heroEyebrow, setHeroEyebrow] = useState(initialPreset.heroEyebrow);
  const [heroHeadline, setHeroHeadline] = useState(initialPreset.heroHeadline);
  const [greeting, setGreeting] = useState(
    inquiry?.name ? `Hi ${inquiry.name},` : 'Hi there,'
  );
  const [replyMessage, setReplyMessage] = useState(
    mode === 'standalone' ? initialPreset.defaultMessage : ''
  );
  const [highlightNote, setHighlightNote] = useState('');
  const [ctaLabel, setCtaLabel] = useState(initialPreset.defaultCtaLabel);
  const [ctaUrl, setCtaUrl] = useState(initialPreset.defaultCtaUrl);
  const [signOff, setSignOff] = useState(initialPreset.defaultSignOff);
  const [includeOriginalMessage, setIncludeOriginalMessage] = useState(
    mode === 'reply'
  );

  const [deliveryResult, setDeliveryResult] = useState<{
    type: 'success' | 'warning' | 'error';
    message: string;
  } | null>(null);

  const replyMutation = useReplyContactMutation();
  const sendTemplateMutation = useSendTemplateEmailMutation();
  const isSending =
    replyMutation.isPending || sendTemplateMutation.isPending;

  const handleSelectTemplate = (nextId: AdminEmailTemplateId) => {
    const preset = getTemplatePreset(nextId);
    setTemplateId(nextId);
    setCategoryTitle(preset.categoryTitle);
    setHeroEyebrow(preset.heroEyebrow);
    setHeroHeadline(preset.heroHeadline);
    setCtaLabel(preset.defaultCtaLabel);
    setCtaUrl(preset.defaultCtaUrl);
    setSignOff(preset.defaultSignOff);
    if (!inquiry) {
      setSubject(preset.defaultSubject);
    }
    if (!replyMessage.trim() || ADMIN_EMAIL_TEMPLATES.some((t) => t.defaultMessage === replyMessage)) {
      setReplyMessage(preset.defaultMessage);
    }
    setDeliveryResult(null);
  };

  const previewHtml = useMemo(
    () =>
      renderAdminBrandedEmailHtml({
        recipientName: recipientName || inquiry?.name || 'there',
        subject,
        categoryTitle,
        heroEyebrow,
        heroHeadline,
        greeting,
        replyMessage,
        highlightNote,
        ctaLabel,
        ctaUrl,
        signOff,
        originalMessage: inquiry?.message,
        includeOriginalMessage,
      }),
    [
      recipientName,
      inquiry?.name,
      inquiry?.message,
      subject,
      categoryTitle,
      heroEyebrow,
      heroHeadline,
      greeting,
      replyMessage,
      highlightNote,
      ctaLabel,
      ctaUrl,
      signOff,
      includeOriginalMessage,
    ]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDeliveryResult(null);

    if (!replyMessage.trim()) {
      setDeliveryResult({
        type: 'error',
        message: 'Please enter the main message before sending.',
      });
      return;
    }

    const commonPayload = {
      templateId,
      subject: subject.trim() || undefined,
      categoryTitle: categoryTitle.trim() || undefined,
      heroEyebrow: heroEyebrow.trim() || undefined,
      heroHeadline: heroHeadline.trim() || undefined,
      greeting: greeting.trim() || undefined,
      replyMessage: replyMessage.trim(),
      highlightNote: highlightNote.trim() || undefined,
      ctaLabel: ctaLabel.trim() || undefined,
      ctaUrl: ctaUrl.trim() || undefined,
      signOff: signOff.trim() || undefined,
      includeOriginalMessage,
    };

    if (mode === 'reply' && inquiry) {
      replyMutation.mutate(
        { id: inquiry.id, data: commonPayload },
        {
          onSuccess: (res) => {
            const payload = res?.data;
            const delivered = Boolean(payload?.emailDelivered);
            setDeliveryResult({
              type: delivered ? 'success' : 'warning',
              message: delivered
                ? `Branded email delivered to ${inquiry.email} and inquiry marked as Resolved.`
                : `Reply logged in internal notes, but email was NOT delivered (${payload?.emailReason || 'check RESEND_API_KEY on Railway'}).`,
            });
            if (delivered) {
              setReplyMessage('');
              setHighlightNote('');
            }
            onReplySent?.({
              emailDelivered: delivered,
              emailReason: payload?.emailReason,
              updatedInquiry: payload?.data,
            });
          },
          onError: (err: any) => {
            setDeliveryResult({
              type: 'error',
              message:
                err?.response?.data?.message ||
                err?.message ||
                'Failed to send reply email.',
            });
          },
        }
      );
      return;
    }

    if (!toEmail.trim()) {
      setDeliveryResult({
        type: 'error',
        message: 'Please enter a valid recipient email address.',
      });
      return;
    }

    sendTemplateMutation.mutate(
      {
        ...commonPayload,
        toEmail: toEmail.trim(),
        recipientName: recipientName.trim() || undefined,
      },
      {
        onSuccess: (res) => {
          const payload = res?.data;
          const delivered = Boolean(payload?.emailDelivered);
          setDeliveryResult({
            type: delivered ? 'success' : 'warning',
            message: delivered
              ? `Branded email delivered to ${toEmail.trim()}.`
              : `Email was NOT delivered (${payload?.emailReason || 'check RESEND_API_KEY on Railway'}).`,
          });
        },
        onError: (err: any) => {
          setDeliveryResult({
            type: 'error',
            message:
              err?.response?.data?.message ||
              err?.message ||
              'Failed to send branded email.',
          });
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      {/* Template Picker + View Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
          <LayoutTemplate className="w-4 h-4 text-[#fbbe15]" />
          <span>
            {mode === 'reply'
              ? `Branded Customer-Template Reply to ${inquiry?.email}`
              : 'Send Branded Customer-Template Email'}
          </span>
        </div>

        <div className="inline-flex items-center rounded-lg bg-gray-100 dark:bg-gray-800 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setViewMode('edit')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              viewMode === 'edit'
                ? 'bg-white dark:bg-gray-900 text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              viewMode === 'preview'
                ? 'bg-white dark:bg-gray-900 text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              viewMode === 'split'
                ? 'bg-white dark:bg-gray-900 text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>Split View</span>
          </button>
        </div>
      </div>

      {/* Designated Template Presets */}
      <div className="flex flex-wrap gap-2">
        {ADMIN_EMAIL_TEMPLATES.map((tpl) => {
          const active = templateId === tpl.id;
          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => handleSelectTemplate(tpl.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                active
                  ? 'bg-[#fbbe15] text-[#1a1a1a] border-[#fbbe15] shadow-xs'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[#fbbe15]/60'
              }`}
              title={tpl.description}
            >
              {tpl.label}
            </button>
          );
        })}
      </div>

      {/* Delivery Feedback */}
      {deliveryResult && (
        <div
          role={deliveryResult.type === 'error' ? 'alert' : 'status'}
          aria-live="polite"
          className={`flex items-start gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium border ${
            deliveryResult.type === 'success'
              ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
              : deliveryResult.type === 'warning'
                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
          }`}
        >
          {deliveryResult.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          <span>{deliveryResult.message}</span>
        </div>
      )}

      {/* Main Composer Body: Edit Form + Auto-Arranged Live Customer Email Preview */}
      <form
        onSubmit={handleSubmit}
        aria-labelledby={`branded-email-form-${mode}`}
        className={
          viewMode === 'split'
            ? 'grid grid-cols-1 xl:grid-cols-12 gap-6 items-start'
            : 'space-y-4'
        }
      >
        <span id={`branded-email-form-${mode}`} className="sr-only">
          Branded LocalBuka Email Composer
        </span>

        {/* Editor Column */}
        {viewMode !== 'preview' && (
          <div
            className={`space-y-3.5 ${
              viewMode === 'split' ? 'xl:col-span-5' : ''
            }`}
          >
            {mode === 'standalone' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label
                    htmlFor="composer-to-email"
                    className="block text-xs font-semibold text-foreground"
                  >
                    Recipient Email <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="composer-to-email"
                    name="toEmail"
                    type="email"
                    required
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="customer@example.com"
                    value={toEmail}
                    onChange={(e) => setToEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="composer-recipient-name"
                    className="block text-xs font-semibold text-foreground"
                  >
                    Recipient Name
                  </label>
                  <input
                    id="composer-recipient-name"
                    name="recipientName"
                    type="text"
                    placeholder="e.g. Adeola Johnson"
                    value={recipientName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setRecipientName(val);
                      setGreeting(val.trim() ? `Hi ${val.trim()},` : 'Hi there,');
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-foreground"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1 sm:col-span-2">
                <label
                  htmlFor={`composer-subject-${mode}`}
                  className="block text-xs font-semibold text-foreground"
                >
                  Email Subject <span aria-hidden="true">*</span>
                </label>
                <input
                  id={`composer-subject-${mode}`}
                  name="subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor={`composer-greeting-${mode}`}
                  className="block text-xs font-semibold text-foreground"
                >
                  Greeting Line
                </label>
                <input
                  id={`composer-greeting-${mode}`}
                  name="greeting"
                  type="text"
                  value={greeting}
                  onChange={(e) => setGreeting(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor={`composer-signoff-${mode}`}
                  className="block text-xs font-semibold text-foreground"
                >
                  Sign-Off Name
                </label>
                <input
                  id={`composer-signoff-${mode}`}
                  name="signOff"
                  type="text"
                  value={signOff}
                  onChange={(e) => setSignOff(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-foreground"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor={`composer-body-${mode}`}
                className="block text-xs font-semibold text-foreground"
              >
                Main Message <span aria-hidden="true">*</span>
              </label>
              <textarea
                id={`composer-body-${mode}`}
                name="replyMessage"
                rows={4}
                required
                placeholder="Type your response here — blank lines automatically split into clean paragraphs in the email template..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-foreground focus-visible:outline-2 focus-visible:outline-[#fbbe15]"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor={`composer-highlight-${mode}`}
                className="block text-xs font-semibold text-foreground"
              >
                Optional Highlight / Next-Step Box
              </label>
              <textarea
                id={`composer-highlight-${mode}`}
                name="highlightNote"
                rows={2}
                placeholder="Optional: Add an important note, timeline, or instruction to highlight in a golden callout box..."
                value={highlightNote}
                onChange={(e) => setHighlightNote(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-foreground"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label
                  htmlFor={`composer-cta-label-${mode}`}
                  className="block text-xs font-semibold text-foreground"
                >
                  Button Label (Optional)
                </label>
                <input
                  id={`composer-cta-label-${mode}`}
                  name="ctaLabel"
                  type="text"
                  placeholder="e.g. EXPLORE LOCALBUKA"
                  value={ctaLabel}
                  onChange={(e) => setCtaLabel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor={`composer-cta-url-${mode}`}
                  className="block text-xs font-semibold text-foreground"
                >
                  Button URL (Optional)
                </label>
                <input
                  id={`composer-cta-url-${mode}`}
                  name="ctaUrl"
                  type="text"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="https://www.localbuka.com/buka"
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-foreground"
                />
              </div>
            </div>

            {/* Collapsible Hero Banner Customization */}
            <div className="pt-1">
              <button
                type="button"
                aria-expanded={showAdvancedHeader}
                onClick={() => setShowAdvancedHeader((v) => !v)}
                className="text-xs font-semibold text-[#fbbe15] hover:underline cursor-pointer"
              >
                {showAdvancedHeader
                  ? 'Hide banner headline & category settings'
                  : 'Edit banner headline & category badge'}
              </button>

              {showAdvancedHeader && (
                <div className="mt-2.5 p-3 rounded-xl bg-gray-100/70 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label
                        htmlFor={`composer-cat-${mode}`}
                        className="block text-[11px] font-semibold text-foreground"
                      >
                        Top-Right Category Badge
                      </label>
                      <input
                        id={`composer-cat-${mode}`}
                        name="categoryTitle"
                        type="text"
                        value={categoryTitle}
                        onChange={(e) => setCategoryTitle(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor={`composer-eyebrow-${mode}`}
                        className="block text-[11px] font-semibold text-foreground"
                      >
                        Hero Eyebrow
                      </label>
                      <input
                        id={`composer-eyebrow-${mode}`}
                        name="heroEyebrow"
                        type="text"
                        value={heroEyebrow}
                        onChange={(e) => setHeroEyebrow(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-foreground"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor={`composer-headline-${mode}`}
                      className="block text-[11px] font-semibold text-foreground"
                    >
                      Hero Headline (Use line breaks for visual balance)
                    </label>
                    <textarea
                      id={`composer-headline-${mode}`}
                      name="heroHeadline"
                      rows={2}
                      value={heroHeadline}
                      onChange={(e) => setHeroHeadline(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-foreground"
                    />
                  </div>
                </div>
              )}
            </div>

            {mode === 'reply' && inquiry && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  id="composer-include-original"
                  name="includeOriginalMessage"
                  type="checkbox"
                  checked={includeOriginalMessage}
                  onChange={(e) =>
                    setIncludeOriginalMessage(e.target.checked)
                  }
                  className="h-4 w-4 accent-[#fbbe15] rounded cursor-pointer"
                />
                <label
                  htmlFor="composer-include-original"
                  className="text-xs text-muted-foreground cursor-pointer"
                >
                  Quote user&apos;s original inquiry below reply
                </label>
              </div>
            )}

            {/* Submit Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <div className="flex items-center gap-3">
                {viewMode === 'edit' && (
                  <button
                    type="button"
                    onClick={() => setViewMode('preview')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-semibold text-foreground hover:border-[#fbbe15] cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview Template</span>
                  </button>
                )}
                {mode === 'reply' && inquiry && (
                  <a
                    href={`mailto:${inquiry.email}?subject=${encodeURIComponent(
                      subject
                    )}`}
                    className="text-[11px] text-muted-foreground hover:text-foreground underline"
                  >
                    Open mail app
                  </a>
                )}
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#fbbe15] hover:bg-[#e5ad13] text-[#1a1a1a] font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>
                  {mode === 'reply'
                    ? 'Send Branded Reply & Mark Resolved'
                    : 'Send Branded Email'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Live Rendered Customer Email Preview Column */}
        {viewMode !== 'edit' && (
          <div
            className={`space-y-3 ${
              viewMode === 'split' ? 'xl:col-span-7' : ''
            }`}
          >
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-[#F5F7FA]">
              <div className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between gap-2 text-xs">
                <div className="min-w-0">
                  <span className="font-bold text-foreground block truncate">
                    {subject || 'LocalBuka Support'}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    To: {mode === 'reply' ? inquiry?.email : toEmail || 'customer@example.com'}
                  </span>
                </div>
                {viewMode === 'preview' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setViewMode('edit')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-xs font-semibold text-foreground hover:border-[#fbbe15] cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="submit"
                      disabled={isSending}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#fbbe15] hover:bg-[#e5ad13] text-[#1a1a1a] font-bold text-xs cursor-pointer disabled:opacity-50"
                    >
                      {isSending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>Send Now</span>
                    </button>
                  </div>
                )}
              </div>
              <iframe
                title="Live LocalBuka Customer Email Preview"
                srcDoc={previewHtml}
                className="w-full h-[540px] border-0 bg-[#F5F7FA]"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

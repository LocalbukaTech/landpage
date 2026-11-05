"use client";

import { useState } from "react";
import {
  X,
  AlertTriangle,
  EyeOff,
  Trash2,
  Clock,
  Ban,
  ArrowUpRight,
  Loader2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useTakeAction } from "@/lib/api/services/moderation.hooks";
import type {
  ModerationAction,
  PauseDuration,
  ModerationActionPayload,
} from "@/lib/api/services/moderation.service";
import { useToast } from "@/hooks/use-toast";

interface ModerationActionModalProps {
  reportId: string;
  reportNumber: string;
  targetType: "post" | "profile" | string;
  targetTitle?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialAction?: ModerationAction;
}

const WARNING_PRESETS = [
  "We've received reports about upfront payment requests. Please review our seller guidelines.",
  "Your account has been reported for spam or excessive automated behavior. Please adhere to community rules.",
  "Inappropriate or abusive content has been detected on your profile/posts. Continued violations may result in account suspension.",
  "Please refrain from posting misleading descriptions or inaccurate pricing details.",
];

const PAUSE_DURATIONS: PauseDuration[] = [
  "24 hours",
  "48 hours",
  "3 days",
  "7 days",
  "30 days",
];

export function ModerationActionModal({
  reportId,
  reportNumber,
  targetType,
  targetTitle,
  isOpen,
  onClose,
  onSuccess,
  initialAction = "warn",
}: ModerationActionModalProps) {
  const { toast } = useToast();
  const [selectedAction, setSelectedAction] = useState<ModerationAction>(initialAction);
  const [warningMessage, setWarningMessage] = useState(WARNING_PRESETS[0]);
  const [pauseDuration, setPauseDuration] = useState<PauseDuration>("24 hours");
  const [note, setNote] = useState("");
  const [escalationNote, setEscalationNote] = useState("");

  const takeActionMutation = useTakeAction(reportId);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let payload: ModerationActionPayload;

    if (selectedAction === "ignore") {
      payload = { action: "ignore", note: note.trim() || undefined };
    } else if (selectedAction === "warn") {
      if (!warningMessage.trim()) {
        toast({
          title: "Warning message required",
          description: "Please enter or select a warning message to send to the user.",
          variant: "destructive",
        });
        return;
      }
      payload = { action: "warn", warningMessage: warningMessage.trim() };
    } else if (selectedAction === "remove_post") {
      payload = { action: "remove_post", note: note.trim() || undefined };
    } else if (selectedAction === "pause_account") {
      payload = { action: "pause_account", duration: pauseDuration, note: note.trim() || undefined };
    } else if (selectedAction === "ban_account") {
      payload = { action: "ban_account", note: note.trim() || undefined };
    } else if (selectedAction === "escalate") {
      if (!escalationNote.trim()) {
        toast({
          title: "Escalation note required",
          description: "Please provide a reason or note for senior review.",
          variant: "destructive",
        });
        return;
      }
      payload = { action: "escalate", escalationNote: escalationNote.trim() };
    } else {
      return;
    }

    takeActionMutation.mutate(payload, {
      onSuccess: (res) => {
        const responseData = (res as any)?.data || res;
        toast({
          title: "Action executed",
          description: responseData?.message || `Successfully executed ${selectedAction} on ${reportNumber}`,
        });
        onSuccess?.();
        onClose();
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message || err?.message || "Failed to execute moderation action.";
        toast({
          title: "Action failed",
          description: msg,
          variant: "destructive",
        });
      },
    });
  };

  const actionConfigs: Array<{
    id: ModerationAction;
    title: string;
    description: string;
    icon: typeof AlertTriangle;
    level: string;
    colorClass: string;
    bgColorClass: string;
    borderColorClass: string;
    applicableTo?: "post" | "profile" | "all";
  }> = [
    {
      id: "ignore",
      title: "Ignore Report",
      description: "Dismiss and close this report without any disciplinary penalty against the target.",
      icon: EyeOff,
      level: "No penalty",
      colorClass: "text-gray-700 dark:text-gray-300",
      bgColorClass: "bg-gray-100 dark:bg-gray-800",
      borderColorClass: "border-gray-200 dark:border-gray-700",
      applicableTo: "all",
    },
    {
      id: "warn",
      title: "Warn User",
      description: "Send an official in-app system warning notification to the reported user's account.",
      icon: AlertTriangle,
      level: "Low severity",
      colorClass: "text-amber-600 dark:text-amber-400",
      bgColorClass: "bg-amber-50 dark:bg-amber-950/40",
      borderColorClass: "border-amber-200 dark:border-amber-800",
      applicableTo: "all",
    },
    {
      id: "remove_post",
      title: "Remove Post",
      description: "Hide or archive the reported post immediately from all public feeds and discovery.",
      icon: Trash2,
      level: "Medium severity",
      colorClass: "text-orange-600 dark:text-orange-400",
      bgColorClass: "bg-orange-50 dark:bg-orange-950/40",
      borderColorClass: "border-orange-200 dark:border-orange-800",
      applicableTo: targetType === "post" ? "post" : "all",
    },
    {
      id: "pause_account",
      title: "Pause Account",
      description: "Temporarily suspend user account access, prevent posting and messaging for a set duration.",
      icon: Clock,
      level: "Medium severity",
      colorClass: "text-rose-600 dark:text-rose-400",
      bgColorClass: "bg-rose-50 dark:bg-rose-950/40",
      borderColorClass: "border-rose-200 dark:border-rose-800",
      applicableTo: "all",
    },
    {
      id: "ban_account",
      title: "Ban Account Permanently",
      description: "Permanently restrict and ban this user account from LocalBuka. Status set to Banned.",
      icon: Ban,
      level: "High severity",
      colorClass: "text-red-700 dark:text-red-400",
      bgColorClass: "bg-red-50 dark:bg-red-950/40",
      borderColorClass: "border-red-300 dark:border-red-800",
      applicableTo: "all",
    },
    {
      id: "escalate",
      title: "Escalate to Senior Staff",
      description: "Assign report to senior administration for legal, financial, or complex safety evaluation.",
      icon: ArrowUpRight,
      level: "Senior review",
      colorClass: "text-purple-600 dark:text-purple-400",
      bgColorClass: "bg-purple-50 dark:bg-purple-950/40",
      borderColorClass: "border-purple-200 dark:border-purple-800",
      applicableTo: "all",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/70 dark:bg-gray-800/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#fbbe15]/20 text-[#9e7400] dark:text-[#fbbe15] font-bold text-[11px] font-mono">
                {reportNumber}
              </span>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Take Moderation Action
              </h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Target: <strong className="text-gray-700 dark:text-gray-300">{targetTitle || targetType}</strong> ({targetType})
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Action Selection Grid */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Select Disciplinary or Administrative Action:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {actionConfigs.map((action) => {
                const isSelected = selectedAction === action.id;
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => setSelectedAction(action.id)}
                    className={`text-left p-3 rounded-xl border transition-all relative flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? `${action.bgColorClass} ${action.borderColorClass} ring-2 ring-offset-1 ring-current`
                        : "bg-white dark:bg-gray-850 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <Icon className={`w-4 h-4 ${action.colorClass}`} />
                          <span className="text-xs font-bold text-gray-900 dark:text-white">
                            {action.title}
                          </span>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className={`w-4 h-4 ${action.colorClass}`} />
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2">
                        {action.description}
                      </p>
                    </div>

                    <div className="mt-2 pt-1 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between text-[10px]">
                      <span className={`font-semibold ${action.colorClass}`}>
                        {action.level}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Configuration Panel according to selected action */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-800 space-y-3">
            {/* 1. Ignore */}
            {selectedAction === "ignore" && (
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Internal Note (Optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Reviewed context; no community rule breach identified."
                  rows={2}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#fbbe15]"
                />
              </div>
            )}

            {/* 2. Warn User */}
            {selectedAction === "warn" && (
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                  System Warning Notification Message:
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {WARNING_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setWarningMessage(preset)}
                      className={`text-[10px] px-2.5 py-1 rounded-md border text-left transition-colors ${
                        warningMessage === preset
                          ? "bg-amber-100 dark:bg-amber-950/60 border-amber-300 text-amber-900 dark:text-amber-200 font-semibold"
                          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100"
                      }`}
                    >
                      Template {idx + 1}
                    </button>
                  ))}
                </div>
                <textarea
                  value={warningMessage}
                  onChange={(e) => setWarningMessage(e.target.value)}
                  required
                  rows={3}
                  placeholder="Enter custom warning text sent directly to the user..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#fbbe15]"
                />
              </div>
            )}

            {/* 3. Remove Post */}
            {selectedAction === "remove_post" && (
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Removal Reason / Note (Optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Post violates community standards on honest selling."
                  rows={2}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#fbbe15]"
                />
              </div>
            )}

            {/* 4. Pause Account */}
            {selectedAction === "pause_account" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Suspension Duration:
                  </label>
                  <select
                    value={pauseDuration}
                    onChange={(e) => setPauseDuration(e.target.value as PauseDuration)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#fbbe15]"
                  >
                    {PAUSE_DURATIONS.map((dur) => (
                      <option key={dur} value={dur}>
                        {dur}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Internal Note / Reason (Optional)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Temporary suspension while investigation of upfront payment complaint concludes."
                    rows={2}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#fbbe15]"
                  />
                </div>
              </div>
            )}

            {/* 5. Ban Account */}
            {selectedAction === "ban_account" && (
              <div className="space-y-2">
                <div className="p-3 bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-900 rounded-lg text-red-800 dark:text-red-300 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Irreversible Action:</strong> This user will be permanently banned from accessing LocalBuka, and their active listings will be removed.
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ban Justification / Note:
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Confirmed repeat fraudulent seller with verified fake listings."
                    rows={2}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            )}

            {/* 6. Escalate */}
            {selectedAction === "escalate" && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Escalation Note for Senior Staff <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={escalationNote}
                  onChange={(e) => setEscalationNote(e.target.value)}
                  required
                  rows={3}
                  placeholder="Explain why this case requires senior administration review (e.g. payment dispute over ₦15,000, legal threat, duplicate accounts)..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              disabled={takeActionMutation.isPending}
              className="px-4 py-2 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={takeActionMutation.isPending}
              className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-2 transition-all cursor-pointer ${
                selectedAction === "ban_account"
                  ? "bg-red-600 hover:bg-red-700"
                  : selectedAction === "escalate"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : selectedAction === "warn"
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-gray-900 hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              }`}
            >
              {takeActionMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Confirm Action
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

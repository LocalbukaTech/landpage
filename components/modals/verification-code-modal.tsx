"use client";

import { useState, useEffect } from "react";
import { X, Copy, Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VerificationCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  code: string;
  email?: string;
  title?: string;
  description?: string;
}

export function VerificationCodeModal({
  open,
  onOpenChange,
  code,
  email,
  title = "Verification Code",
  description = "Use this code to verify your account. This is a temporary feature while email delivery is being set up.",
}: VerificationCodeModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setCopied(false);
    }
  }, [open]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-9999 backdrop-blur-sm animate-in fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
        <div
          className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 z-60 rounded-full p-2 opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <span className="sr-only">Close</span>
          </button>

          {/* Content */}
          <div className="p-8 pt-12 text-center">
            {/* Icon */}
            <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                <Mail className="w-7 h-7 text-white" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h2>

            {/* Description */}
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              {description}
            </p>

            {/* Email Display */}
            {email && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Sent to:{" "}
                <span className="font-medium text-primary">{email}</span>
              </p>
            )}

            {/* Code Display */}
            <div className="relative mb-6">
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 dark:from-primary/20 dark:via-primary/10 dark:to-primary/20 rounded-2xl p-6 border-2 border-dashed border-primary/30">
                <div className="flex items-center justify-center gap-3">
                  {code.split("").map((digit, index) => (
                    <div
                      key={index}
                      className="w-14 h-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center border border-gray-200 dark:border-gray-700"
                    >
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {digit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Copy Button */}
            <Button
              onClick={handleCopy}
              className={`w-full h-12 font-semibold text-base rounded-xl transition-all duration-300 ${
                copied
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                  : "bg-primary hover:bg-primary/90 text-[#0A1F44]"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 mr-2" />
                  Copy Code
                </>
              )}
            </Button>

            {/* Helper Text */}
            <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
              🔐 This code will expire in 10 minutes
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

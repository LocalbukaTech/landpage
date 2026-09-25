import { Check, AlertCircle } from "lucide-react";

export const passwordRules = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (p: string) => p.length >= 8,
  },
  {
    id: "upper",
    label: "At least 1 uppercase letter (A-Z)",
    test: (p: string) => /[A-Z]/.test(p),
  },
  {
    id: "lower",
    label: "At least 1 lowercase letter (a-z)",
    test: (p: string) => /[a-z]/.test(p),
  },
  {
    id: "number",
    label: "At least 1 number (0-9)",
    test: (p: string) => /[0-9]/.test(p),
  },
  {
    id: "special",
    label: "At least 1 special character (@, #, $, %, !, etc.)",
    test: (p: string) => /[^A-Za-z0-9\s]/.test(p),
  },
];

export const allPasswordRulesPass = (password: string) =>
  passwordRules.every((rule) => rule.test(password));

export const PasswordChecklist = ({ password }: { password: string }) => {
  const passedRules = passwordRules.filter((rule) => rule.test(password));
  const passedCount = passedRules.length;
  const firstUnmetRule = passwordRules.find((rule) => !rule.test(password));
  const isAllPassed = !firstUnmetRule;
  const hasTyped = password.length > 0;

  return (
    <div className="space-y-2 px-0.5" aria-live="polite">
      {/* Sleek 5-Segment Progress Bar */}
      <div className="flex gap-1.5 h-1 w-full">
        {passwordRules.map((rule, idx) => {
          const isPassed = rule.test(password);
          return (
            <div
              key={rule.id}
              className={`h-full flex-1 rounded-full transition-all duration-300 ${
                isPassed
                  ? "bg-emerald-500"
                  : idx === passedCount && hasTyped
                  ? "bg-amber-400 dark:bg-amber-500"
                  : "bg-gray-200 dark:bg-gray-800"
              }`}
            />
          );
        })}
      </div>

      {/* Dynamic Single-Hint Guidance */}
      <div className="min-h-[22px] flex items-center justify-between text-xs transition-all duration-200">
        {isAllPassed ? (
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium animate-in fade-in slide-in-from-left-1 duration-200">
            <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
            <span>Password meets all requirements</span>
          </div>
        ) : (
          <div
            key={firstUnmetRule?.id}
            className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 animate-in fade-in slide-in-from-left-1 duration-200"
          >
            <div className="w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center justify-center shrink-0">
              <AlertCircle className="w-3 h-3 text-gray-400 dark:text-gray-500" />
            </div>
            <span>
              Next requirement:{" "}
              <strong className="font-semibold text-gray-700 dark:text-gray-200">
                {firstUnmetRule?.label}
              </strong>
            </span>
          </div>
        )}

        {/* Counter */}
        <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium tabular-nums ml-2 shrink-0">
          {passedCount}/{passwordRules.length}
        </span>
      </div>
    </div>
  );
};

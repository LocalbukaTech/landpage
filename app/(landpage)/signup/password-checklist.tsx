import { Check, Circle } from "lucide-react";

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

export const PasswordChecklist = ({ password }: { password: string }) => (
  <ul className="space-y-1.5 -mt-1 px-1" aria-label="Password requirements">
    {passwordRules.map((rule) => {
      const passed = rule.test(password);
      return (
        <li
          key={rule.id}
          className={`flex items-center gap-2 text-sm transition-colors ${
            passed
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {passed ? (
            <Check className="w-4 h-4 shrink-0" strokeWidth={3} />
          ) : (
            <Circle className="w-4 h-4 shrink-0" />
          )}
          <span>{rule.label}</span>
        </li>
      );
    })}
  </ul>
);

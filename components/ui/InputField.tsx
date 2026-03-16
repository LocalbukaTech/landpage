import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface InputFieldProps extends React.ComponentProps<"input"> {
    label?: string;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
    ({ label, className, disabled, ...props }, ref) => {
        return (
            <div className={cn(
                "group flex flex-col justify-center w-full transition-all",
                "h-[52px] rounded-[10px] px-[20px] py-1",
                disabled
                    ? "bg-[#F3F4F6] border-none"
                    : "bg-transparent border-[1.5px] border-[#F5B400] focus-within:shadow-[0_0_0_1px_#F5B400]"
            )}>
                {label && (
                    <label
                        className={cn(
                            "text-[12px] font-medium leading-tight mb-0.5",
                            disabled ? "text-[#9CA3AF]" : "text-[#9CA3AF]"
                        )}
                    >
                        {label}
                    </label>
                )}
                <Input
                    ref={ref}
                    disabled={disabled}
                    className={cn(
                        // Reset base styles
                        "!bg-transparent border-none p-0 h-auto shadow-none focus-visible:ring-0 ring-offset-0",
                        // Text styles
                        "text-[16px] font-semibold tracking-wide placeholder:text-gray-600",

                        // Autofill background fix
                        "[&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:shadow-[0_0_0_1000px_transparent_inset] [&:-webkit-autofill]:transition-[background-color_5000s_ease-in-out_0s]",

                        disabled ? "text-[#6B7280]" : "text-white",

                        className
                    )}
                    {...props}
                />
            </div>
        );
    }
);

InputField.displayName = "InputField";

export { InputField };

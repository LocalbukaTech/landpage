import { ReactNode } from "react";

interface Props {
open: boolean;
onClose: () => void;
title: string;
children: ReactNode;
}

export default function BaseModal({
open,
onClose,
title,
children,
}: Props) {
if (!open) return null;

return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center md:items-center items-start h-screen">

    <div className="w-full max-w-md bg-[#0f0f0f] rounded-t-2xl p-5 animate-slide-up h-[450px] rounded-b-2xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-lg font-semibold">{title}</h2>

        <button
        onClick={onClose}
        className="text-white text-xl hover:opacity-70"
        >
        ✕
        </button>
        </div>

        {children}

    </div>
    </div>
);
}

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) return null;

  return createPortal(
    <div 
      className="z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0
      }}
    >
      <div 
        className="w-full max-w-md bg-[#0f0f0f] rounded-2xl p-5 animate-slide-up h-[450px]"
        style={{
          position: 'relative'
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-white text-xl hover:opacity-70 cursor-pointer"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}

"use client";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Copy, Check, Mail, MessageCircle, Send, Info } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSharePost } from "@/lib/api/services/posts.hooks";

interface ShareDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
}

// Premium SVG Icons for Social Media
const Icons = {
  WhatsApp: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.877 1.215 3.076.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.553 4.189 1.606 6.06L0 24l6.117-1.605a11.827 11.827 0 005.93 1.583h.005c6.635 0 12.032-5.396 12.035-12.032a11.761 11.761 0 00-3.418-8.482z" />
    </svg>
  ),
  Facebook: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  Twitter: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  Instagram: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.981 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  Telegram: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.891 8.146l-1.92 9.03c-.144.64-.524.797-1.059.497l-2.92-2.152-1.41 1.356c-.156.156-.288.288-.588.288l.21-2.97 5.404-4.88c.234-.208-.05-.324-.361-.118l-6.677 4.204-2.88-.9c-.626-.196-.639-.626.13-.924l11.258-4.34c.522-.196.98.118.813.829z" />
    </svg>
  ),
  Snapchat: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
      <path d="M11.996 0c-1.4 0-2.348.163-3.263.504-.543.203-1.077.585-1.574 1.139-.817.91-1.396 2.05-1.583 3.197-.1 1.25.132 1.67-.181 2.502-.15.395-.916.643-1.636 1.096-.134.084-.251.2-.351.341-.444.629-.272 1.416.712 1.579h.165c.611 0 1.268.04 1.637.525.181.237.284.445.344.6.14.364.12 1.012-.132 1.625-.213.518-.636.953-1.048 1.341-.309.284-.601.531-.818.847-.367.534-.236 1.42.455 1.554.081.015.105.015.228.015.42 0 .899-.105 1.403-.311.23-.095.465-.216.711-.351.4-.222.842-.46 1.332-.46h.007c.504 0 .97.351 1.246.611 1.196 1.127 3.321 1.164 4.544.02.261-.242.712-.585 1.2-.585.5 0 .943.237 1.32.445.267.147.523.284.778.395.464.19.923.284 1.312.284.15 0 .15-.015.253-.02h.01c.691-.132.81-1.045.434-1.579-.215-.306-.511-.55-.815-.829-.396-.364-.811-.743-1.012-1.241-.274-.683-.243-1.341-.12-1.722.067-.206.183-.443.375-.688.39-.49.916-.543 1.503-.543l.235-.008c.95-.145 1.15-.9.712-1.524-.1-.137-.215-.251-.349-.333-.709-.434-1.472-.663-1.62-.1.082-.249.49-3.23-.526-1.11-.8-.179-1.921-.715-3.08-1.066-1.19-.36-.484-.531-1.464-.531-.418z" />
    </svg>
  ),
  Reddit: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.051l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.056 1.597.051.189.076.38.076.574 0 2.443-2.91 4.428-6.499 4.428-3.589 0-6.498-1.985-6.498-4.428 0-.197.025-.393.078-.585a1.71 1.71 0 0 1-1.026-1.586c0-.968.784-1.754 1.752-1.754.463 0 .88.18 1.185.472.13-.13.267-.253.404-.37 1.056-.889 2.73-1.489 4.634-1.583l.814-3.805 3.012.637c.057-.404.399-.714.819-.714zm-10.02 8.718c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zM12 15.65c-.93 0-1.87-.24-2.45-.49a.31.31 0 0 1-.1-.44.31.31 0 0 1 .45-.1c.42.18 1.36.42 2.1.42s1.68-.24 2.1-.42a.31.31 0 0 1 .45.1.31.31 0 0 1-.1.44c-.58.25-1.52.49-2.45.49zm2.46-2.932c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25z" />
    </svg>
  ),
  TikTok: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.11-1.46.03 2.12.04 4.25.03 6.37 0 1.27-.27 2.59-.89 3.69-.62 1.13-1.61 2.02-2.77 2.53-1.51.7-3.23.85-4.83.47-1.5-.33-2.93-1.18-3.88-2.4-1.02-1.29-1.48-2.98-1.35-4.59.08-1.5.76-2.98 1.88-3.99 1.12-1.02 2.63-1.62 4.15-1.68.02 1.41.01 2.82.02 4.23-1.2.14-2.4.92-2.82 2.06-.39 1.05-.13 2.37.66 3.19.78.85 2.03 1.1 3.1 1.01 2.51-.23 2.51-3.69 2.5-5.59-.01-4.04-.01-8.08-.01-12.12z" />
    </svg>
  ),
};

export function ShareDrawer({ open, onOpenChange, postId }: ShareDrawerProps) {
  const [copied, setCopied] = useState(false);
  const [activeInfoPlatform, setActiveInfoPlatform] = useState<any | null>(null);
  const { toast } = useToast();
  const sharePostMutation = useSharePost();
  
  const shareUrl = `https://www.localbuka.com/posts/${postId}`;
  const shareText = "Check out this post on LocalBuka!";

  const triggerShareMutation = () => {
    sharePostMutation.mutate(postId);
  };

  const handleCopy = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      triggerShareMutation();
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
        variant: "success",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const socialPlatforms = [
    { name: "WhatsApp", icon: Icons.WhatsApp, color: "bg-[#25D366]", url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}` },
    { name: "Facebook", icon: Icons.Facebook, color: "bg-[#1877F2]", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}` },
    { name: "Twitter", icon: Icons.Twitter, color: "bg-black", url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}` },
    { name: "Telegram", icon: Icons.Telegram, color: "bg-[#26A5E4]", url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}` },
    { name: "Reddit", icon: Icons.Reddit, color: "bg-[#FF4500]", url: `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}` },
    { name: "Email", icon: Mail, color: "bg-neutral-600", url: `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}` },
    { name: "TikTok", icon: Icons.TikTok, color: "bg-black", isCopyOnly: true },
    { name: "Instagram", icon: Icons.Instagram, color: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]", isCopyOnly: true },
    { name: "Snapchat", icon: Icons.Snapchat, color: "bg-[#FFFC00] !text-black", isCopyOnly: true },
  ];

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="bg-[#121212] border-neutral-800 text-white md:w-[450px] h-full rounded-l-[32px] overflow-hidden">
        <DrawerHeader className="border-b border-neutral-800/50 pb-6 mt-10 px-8">
          <DrawerTitle className="text-3xl font-black text-white tracking-tight">Share to</DrawerTitle>
          <DrawerDescription className="text-neutral-400 text-base mt-2">
            Choose your favorite platform to share this experience.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
          <div className="grid grid-cols-3 gap-y-10 gap-x-6">
            {socialPlatforms.map((platform) => {
              const handleClick = (e: React.MouseEvent) => {
                triggerShareMutation();
                if ('isCopyOnly' in platform && platform.isCopyOnly) {
                  e.preventDefault();
                  handleCopy();
                  setActiveInfoPlatform(platform);
                }
              };

              return (
                <a
                  key={platform.name}
                  href={'url' in platform ? platform.url : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleClick}
                  className="flex flex-col items-center gap-3 group no-underline transition-all duration-300"
                >
                  <div className={`${platform.color} w-16 h-16 rounded-[22px] flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1 group-hover:rotate-[8deg] shadow-[0_10px_30px_rgba(0,0,0,0.5)] group-hover:shadow-[0_15px_35px_rgba(255,199,39,0.2)]`}>
                    <platform.icon className="w-8 h-8 text-white drop-shadow-md" />
                  </div>
                  <span className="text-[10px] font-bold text-neutral-500 group-hover:text-white transition-colors uppercase tracking-[0.15em]">
                    {platform.name}
                  </span>
                </a>
              );
            })}
          </div>

          <div className="mt-12 space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px bg-neutral-800 flex-1" />
              <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em]">or copy link</span>
              <div className="h-px bg-neutral-800 flex-1" />
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-linear-to-r from-[#FFC727] to-[#FBBE15] rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative flex items-center bg-neutral-900/80 backdrop-blur-xl border border-neutral-800/50 rounded-2xl p-4 transition-all duration-300">
                <span className="text-sm text-neutral-300 truncate pr-16 font-medium tracking-tight">
                  {shareUrl}
                </span>
                <button 
                  onClick={handleCopy}
                  className="absolute right-2.5 p-3 bg-[#FFC727] text-black rounded-xl hover:bg-yellow-500 transition-all duration-300 active:scale-95 shadow-lg group-hover:shadow-[#FFC727]/20"
                >
                  {copied ? <Check size={20} strokeWidth={3} /> : <Copy size={20} strokeWidth={2.5} />}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-8 border-t border-neutral-800/50 bg-neutral-900/30 backdrop-blur-md">
            <button 
              onClick={() => onOpenChange(false)}
              className="w-full py-4 rounded-2xl border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 font-bold uppercase tracking-[0.2em] transition-all active:scale-[0.98]"
            >
              Close
            </button>
        </div>
      </DrawerContent>
      <Dialog open={!!activeInfoPlatform} onOpenChange={(open) => !open && setActiveInfoPlatform(null)}>
        <DialogContent className="bg-[#121212] border-neutral-800 text-white max-w-[400px] rounded-3xl p-8">
          <DialogHeader className="items-center text-center gap-6">
            {activeInfoPlatform && (
              <div className={`${activeInfoPlatform.color} w-20 h-20 rounded-[28px] flex items-center justify-center shadow-2xl animate-in zoom-in duration-500`}>
                <activeInfoPlatform.icon className="w-10 h-10 text-white" />
              </div>
            )}
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-black tracking-tight">
                Share to {activeInfoPlatform?.name}
              </DialogTitle>
              <DialogDescription className="text-neutral-400 text-base leading-relaxed">
                The link has been copied to your clipboard! 
                <br />
                <span className="text-white font-medium">Instagram, TikTok, and Snapchat</span> are best shared directly through their mobile apps.
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="mt-8 flex flex-col gap-3">
            <button 
              onClick={() => setActiveInfoPlatform(null)}
              className="w-full py-4 bg-[#FFC727] text-black rounded-2xl font-black uppercase tracking-widest hover:bg-yellow-500 transition-all active:scale-95 shadow-[0_10px_20px_rgba(255,199,39,0.15)]"
            >
              Got it
            </button>
            <div className="flex items-center gap-2 justify-center text-neutral-500 text-[10px] font-bold uppercase tracking-widest mt-2">
              <Info size={12} />
              <span>Link is ready to paste</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Drawer>
  );
}

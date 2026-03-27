/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/navigation";
import { SocialUser } from "./types";

interface Props {
  user: SocialUser;
  // activeTab?: "following" | "followers" | "suggested";
  onToggleFollow: (userId: string) => void;
}

export default function UserRow({ user, onToggleFollow }: Props) {
  const label = user.actionLabel;

  // Button styling based on action state (TikTok/Instagram style)
  // "Follow" and "Follow back" = prominent yellow CTA
  // "Unfollow" = subdued outline style (like Instagram's gray "Following" button)
  const getButtonStyle = () => {
    switch (label) {
      case "Follow":
      case "Follow back":
        return "bg-[#FFC107] text-black hover:bg-[#e6ad00]";
      case "Unfollow":
        return "bg-transparent text-[#A1A1AA] border border-[#333] ";
      default:
        return "bg-white text-black";
    }
  };

  // Display text — show "Following" instead of "Unfollow" by default (Instagram style)
  // On hover it will switch to "Unfollow" via CSS group-hover
  const getDisplayText = () => {
    if (label === "Unfollow") return "Following";
    return label;
  };
const router = useRouter();
  return (
    <div className="flex items-center justify-between py-3 px-2 rounded-lg transition-colors hover:bg-white/5">
      
      {/* User Info */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => {router.push('/other-profile')}}>
        <div className="relative w-10 h-10 shrink-0">
          <img
            src={user.avatar || "/images/profile.png"}
            className="w-full h-full rounded-full object-cover border border-gray-800"
            alt={user.name}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null; 
              target.src = "/images/profile.png";
            }}
          />
        </div>

        <div className="flex flex-col leading-tight">
          <span className="text-white text-[14px] font-semibold">
            {user.name}
          </span>
          <span className="text-gray-500 text-[12px] mt-0.5">
            @{user.username}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onToggleFollow(user.id)}
        className={`min-w-[95px] px-4 py-1.5 rounded-full text-[11px] font-bold tracking-tight transition-all active:scale-95
          ${getButtonStyle()}`}
      >
        {label === "Unfollow" ? "Unfollow" : getDisplayText()}
      </button>
    </div>
  );
}
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart } from "lucide-react";

interface Comment {
  id: string;
  user: string;
  avatar?: string;
  time: string;
  text: string;
  replies?: number;
}

export default function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="flex items-start gap-3 py-4 px-3 border-b border-neutral-800 text-white">

      {/* Avatar */}
      <Avatar className="h-10 w-10">
        {comment.avatar ? (
          <AvatarImage src={comment.avatar} />
        ) : (
          <AvatarFallback>{comment.user[0]}</AvatarFallback>
        )}
      </Avatar>

      {/* Comment Content */}
      <div className="flex flex-col flex-1">

        {/* Row: Name + Time + Heart */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{comment.user}</span>
            <span className="text-xs text-neutral-400">{comment.time}</span>
          </div>

          {/* Heart Icon */}
          <Heart
            size={18}
            strokeWidth={1.5}
            className="text-neutral-400 hover:text-white cursor-pointer"
          />
        </div>

        {/* Text */}
        <p className="text-sm mt-1">{comment.text}</p>

        {/* Replies Area */}
        {comment.replies ? (
          <button className="text-xs text-neutral-400 mt-2 flex items-center gap-1">
            View {comment.replies} replies ▼
          </button>
        ) : null}

        {/* Reply Button (top right in screenshot) */}
        <div className="flex justify-end">
          <button className="text-xs text-neutral-400 hover:text-neutral-200">
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}

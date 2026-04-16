import { Clock } from "lucide-react";

export default function ContentModerationComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <Clock size={32} className="text-gray-400" />
      </div>
      <h1 className="text-2xl font-bold text-[#1e293b] mb-2">Content Moderation</h1>
      <p className="text-gray-500 max-w-md">
        This view is coming soon.
      </p>
    </div>
  );
}

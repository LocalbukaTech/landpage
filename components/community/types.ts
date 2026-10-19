export type DashboardTab =
  | "Overview"
  | "Content and feed management"
  | "Members"
  | "Monetization"
  | "Settings";

export interface CommunityMember {
  id: string;
  name: string;
  username: string;
  avatar: string;
  joinDate: string;
  status: "Active" | "Cancelled" | "Expiring soon";
}

export interface CommunityPost {
  id: string;
  communityName: string;
  communityAvatar: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  timestamp: string;
  caption: string;
  mediaUrl: string;
  likes: string;
  comments: string;
  bookmarks: string;
  shares: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
  isPinned?: boolean;
}

export interface CommunitySettings {
  name: string;
  bio: string;
  pricePerMonth: number;
  benefits: string[];
  coverImage: string;
  visibility: boolean;
}

export type MobileCommunityScreen =
  | "explore"
  | "paid-details"
  | "subscribe"
  | "success"
  | "failed"
  | "free-details"
  | "feed"
  | "empty"
  | "notifications";

export type BillingPeriod = "monthly" | "yearly";

export interface MobileCommunityItem {
  id: string;
  name: string;
  creator: string;
  ownerLine: string;
  members: string;
  posts: string;
  priceBadge: string;
  priceAmount: number;
  yearlyPriceAmount: number;
  isFree: boolean;
  image: string;
  accent: "yellow" | "green" | "blue" | "rose";
  description: string;
  benefits?: string[];
  shares?: {
    id: string;
    icon: "recipe" | "chat" | "media";
    title: string;
  }[];
  recentPostImage?: string;
}

export interface CommunityComment {
  id: string;
  author: string;
  text: string;
  timeAgo?: string;
  avatar?: string;
}

export interface MobileNotificationItem {
  id: string;
  type: "like" | "post" | "follow" | "restaurant" | "reply";
  avatar: string;
  title: string;
  subtitle?: string;
  time: string;
  thumbnail?: string;
  isNew?: boolean;
  restaurantCard?: {
    name: string;
    rating: string;
    reviews: string;
    address: string;
    image: string;
  };
}

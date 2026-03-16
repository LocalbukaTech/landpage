export interface Video {
  id: string;
  src: string;
  username: string;
  isVerified: boolean;
  hashtags: string[];
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  reposts?: number;
}

export interface VideoAction {
  icon: React.ReactNode;
  count: number;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}

export interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
}

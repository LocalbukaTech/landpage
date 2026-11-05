export interface BlockStatus {
  hasBlocked: boolean;
  isBlockedBy: boolean;
  isBlocked: boolean;
}

export interface BlockedUser {
  id: string;
  fullName: string;
  username?: string;
  avatar?: string | null;
  blockedAt: string;
}

export interface BlockedUsersResponse {
  data: BlockedUser[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface BlockUserResponse {
  isBlocked: boolean;
  blockerId: string;
  blockedId: string;
  message: string;
}

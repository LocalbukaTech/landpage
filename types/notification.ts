import {PostUser} from './post';

export type NotificationType =
  | 'like_post'
  | 'unlike_post'
  | 'follow'
  | 'unfollow'
  | 'repost'
  | 'comment'
  | 'mention'
  | 'referral_earned'
  | 'referral_welcome'
  | 'admin_points_credit'
  | 'admin_points_debit';

export type EntityType =
  | 'post'
  | 'user'
  | 'comment'
  | 'restaurant'
  | 'referral'
  | 'referral_earned'
  | 'referral_welcome'
  | 'admin_points_credit'
  | 'admin_points_debit'
  | 'rewards';

export interface Notification {
  id: string;
  recipientId: string;
  actorId: string;
  type: NotificationType;
  entityId: string;
  entityType: EntityType;
  message: string;
  isRead: boolean;
  createdAt: string;
  actor: PostUser;
}

export interface NotificationsResponse {
  data: Notification[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UnreadCountResponse {
  count: number;
}

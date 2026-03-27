/** Post author info (embedded in post responses) */
export interface PostUser {
  id: string;
  email?: string;
  fullName?: string;
  avatar?: string | null;
  username?: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string | null;
  isVerified?: boolean;
}

/** A single post (image or video) */
export interface Post {
  id: string;
  mediaUrl: string;
  thumbnailUrl: string | null;
  mediaType: 'image' | 'video';
  caption: string;
  tags: string[];
  likesCount?: number;
  likeCount?: number;
  commentsCount?: number;
  commentCount?: number;
  savesCount?: number;
  saveCount?: number;
  sharesCount?: number;
  shareCount?: number;
  repostsCount?: number;
  repostCount?: number;
  isLiked: boolean;
  isSaved: boolean;
  isReposted: boolean;
  createdAt: string;
  updatedAt: string;
  user: PostUser;
  restaurantId: string | null;
  restaurant?: {
    id: string;
    name: string;
  } | null;
}

/** Comment on a post */
export interface PostComment {
  id: string;
  postId: string;
  userId: string;
  text: string;
  parentId: string | null;
  likeCount: number;
  createdAt: string;
  updatedAt?: string;
  user: PostUser;
  replies: PostComment[];
}

/** Paginated posts response */
export interface PostsResponse {
  data: Post[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Paginated comments response */
export interface CommentsResponse {
  data: PostComment[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Params for listing posts */
export interface PostsQueryParams {
  userId?: string;
  restaurantId?: string;
  tag?: string;
  page?: number;
  pageSize?: number;
}

/** Params for personalised feed */
export interface FeedQueryParams {
  page?: number;
  pageSize?: number;
}

/** Params for listing comments */
export interface CommentsQueryParams {
  page?: number;
  pageSize?: number;
}

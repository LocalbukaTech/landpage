import type {Post} from '@/types/post';

export type StudioTab = 'overview' | 'videos' | 'images' | 'create' | 'edit';
export type UploadStep = 'PROHIBITION' | 'SELECT' | 'CROP' | 'DETAILS' | 'SUCCESS';

export interface StudioMetrics {
  totalPosts: number;
  videoPostsCount: number;
  imagePostsCount: number;
  totalLikes: number;
  videoPosts: Post[];
  imagePosts: Post[];
}

import {Metadata} from 'next';
import {postsService} from '@/lib/api/services/posts.service';
import {MainLayout} from '@/components/layout/MainLayout';
import {SinglePostViewClient} from './SinglePostViewClient';
import {Suspense} from 'react';
import {Loader2} from 'lucide-react';

interface PageProps {
  params: Promise<{id: string}>;
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {id} = await params;
  try {
    const response = await postsService.getPost(id);
    const post = (response as any)?.data?.data || (response as any)?.data || response;

    if (!post) throw new Error('Post not found');

    const title = `${post.user?.fullName || 'A user'} on LocalBuka`;
    const description = post.caption || 'Taste the world, one plate at a time with LocalBuka.';
    const imageUrl = post.mediaUrl;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{url: imageUrl}],
      },
    };
  } catch (_error) {
    return {
      title: 'View Post | LocalBuka',
      description: 'Discover authentic culinary experiences on LocalBuka.',
    };
  }
}

export default async function SinglePostViewPage({params}: PageProps) {
  const {id} = await params;
  let initialPost = null;

  try {
    const response = await postsService.getPost(id);
    initialPost = (response as any)?.data?.data || (response as any)?.data || response;
  } catch (e) {
    console.error('Error fetching post for internal single view:', e);
  }

  return (
    <MainLayout>
      <Suspense
        fallback={
          <div className='flex items-center justify-center h-full min-h-[60vh]'>
            <Loader2 className='w-8 h-8 animate-spin text-[#FFC727]' />
          </div>
        }>
        <SinglePostViewClient id={id} initialPost={initialPost} />
      </Suspense>
    </MainLayout>
  );
}

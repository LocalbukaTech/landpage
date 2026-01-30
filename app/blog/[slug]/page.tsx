
import {Metadata} from 'next';
import {notFound} from 'next/navigation';
import BlogDetailClient from '../components/BlogDetailClient';
import {blogService} from '@/lib/api/services/blog.service';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const params = await props.params;
    const {data} = await blogService.getBlogBySlug(params.slug);
    const blog = data.data;

    return {
      title: `${blog.title} | Localbuka`,
      description: blog.content.substring(0, 160).replace(/<[^>]*>/g, ''),
      openGraph: {
        title: blog.title,
        description: blog.content.substring(0, 160).replace(/<[^>]*>/g, ''),
        images: [blog.image_url],
      },
    };
  } catch (error) {
    return {
      title: 'Blog Not Found | Localbuka',
    };
  }
}

export default async function BlogDetailPage(props: Props) {
  const params = await props.params;

  // Pass slug to client - it will fetch using the getBlogBySlug endpoint
  return <BlogDetailClient slug={params.slug} />;
}

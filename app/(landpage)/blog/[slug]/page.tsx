import {Metadata} from 'next';
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

    const metaTitle = blog.meta_title?.trim() || `${blog.title} | Localbuka`;
    const metaDescription = blog.meta_description?.trim() || blog.content.substring(0, 160).replace(/<[^>]*>/g, '');

    return {
      title: metaTitle,
      description: metaDescription,
      openGraph: {
        title: blog.meta_title?.trim() || blog.title,
        description: metaDescription,
        images: [blog.image_url],
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
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

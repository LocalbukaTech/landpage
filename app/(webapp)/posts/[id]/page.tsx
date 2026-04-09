import {Metadata} from "next";
import {postsService} from "@/lib/api/services/posts.service";
import {MainLayout} from "@/components/layout/MainLayout";
import {PostClient} from "./PostClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const response = await postsService.getPost(id);
    const post = (response as any)?.data?.data || (response as any)?.data || response;
    
    if (!post) throw new Error("Post not found");

    const title = `${post.user?.fullName || "A user"} on LocalBuka`;
    const description = post.caption || "Taste the world, one plate at a time with LocalBuka.";
    const imageUrl = post.mediaUrl;
    const siteUrl = "https://www.localbuka.com";
    const postUrl = `${siteUrl}/posts/${id}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: postUrl,
        siteName: "LocalBuka",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        type: "video.other",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
        creator: "@localbuka",
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return {
      title: "Post | LocalBuka",
      description: "Discover authentic culinary experiences on LocalBuka.",
    };
  }
}

export default async function SinglePostPage({ params }: PageProps) {
  const { id } = await params;
  let initialPost = null;
  
  try {
    const response = await postsService.getPost(id);
    initialPost = (response as any)?.data?.data || (response as any)?.data || response;
  } catch (e) {
    console.error("Error fetching post for SSR:", e);
  }

  return (
    <MainLayout>
      <PostClient id={id} initialPost={initialPost} />
    </MainLayout>
  );
}

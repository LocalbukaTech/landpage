'use client';

import {useState, useCallback} from 'react';
import {useRouter} from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  X,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import {useEditor, EditorContent} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import {Button} from '@/components/ui/button';
import {useToast} from '@/hooks/use-toast';
import {blogPosts} from '@/lib/blog-data';

// Mock data for similar blogs dropdown
const availableBlogs = blogPosts.map((post) => ({
  id: post.id.toString(),
  title: post.title,
}));

const categories = [
  'Food Culture',
  'Nigerian Cuisine',
  'Tips & Tricks',
  'Restaurant Reviews',
  'Health & Food Science',
  'Sustainability',
  'Budget Tips',
  'Events',
  'Stories',
];

// Toolbar Button Component
const ToolbarButton = ({
  onClick,
  isActive,
  children,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  title: string;
}) => (
  <button
    type='button'
    onClick={onClick}
    title={title}
    className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
      isActive
        ? 'bg-gray-200 dark:bg-gray-700 text-primary'
        : 'text-gray-600 dark:text-gray-400'
    }`}>
    {children}
  </button>
);

const DemoCreateBlogPage = () => {
  const router = useRouter();
  const {toast} = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverImageAlt, setCoverImageAlt] = useState('');
  const [similarBlogs, setSimilarBlogs] = useState<string[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSimilarBlogsDropdown, setShowSimilarBlogsDropdown] =
    useState(false);

  // TipTap Editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5],
        },
      }),
      ImageExtension,
      LinkExtension.configure({
        openOnClick: false,
      }),
      Underline,
      Placeholder.configure({
        placeholder: 'Start writing your blog post...',
      }),
    ],
    content: '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'prose prose-lg max-w-none focus:outline-none min-h-[400px] dark:prose-invert',
      },
    },
  });

  // Handle cover image upload
  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle content image upload
  const addImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          editor
            ?.chain()
            .focus()
            .setImage({src: reader.result as string})
            .run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, [editor]);

  // Add link
  const addLink = useCallback(() => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor?.chain().focus().setLink({href: url}).run();
    }
  }, [editor]);

  // Toggle similar blog selection
  const toggleSimilarBlog = (blogId: string) => {
    setSimilarBlogs((prev) =>
      prev.includes(blogId)
        ? prev.filter((id) => id !== blogId)
        : prev.length < 3
        ? [...prev, blogId]
        : prev
    );
  };

  // Remove similar blog
  const removeSimilarBlog = (blogId: string) => {
    setSimilarBlogs((prev) => prev.filter((id) => id !== blogId));
  };

  // Save as draft
  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsSaved(true);
    toast({
      title: 'Draft saved',
      description: 'Your blog post has been saved as a draft.',
    });
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Publish post
  const handlePublish = async () => {
    if (!title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a title for your blog post.',
        variant: 'destructive',
      });
      return;
    }

    if (!editor?.getText().trim()) {
      toast({
        title: 'Content required',
        description: 'Please add some content to your blog post.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    toast({
      title: 'Blog post published!',
      description: 'Your blog post has been published successfully.',
    });
    router.push('/demo-blog-admin');
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950'>
      {/* Demo Header Banner */}
      <div className='bg-primary text-white py-2 px-4 text-center text-sm'>
        🎯 Demo Mode - Create New Blog Post
      </div>

      {/* Top Header Bar */}
      <div className='sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Link
              href='/demo-blog-admin'
              className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'>
              <ArrowLeft className='w-5 h-5' />
            </Link>
            <div>
              <input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='[Title]'
                className='text-xl font-bold bg-transparent border-none focus:outline-none text-foreground placeholder:text-gray-400 w-full'
              />
              <p className='text-sm text-muted-foreground'>New blog post</p>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            {isSaved && (
              <span className='flex items-center gap-1 text-sm text-green-600'>
                <div className='w-2 h-2 bg-green-600 rounded-full' />
                Saved
              </span>
            )}
            <Button
              variant='outline'
              onClick={handleSave}
              disabled={isSaving}
              className='border-gray-300'>
              {isSaving ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <>
                  <Save className='w-4 h-4 mr-2' />
                  Save
                </>
              )}
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isSaving}
              className='bg-primary hover:bg-primary/90 text-white'>
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex'>
        {/* Editor Section */}
        <div className='flex-1 p-6 max-w-4xl'>
          {/* Inner Title */}
          <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6'>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='[Title]'
              className='text-2xl font-bold bg-transparent border-none focus:outline-none text-foreground placeholder:text-gray-400 w-full mb-4'
            />

            {/* Toolbar */}
            <div className='flex flex-wrap items-center gap-1 border-b border-gray-200 dark:border-gray-700 pb-3 mb-4'>
              {/* Text Color */}
              <ToolbarButton onClick={() => {}} title='Text Color'>
                <span className='font-serif text-lg'>A</span>
              </ToolbarButton>

              {/* Link */}
              <ToolbarButton onClick={addLink} title='Add Link'>
                <svg
                  className='w-4 h-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
                  />
                </svg>
              </ToolbarButton>

              {/* Bold */}
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleBold().run()}
                isActive={editor?.isActive('bold')}
                title='Bold'>
                <span className='font-bold'>B</span>
              </ToolbarButton>

              {/* Italic */}
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                isActive={editor?.isActive('italic')}
                title='Italic'>
                <span className='italic'>I</span>
              </ToolbarButton>

              {/* Underline */}
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                isActive={editor?.isActive('underline')}
                title='Underline'>
                <span className='underline'>U</span>
              </ToolbarButton>

              {/* Strikethrough */}
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                isActive={editor?.isActive('strike')}
                title='Strikethrough'>
                <span className='line-through'>S</span>
              </ToolbarButton>

              {/* Font Size */}
              <ToolbarButton onClick={() => {}} title='Font Size'>
                <span className='text-sm'>16</span>
                <ChevronDown className='w-3 h-3 ml-0.5' />
              </ToolbarButton>

              <div className='w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1' />

              {/* Align Left */}
              <ToolbarButton onClick={() => {}} title='Align Left'>
                <svg
                  className='w-4 h-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h10M4 18h16'
                  />
                </svg>
              </ToolbarButton>

              {/* Align Center */}
              <ToolbarButton onClick={() => {}} title='Align Center'>
                <svg
                  className='w-4 h-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M7 12h10M4 18h16'
                  />
                </svg>
              </ToolbarButton>

              {/* Align Right */}
              <ToolbarButton onClick={() => {}} title='Align Right'>
                <svg
                  className='w-4 h-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M10 12h10M4 18h16'
                  />
                </svg>
              </ToolbarButton>

              <div className='w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1' />

              {/* Headings */}
              <ToolbarButton
                onClick={() =>
                  editor?.chain().focus().toggleHeading({level: 1}).run()
                }
                isActive={editor?.isActive('heading', {level: 1})}
                title='Heading 1'>
                <span className='text-sm font-bold'>H₁</span>
              </ToolbarButton>

              <ToolbarButton
                onClick={() =>
                  editor?.chain().focus().toggleHeading({level: 2}).run()
                }
                isActive={editor?.isActive('heading', {level: 2})}
                title='Heading 2'>
                <span className='text-sm font-bold'>H₂</span>
              </ToolbarButton>

              <ToolbarButton
                onClick={() =>
                  editor?.chain().focus().toggleHeading({level: 3}).run()
                }
                isActive={editor?.isActive('heading', {level: 3})}
                title='Heading 3'>
                <span className='text-sm font-bold'>H₃</span>
              </ToolbarButton>

              <ToolbarButton
                onClick={() =>
                  editor?.chain().focus().toggleHeading({level: 4}).run()
                }
                isActive={editor?.isActive('heading', {level: 4})}
                title='Heading 4'>
                <span className='text-sm font-bold'>H₄</span>
              </ToolbarButton>

              <ToolbarButton
                onClick={() =>
                  editor?.chain().focus().toggleHeading({level: 5}).run()
                }
                isActive={editor?.isActive('heading', {level: 5})}
                title='Heading 5'>
                <span className='text-sm font-bold'>H₅</span>
              </ToolbarButton>

              <div className='w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1' />

              {/* Ordered List */}
              <ToolbarButton
                onClick={() =>
                  editor?.chain().focus().toggleOrderedList().run()
                }
                isActive={editor?.isActive('orderedList')}
                title='Numbered List'>
                <svg
                  className='w-4 h-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M7 8h10M7 12h10M7 16h10M3 8h.01M3 12h.01M3 16h.01'
                  />
                </svg>
              </ToolbarButton>

              {/* Bullet List */}
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                isActive={editor?.isActive('bulletList')}
                title='Bullet List'>
                <svg
                  className='w-4 h-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01'
                  />
                </svg>
              </ToolbarButton>

              <div className='w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1' />

              {/* Link */}
              <ToolbarButton onClick={addLink} title='Insert Link'>
                <svg
                  className='w-4 h-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
                  />
                </svg>
              </ToolbarButton>

              {/* Code */}
              <ToolbarButton
                onClick={() => editor?.chain().focus().toggleCode().run()}
                isActive={editor?.isActive('code')}
                title='Code'>
                <svg
                  className='w-4 h-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
                  />
                </svg>
              </ToolbarButton>

              {/* Image */}
              <ToolbarButton onClick={addImage} title='Insert Image'>
                <ImageIcon className='w-4 h-4' />
              </ToolbarButton>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} />

            {/* Subtitle */}
            <div className='mt-6 pt-4 border-t border-gray-200 dark:border-gray-700'>
              <input
                type='text'
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder='[Subtitle]'
                className='text-lg bg-transparent border-none focus:outline-none text-muted-foreground placeholder:text-gray-400 w-full'
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className='w-80 p-6 border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50'>
          {/* Cover Image */}
          <div className='mb-6'>
            <h3 className='font-semibold text-foreground mb-3'>Cover Image</h3>
            <div className='relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600'>
              {coverImage ? (
                <>
                  <Image
                    src={coverImage}
                    alt='Cover'
                    fill
                    className='object-cover'
                  />
                  <button
                    onClick={() => setCoverImage(null)}
                    className='absolute top-2 right-2 p-1 bg-white dark:bg-gray-800 rounded-full shadow'>
                    <X className='w-4 h-4' />
                  </button>
                </>
              ) : (
                <label className='flex flex-col items-center justify-center h-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'>
                  <ImageIcon className='w-8 h-8 text-gray-400 mb-2' />
                  <span className='text-sm text-gray-500'>Upload Image</span>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleCoverImageUpload}
                    className='hidden'
                  />
                </label>
              )}
            </div>
            <button className='text-sm text-primary hover:underline mt-2'>
              Edit Cover Image
            </button>
            <div className='mt-3'>
              <label className='text-sm text-muted-foreground'>Alt Text</label>
              <input
                type='text'
                value={coverImageAlt}
                onChange={(e) => setCoverImageAlt(e.target.value)}
                placeholder='Food in a...'
                className='w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent'
              />
            </div>
          </div>

          {/* Category */}
          <div className='mb-6'>
            <h3 className='font-semibold text-foreground mb-3'>Category</h3>
            <div className='relative'>
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-left flex items-center justify-between'>
                <span
                  className={category ? 'text-foreground' : 'text-gray-400'}>
                  {category || 'Select category'}
                </span>
                <ChevronDown className='w-4 h-4' />
              </button>
              {showCategoryDropdown && (
                <>
                  <div
                    className='fixed inset-0 z-10'
                    onClick={() => setShowCategoryDropdown(false)}
                  />
                  <div className='absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto'>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setCategory(cat);
                          setShowCategoryDropdown(false);
                        }}
                        className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          category === cat ? 'bg-primary/10 text-primary' : ''
                        }`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Similar Blogs */}
          <div>
            <h3 className='font-semibold text-foreground mb-3'>
              Similar Blogs
            </h3>
            <div className='relative mb-3'>
              <button
                onClick={() =>
                  setShowSimilarBlogsDropdown(!showSimilarBlogsDropdown)
                }
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-left flex items-center justify-between'>
                <span className='text-gray-400'>Select</span>
                <ChevronDown className='w-4 h-4' />
              </button>
              {showSimilarBlogsDropdown && (
                <>
                  <div
                    className='fixed inset-0 z-10'
                    onClick={() => setShowSimilarBlogsDropdown(false)}
                  />
                  <div className='absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto'>
                    {availableBlogs.map((blog) => (
                      <button
                        key={blog.id}
                        onClick={() => toggleSimilarBlog(blog.id)}
                        disabled={
                          similarBlogs.length >= 3 &&
                          !similarBlogs.includes(blog.id)
                        }
                        className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed ${
                          similarBlogs.includes(blog.id)
                            ? 'bg-primary/10 text-primary'
                            : ''
                        }`}>
                        {blog.title.length > 35
                          ? blog.title.slice(0, 35) + '...'
                          : blog.title}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Selected Similar Blogs */}
            <div className='space-y-2'>
              {similarBlogs.map((blogId) => {
                const blog = availableBlogs.find((b) => b.id === blogId);
                return (
                  <div
                    key={blogId}
                    className='flex items-center justify-between px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg'>
                    <span className='text-sm text-primary truncate flex-1'>
                      [{blog?.title.slice(0, 20)}...]
                    </span>
                    <button
                      onClick={() => removeSimilarBlog(blogId)}
                      className='ml-2 text-red-500 hover:text-red-600'>
                      <X className='w-4 h-4' />
                    </button>
                  </div>
                );
              })}
              {similarBlogs.length < 3 && (
                <div className='px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg'>
                  <span className='text-sm text-gray-400'>[Blog Title]</span>
                </div>
              )}
            </div>
            <p className='text-xs text-muted-foreground mt-2'>
              Select up to 3 related blog posts
            </p>
          </div>
        </div>
      </div>

      {/* Editor Styles */}
      <style jsx global>{`
        .ProseMirror {
          min-height: 400px;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .ProseMirror h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .ProseMirror h2 {
          font-size: 2rem;
          font-weight: 600;
          color: #fbbe15;
          margin-bottom: 0.75rem;
        }
        .ProseMirror h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #0a1f44;
          margin-bottom: 0.5rem;
        }
        .ProseMirror h4 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .ProseMirror h5 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .ProseMirror p {
          margin-bottom: 1rem;
        }
        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #fbbe15;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #666;
        }
        .ProseMirror code {
          background: #f4f4f4;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-family: monospace;
        }
        .dark .ProseMirror h3 {
          color: white;
        }
        .dark .ProseMirror code {
          background: #374151;
        }
      `}</style>
    </div>
  );
};

export default DemoCreateBlogPage;

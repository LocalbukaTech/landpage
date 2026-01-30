'use client';

import {useState, useCallback, useEffect, useRef, Suspense} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  X,
  ChevronDown,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';
import {useEditor, EditorContent} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import {Button} from '@/components/ui/button';
import {useToast} from '@/hooks/use-toast';
import {useCreateBlogMutation} from '@/lib/api';
import {
  generateDraftId,
  getDraft,
  saveDraft,
  deleteDraft,
  dataUrlToFile,
  type BlogDraft,
} from '@/lib/blog-drafts';

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

const CreateBlogContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {toast} = useToast();
  const createBlogMutation = useCreateBlogMutation();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Draft ID - either from URL params or generate new
  const [draftId] = useState(() => {
    const urlDraftId = searchParams.get('draft');
    return urlDraftId || generateDraftId();
  });
  const isLoadingDraft = useRef(false);

  // Form state
  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  // Debug modal state
  const [showPayloadModal, setShowPayloadModal] = useState(false);
  const [payloadJson, setPayloadJson] = useState('');
  const [copied, setCopied] = useState(false);

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

  // Load draft from localStorage on mount
  useEffect(() => {
    // Wait for editor to be ready
    if (!editor) return;
    
    // Only load once
    if (isLoadingDraft.current) return;
    
    const urlDraftId = searchParams.get('draft');
    if (urlDraftId) {
      const existingDraft = getDraft(urlDraftId);
      if (existingDraft) {
        isLoadingDraft.current = true;
        setTitle(existingDraft.title);
        setCategory(existingDraft.category);
        setCoverImage(existingDraft.coverImage);
        editor.commands.setContent(existingDraft.content);
      }
    }
  }, [searchParams, editor]);

  // Save as draft to localStorage
  const handleSave = async () => {
    setIsSaving(true);
    
    const draft: BlogDraft = {
      id: draftId,
      title: title,
      content: editor?.getHTML() || '',
      category: category,
      coverImage: coverImage,
      updatedAt: new Date().toISOString(),
    };
    
    saveDraft(draft);
    setIsSaving(false);
    setIsSaved(true);
    toast({
      title: 'Draft saved',
      description: 'Your blog post has been saved as a draft.',
    });
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Publish post to API
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

    if (!category) {
      toast({
        title: 'Category required',
        description: 'Please select a category for your blog post.',
        variant: 'destructive',
      });
      return;
    }

    if (!coverImage) {
      toast({
        title: 'Cover image required',
        description: 'Please upload a cover image for your blog post.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Convert base64 image to File
      const imageFile = await dataUrlToFile(coverImage, 'cover-image.jpg');
      
      await createBlogMutation.mutateAsync({
        image: imageFile,
        title: title,
        content: editor?.getHTML() || '',
        category: category,
      });
      
      // Delete draft on successful publish
      deleteDraft(draftId);
      
      toast({
        title: 'Blog post published!',
        description: 'Your blog post has been published successfully.',
      });
      router.push('/secure-admin/blog');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to publish blog post. Please try again.';
      toast({
        title: 'Publish failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCopyPayload = async () => {
    try {
      await navigator.clipboard.writeText(payloadJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className='min-h-screen'>
      {/* Top Header Bar */}
      <div className='sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Link
              href='/secure-admin/blog'
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
      
      {/* Payload Debug Modal */}
      {showPayloadModal && (
        <>
          <div
            className='fixed inset-0 bg-black/60 z-9999 backdrop-blur-sm'
            onClick={() => setShowPayloadModal(false)}
          />
          <div className='fixed inset-0 z-9999 flex items-center justify-center p-4'>
            <div
              className='relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden'
              onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
                <h2 className='text-xl font-bold text-foreground'>
                  📝 Blog Post Preview
                </h2>
                <button
                  onClick={() => setShowPayloadModal(false)}
                  className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'>
                  <X className='w-5 h-5' />
                </button>
              </div>
              
              {/* Content - Rendered Preview */}
              <div className='p-6 overflow-y-auto max-h-[70vh]'>
                {/* Cover Image */}
                {coverImage && (
                  <div className='mb-6 rounded-xl overflow-hidden'>
                    <img 
                      src={coverImage} 
                      alt='Cover' 
                      className='w-full h-64 object-cover'
                    />
                  </div>
                )}
                
                {/* Title */}
                <h1 className='text-3xl font-bold text-foreground mb-6'>
                  {title || '[No Title]'}
                </h1>
                
                {/* Rendered HTML Content */}
                <div 
                  className='prose prose-lg dark:prose-invert max-w-none'
                  dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }}
                />
                
                {/* JSON Payload Section */}
                <div className='mt-8 pt-6 border-t border-gray-200 dark:border-gray-700'>
                  <h3 className='text-sm font-semibold text-muted-foreground mb-3'>
                    Raw JSON Payload:
                  </h3>
                  <pre className='bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap text-gray-800 dark:text-gray-200'>
                    {payloadJson}
                  </pre>
                </div>
              </div>
              
              {/* Footer */}
              <div className='flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700'>
                <Button
                  variant='outline'
                  onClick={() => setShowPayloadModal(false)}>
                  Close
                </Button>
                <Button
                  onClick={handleCopyPayload}
                  className={copied ? 'bg-green-600 hover:bg-green-600' : ''}>
                  {copied ? (
                    <>
                      <Check className='w-4 h-4 mr-2' />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className='w-4 h-4 mr-2' />
                      Copy JSON
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const CreateBlogPage = () => {
  return (
    <Suspense fallback={
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </div>
    }>
      <CreateBlogContent />
    </Suspense>
  );
};

export default CreateBlogPage;

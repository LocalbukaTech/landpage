'use client';

import {useState, useMemo, Suspense} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {StudioLayout} from '@/components/studio/StudioLayout';
import {StudioOverviewTab} from '@/components/studio/StudioOverviewTab';
import {StudioVideosTab} from '@/components/studio/StudioVideosTab';
import {StudioImagesTab} from '@/components/studio/StudioImagesTab';
import {StudioEditorTab} from '@/components/studio/StudioEditorTab';
import type {StudioTab, UploadStep, StudioMetrics} from '@/components/studio/types';
import type {Post} from '@/types/post';
import {useCreatePost, useUpdatePost, usePost, useDeletePost} from '@/lib/api/services/posts.hooks';
import {useMe, useAcceptContentPolicy} from '@/lib/api/services/auth.hooks';
import {useUserPosts} from '@/lib/api/services/profile.hooks';
import {Loader2} from 'lucide-react';
import {useToast} from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

function LocalbukaStudioDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editPostId = searchParams.get('edit');
  const initialTabParam = searchParams.get('tab') as StudioTab | null;

  // Active Studio Tab state
  const [activeTab, setActiveTab] = useState<StudioTab>(() => {
    if (editPostId) return 'edit';
    if (initialTabParam && ['overview', 'videos', 'images', 'create'].includes(initialTabParam)) {
      return initialTabParam;
    }
    return 'overview';
  });

  // User and user posts data
  const {data: meResponse, isLoading: isLoadingMe} = useMe();
  const currentUser = (meResponse as any)?.data?.data || (meResponse as any)?.data;
  const currentUserId = currentUser?.id || currentUser?._id || '';

  const {data: userPostsResponse, isLoading: isLoadingPosts, refetch: refetchPosts} = useUserPosts(
    currentUserId,
    {page: 1, pageSize: 50}
  );

  const rawPostsData = (userPostsResponse as any)?.data || userPostsResponse;
  const postsList: Post[] = useMemo(() => {
    if (Array.isArray(rawPostsData)) return rawPostsData;
    if (Array.isArray(rawPostsData?.data)) return rawPostsData.data;
    if (Array.isArray(rawPostsData?.posts)) return rawPostsData.posts;
    return [];
  }, [rawPostsData]);

  // Edit Post data
  const {data: existingPostResponse} = usePost(editPostId || '', {
    enabled: Boolean(editPostId),
  });
  const existingPost = (existingPostResponse as any)?.data || existingPostResponse || null;

  // Post Mutations
  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();
  const acceptPolicyMutation = useAcceptContentPolicy();
  const {toast} = useToast();

  // Delete State
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  // Upload/Edit Workflow state inside Studio
  const [manualStep, setManualStep] = useState<UploadStep | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [cropIndices, setCropIndices] = useState<number[]>([]);
  const [currentCropPointer, setCurrentCropPointer] = useState<number>(0);

  const initialStep = useMemo<UploadStep | null>(() => {
    if (isLoadingMe) return null;
    if (editPostId) return 'DETAILS';
    const hasAccepted = currentUser?.hasAcceptedContentPolicy === true;
    return hasAccepted ? 'SELECT' : 'PROHIBITION';
  }, [currentUser, isLoadingMe, editPostId]);

  const step = manualStep ?? initialStep ?? 'SELECT';
  const setStep = (s: UploadStep) => setManualStep(s);

  // Metrics computation
  const metrics: StudioMetrics = useMemo(() => {
    const totalPosts = postsList.length;
    const videoPosts = postsList.filter(
      (p) => p.mediaType === 'video' || p.mediaUrl?.match(/\.(mp4|mov|webm)$/i)
    );
    const imagePosts = postsList.filter(
      (p) => p.mediaType === 'image' || !p.mediaUrl?.match(/\.(mp4|mov|webm)$/i)
    );
    const totalLikes = postsList.reduce(
      (acc, p) => acc + (p.likeCount || p.likesCount || 0),
      0
    );

    return {
      totalPosts,
      videoPostsCount: videoPosts.length,
      imagePostsCount: imagePosts.length,
      totalLikes,
      videoPosts,
      imagePosts,
    };
  }, [postsList]);

  // Handlers
  const handleOpenCreate = () => {
    if (editPostId) {
      router.push('/studio');
    }
    setActiveTab('create');
    setStep('SELECT');
    setSelectedFiles([]);
  };

  const handleEditClick = (postId: string) => {
    router.push(`/studio?edit=${postId}`);
    setActiveTab('edit');
    setStep('DETAILS');
  };

  const handleDeleteConfirm = () => {
    if (!postToDelete) return;
    deletePostMutation.mutate(postToDelete.id, {
      onSuccess: () => {
        toast({
          title: 'Post deleted',
          description: 'Your post was deleted successfully.',
        });
        setPostToDelete(null);
        refetchPosts();
      },
      onError: () => {
        toast({
          title: 'Error deleting post',
          description: 'Failed to delete post. Please try again.',
          variant: 'destructive',
        });
      },
    });
  };

  const handleAcceptTerms = () => {
    acceptPolicyMutation.mutate(undefined, {
      onSuccess: () => setStep('SELECT'),
      onError: () => setStep('SELECT'),
    });
  };

  const handleRefuseTerms = () => {
    setActiveTab('overview');
  };

  const handleFileSelect = (files: File[]) => {
    if (files.length === 0) return;
    const hasVideo = files.some((file) => file.type.startsWith('video/'));

    if (hasVideo) {
      const videoFile = files.find((file) => file.type.startsWith('video/'))!;
      setSelectedFiles([videoFile]);
      setStep('DETAILS');
    } else {
      const indicesToCrop = files.map((_, i) => i);
      setSelectedFiles(files);
      setCropIndices(indicesToCrop);
      setCurrentCropPointer(0);
      setStep('CROP');
    }
  };

  const handleCropSuccess = (croppedFile: File) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles[cropIndices[currentCropPointer]] = croppedFile;
    setSelectedFiles(updatedFiles);

    if (currentCropPointer < cropIndices.length - 1) {
      setCurrentCropPointer((prev) => prev + 1);
    } else {
      setStep('DETAILS');
    }
  };

  const handlePost = (data: {
    description: string;
    imageCaptions?: string[];
    tags: string[];
    location: string;
    restaurantId?: string;
  }) => {
    // EDIT MODE
    if (editPostId) {
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        const isVideo = selectedFiles[0].type.startsWith('video/');
        formData.append('mediaType', isVideo ? 'video' : 'image');

        if (isVideo) {
          formData.append('media', selectedFiles[0]);
          if (data.description) formData.append('caption', data.description);
        } else {
          selectedFiles.forEach((file) => formData.append('media', file));
          if (data.description) formData.append('caption', data.description);
          if (data.imageCaptions && data.imageCaptions.length > 0) {
            data.imageCaptions.forEach((cap) => formData.append('imageCaptions', cap));
          }
        }
        if (data.location) formData.append('location', data.location);
        if (data.tags && data.tags.length > 0) {
          data.tags.forEach((tag) => formData.append('tags', tag));
        }
        if (data.restaurantId) formData.append('restaurantId', data.restaurantId);

        updatePostMutation.mutate(
          {id: editPostId, data: formData},
          {
            onSuccess: () => {
              toast({
                title: 'Post updated! 🎉',
                description: 'Your changes have been saved.',
              });
              refetchPosts();
              router.push('/studio');
              setActiveTab('overview');
            },
            onError: (err: any) => {
              toast({
                title: 'Update failed',
                description: err?.response?.data?.message || 'Failed to update post.',
                variant: 'destructive',
              });
            },
          }
        );
      } else {
        const jsonData: Record<string, any> = {
          caption: data.description,
          imageCaptions: data.imageCaptions,
          location: data.location,
          tags: data.tags,
          restaurantId: data.restaurantId,
        };

        updatePostMutation.mutate(
          {id: editPostId, data: jsonData},
          {
            onSuccess: () => {
              toast({
                title: 'Post updated! 🎉',
                description: 'Your changes have been saved.',
              });
              refetchPosts();
              router.push('/studio');
              setActiveTab('overview');
            },
            onError: (err: any) => {
              toast({
                title: 'Update failed',
                description: err?.response?.data?.message || 'Failed to update post.',
                variant: 'destructive',
              });
            },
          }
        );
      }
      return;
    }

    // CREATE MODE
    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    const isVideo = selectedFiles[0].type.startsWith('video/');
    formData.append('mediaType', isVideo ? 'video' : 'image');

    if (isVideo) {
      formData.append('media', selectedFiles[0]);
      if (data.description) formData.append('caption', data.description);
    } else {
      selectedFiles.forEach((file) => formData.append('media', file));
      if (data.description) formData.append('caption', data.description);
      if (data.imageCaptions && data.imageCaptions.length > 0) {
        data.imageCaptions.forEach((cap) => formData.append('imageCaptions', cap));
      }
    }

    if (data.location) formData.append('location', data.location);
    if (data.tags && data.tags.length > 0) {
      data.tags.forEach((tag) => formData.append('tags', tag));
    }
    if (data.restaurantId) formData.append('restaurantId', data.restaurantId);

    createPostMutation.mutate(formData, {
      onSuccess: () => {
        setStep('SUCCESS');
        refetchPosts();
      },
      onError: (error) => {
        console.error('Upload failed', error);
        toast({
          title: 'Upload failed',
          description: 'Failed to upload post. Please try again.',
          variant: 'destructive',
        });
      },
    });
  };

  const handleAddFiles = (newFiles: File[]) => {
    const newImages = newFiles.filter((file) => file.type.startsWith('image/'));
    if (newImages.length === 0) return;

    const startIndex = selectedFiles.length;
    const updatedFiles = [...selectedFiles, ...newImages];
    const newCropIndices = newImages.map((_, i) => startIndex + i);

    setSelectedFiles(updatedFiles);
    setCropIndices(newCropIndices);
    setCurrentCropPointer(0);
    setStep('CROP');
  };

  const handleRemoveFile = (index: number) => {
    if (selectedFiles.length <= 1 && !editPostId) {
      handleDiscard();
      return;
    }
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleDiscard = () => {
    if (editPostId) {
      router.push('/studio');
      setActiveTab('overview');
      return;
    }
    setSelectedFiles([]);
    setCropIndices([]);
    setCurrentCropPointer(0);
    setStep('SELECT');
    setActiveTab('overview');
  };

  return (
    <StudioLayout
      activeTab={activeTab}
      onTabChange={(tab) => {
        if (editPostId && tab !== 'edit') {
          router.push('/studio');
        }
        setActiveTab(tab);
      }}
      onOpenCreate={handleOpenCreate}>
      {activeTab === 'overview' && (
        <StudioOverviewTab
          metrics={metrics}
          postsList={postsList}
          isLoadingPosts={isLoadingPosts}
          onOpenCreate={handleOpenCreate}
          onTabChange={setActiveTab}
          onEditClick={handleEditClick}
          onDeleteClick={(p) => setPostToDelete(p)}
        />
      )}

      {activeTab === 'videos' && (
        <StudioVideosTab
          videoPosts={metrics.videoPosts}
          onOpenCreate={handleOpenCreate}
          onEditClick={handleEditClick}
          onDeleteClick={(p) => setPostToDelete(p)}
        />
      )}

      {activeTab === 'images' && (
        <StudioImagesTab
          imagePosts={metrics.imagePosts}
          onOpenCreate={handleOpenCreate}
          onEditClick={handleEditClick}
          onDeleteClick={(p) => setPostToDelete(p)}
        />
      )}

      {(activeTab === 'create' || activeTab === 'edit') && (
        <StudioEditorTab
          step={step}
          editPostId={editPostId}
          existingPost={existingPost}
          selectedFiles={selectedFiles}
          cropIndices={cropIndices}
          currentCropPointer={currentCropPointer}
          isUploading={createPostMutation.isPending || updatePostMutation.isPending}
          onAcceptTerms={handleAcceptTerms}
          onRefuseTerms={handleRefuseTerms}
          onFileSelect={handleFileSelect}
          onCropSuccess={handleCropSuccess}
          onPost={handlePost}
          onAddFiles={handleAddFiles}
          onRemoveFile={handleRemoveFile}
          onDiscard={handleDiscard}
          onSuccessDone={() => {
            setActiveTab('overview');
            refetchPosts();
          }}
        />
      )}

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={!!postToDelete}
        onOpenChange={(open) => !open && setPostToDelete(null)}>
        <AlertDialogContent className='bg-[#121217] border-white/10 text-white rounded-3xl'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-lg font-bold text-white'>
              Delete post permanently?
            </AlertDialogTitle>
            <AlertDialogDescription className='text-zinc-400 text-sm'>
              This action cannot be undone. This post will be deleted from Localbuka and removed from community feeds.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='bg-transparent border-white/10 text-white hover:bg-white/10 rounded-xl font-semibold'>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className='bg-red-600 text-white hover:bg-red-700 font-bold rounded-xl'>
              Delete Post
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </StudioLayout>
  );
}

export default function StudioPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-[#0b0b0e] flex items-center justify-center'>
          <Loader2 className='w-10 h-10 animate-spin text-[#FBBE15]' />
        </div>
      }>
      <LocalbukaStudioDashboardContent />
    </Suspense>
  );
}

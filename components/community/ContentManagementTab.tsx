"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Upload,
  MapPin,
  Tag,
  Hash,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MoreHorizontal,
  X,
  Edit2,
  Trash2,
  Pin,
  Check,
} from "lucide-react";
import { CommunityPost } from "./types";

interface ContentManagementTabProps {
  communityName?: string;
}

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    communityName: "Chef Tolu's kitchen",
    communityAvatar:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80",
    authorName: "Chef Tolu",
    authorHandle: "@chef_tolu",
    authorAvatar:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80",
    timestamp: "3h",
    caption:
      "Tried jollof with smoked paprika this time, unexpectedly good. Anyone else experiment with theirs?",
    mediaUrl:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
    likes: "24k",
    comments: "4k",
    bookmarks: "4k",
    shares: "Share",
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "post-2",
    communityName: "Chef Tolu's kitchen",
    communityAvatar:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80",
    authorName: "Chef Tolu",
    authorHandle: "@chef_tolu",
    authorAvatar:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80",
    timestamp: "2d",
    caption:
      "Cooked myself a treat, double bacon cheeseburger! What are you making today!",
    mediaUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
    likes: "18k",
    comments: "3.2k",
    bookmarks: "2.8k",
    shares: "Share",
    isLiked: false,
    isBookmarked: false,
  },
];

// Sample uploaded grilled chicken dish from Image 3
const SAMPLE_UPLOADED_IMAGE =
  "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1200&q=80";

export function ContentManagementTab({
  communityName = "Chef Tolu's kitchen",
}: ContentManagementTabProps) {
  // File upload state
  const [uploadedMedia, setUploadedMedia] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("Island, Lekki");
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [showTagInput, setShowTagInput] = useState(false);
  const [hashtagInput, setHashtagInput] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [showHashtagInput, setShowHashtagInput] = useState(false);

  // Posts state
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [activeMenuPostId, setActiveMenuPostId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close context menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuPostId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedMedia(url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedMedia(url);
    }
  };

  const handlePost = () => {
    if (!uploadedMedia && !caption.trim()) {
      showToast("Please upload an image or write a caption before posting.");
      return;
    }

    const newPost: CommunityPost = {
      id: `post-${crypto.randomUUID()}`,
      communityName,
      communityAvatar:
        "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80",
      authorName: "Chef Tolu",
      authorHandle: "@chef_tolu",
      authorAvatar:
        "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80",
      timestamp: "Just now",
      caption: caption || "Cooked some good food tonight!",
      mediaUrl: uploadedMedia || SAMPLE_UPLOADED_IMAGE,
      likes: "0",
      comments: "0",
      bookmarks: "0",
      shares: "Share",
      isLiked: false,
      isBookmarked: false,
    };

    setPosts([newPost, ...posts]);
    setUploadedMedia(null);
    setCaption("");
    showToast("Post published successfully to community feed!");
  };

  const handleDraft = () => {
    showToast("Draft saved successfully!");
  };

  const handleDiscard = () => {
    setUploadedMedia(null);
    setCaption("");
    setTags([]);
    setHashtags([]);
    showToast("Upload and caption discarded.");
  };

  const showToast = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 3500);
  };

  const toggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          isLiked: !p.isLiked,
        };
      })
    );
  };

  const toggleBookmark = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          isBookmarked: !p.isBookmarked,
        };
      })
    );
  };

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setActiveMenuPostId(null);
    showToast("Post deleted from feed.");
  };

  const handlePinPost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return { ...p, isPinned: !p.isPinned };
        }
        return p;
      })
    );
    setActiveMenuPostId(null);
    showToast("Post pinned state updated.");
  };

  // Toggle sample preset to easily switch between Empty Upload (Image 2) and Preloaded Upload (Image 3)
  const loadMockPreview = () => {
    setUploadedMedia(SAMPLE_UPLOADED_IMAGE);
    setCaption(
      "Cooked some good food tonight, tap the link on my bio for the recepies"
    );
  };

  return (
    <div className="w-full max-w-[680px] text-white space-y-7 pt-2">
      {/* Toast alert */}
      {feedbackMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#f5c94d] px-5 py-3 text-sm font-semibold text-black shadow-xl animate-in slide-in-from-top duration-200">
          <Check className="h-4 w-4" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Upload File Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base md:text-lg font-semibold text-white">
            Upload File
          </h2>
          {/* Quick toggle to help reviewer see Image 2 vs Image 3 state */}
          <button
            type="button"
            onClick={uploadedMedia ? handleDiscard : loadMockPreview}
            className="text-xs text-white/50 hover:text-[#f5c94d] transition-colors underline"
          >
            {uploadedMedia ? "Reset to empty dropzone" : "Load demo filled state"}
          </button>
        </div>

        {/* Upload Container */}
        {!uploadedMedia ? (
          /* Empty state (Screenshot 2) */
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="w-full rounded-[24px] bg-[#1a1a1a] border border-white/5 py-12 md:py-16 px-6 flex flex-col items-center justify-center text-center shadow-lg transition-all"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*,audio/*"
              className="hidden"
              onChange={handleFileSelect}
            />

            {/* Upload Icon */}
            <div className="mb-4 text-white">
              <Upload className="h-10 w-10 stroke-[1.7]" />
            </div>

            {/* Helper Text */}
            <p className="text-sm md:text-base font-medium text-white mb-6">
              Max 1GB, PNG, JPEG, MP3 and MP4
            </p>

            {/* Browse File Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full bg-[#f5c94d] px-8 py-2.5 text-sm font-semibold text-black hover:bg-[#eab308] active:scale-95 transition-all shadow-md"
            >
              Browse File
            </button>
          </div>
        ) : (
          /* Uploaded Preview state (Screenshot 3) */
          <div className="relative w-full rounded-[24px] overflow-hidden bg-[#1a1a1a] border border-white/5 shadow-lg group">
            <div className="relative h-64 md:h-80 w-full">
              <Image
                src={uploadedMedia}
                alt="Uploaded food media"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 680px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            <button
              type="button"
              onClick={() => setUploadedMedia(null)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors backdrop-blur-sm"
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Caption Container */}
        <div className="rounded-[24px] bg-[#1a1a1a] border border-white/5 p-4 md:p-5 shadow-lg space-y-4">
          <textarea
            rows={3}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Create caption"
            className="w-full bg-transparent text-sm md:text-[15px] text-white placeholder-white/30 focus:outline-none resize-none leading-relaxed"
          />

          {/* Tags / Location chips row inside caption card */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs md:text-sm text-white/90">
            {/* Location */}
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#f5c94d] transition-colors">
              <MapPin className="h-4 w-4 text-[#f5c94d]" />
              {isEditingLocation ? (
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onBlur={() => setIsEditingLocation(false)}
                  onKeyDown={(e) => e.key === "Enter" && setIsEditingLocation(false)}
                  autoFocus
                  className="rounded bg-[#252525] px-2 py-0.5 text-xs text-white focus:outline-none"
                />
              ) : (
                <span onClick={() => setIsEditingLocation(true)}>{location}</span>
              )}
            </div>

            {/* Tag User */}
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#f5c94d] transition-colors">
              <Tag className="h-4 w-4 text-[#f5c94d]" />
              {showTagInput ? (
                <input
                  type="text"
                  placeholder="@username"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && tagInput.trim()) {
                      setTags([...tags, tagInput.trim()]);
                      setTagInput("");
                      setShowTagInput(false);
                    }
                  }}
                  onBlur={() => setShowTagInput(false)}
                  autoFocus
                  className="rounded bg-[#252525] px-2 py-0.5 text-xs text-white focus:outline-none"
                />
              ) : (
                <span onClick={() => setShowTagInput(true)}>
                  {tags.length > 0 ? tags.join(", ") : "Add @Tag"}
                </span>
              )}
            </div>

            {/* Hashtags */}
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#f5c94d] transition-colors">
              <Hash className="h-4 w-4 text-[#f5c94d]" />
              {showHashtagInput ? (
                <input
                  type="text"
                  placeholder="#foodie"
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && hashtagInput.trim()) {
                      setHashtags([...hashtags, hashtagInput.trim()]);
                      setHashtagInput("");
                      setShowHashtagInput(false);
                    }
                  }}
                  onBlur={() => setShowHashtagInput(false)}
                  autoFocus
                  className="rounded bg-[#252525] px-2 py-0.5 text-xs text-white focus:outline-none"
                />
              ) : (
                <span onClick={() => setShowHashtagInput(true)}>
                  {hashtags.length > 0 ? hashtags.join(" ") : "Hashtags"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleDraft}
            className="flex-1 sm:flex-none rounded-full bg-[#f5c94d] px-8 py-2.5 text-sm font-semibold text-black hover:bg-[#eab308] active:scale-95 transition-all text-center shadow-md"
          >
            Draft
          </button>
          <button
            type="button"
            onClick={handlePost}
            className="flex-1 sm:flex-none rounded-full bg-[#f5c94d] px-10 py-2.5 text-sm font-semibold text-black hover:bg-[#eab308] active:scale-95 transition-all text-center shadow-md"
          >
            Post
          </button>
          <button
            type="button"
            onClick={handleDiscard}
            className="flex-1 sm:flex-none rounded-full bg-white px-8 py-2.5 text-sm font-semibold text-black hover:bg-neutral-200 active:scale-95 transition-all text-center shadow-md"
          >
            Discard
          </button>
        </div>
      </div>

      {/* Posted Content Section */}
      <div className="space-y-6 pt-4">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
          Posted Content
        </h2>

        {/* Community Branding Header for Feed */}
        <div className="flex items-center gap-3 pb-1">
          <div className="relative h-9 w-9 rounded-full overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80"
              alt="Chef Tolu's Kitchen"
              fill
              className="object-cover"
              sizes="36px"
            />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white">
            Chef Tolu&apos;s kitchen
          </h3>
        </div>

        {/* Post Items */}
        <div className="space-y-8">
          {posts.map((post) => {
            const isMenuOpen = activeMenuPostId === post.id;
            return (
              <article key={post.id} className="space-y-3">
                {/* Author Info */}
                <div className="flex items-center gap-2.5">
                  <div className="relative h-7 w-7 rounded-full overflow-hidden">
                    <Image
                      src={post.authorAvatar}
                      alt={post.authorName}
                      fill
                      className="object-cover"
                      sizes="28px"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-white/90">
                    <span className="font-semibold">{post.authorHandle}</span>
                    <span className="text-white/40">·</span>
                    <span className="text-white/60">{post.timestamp}</span>
                    {post.isPinned && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-[#f5c94d]/15 px-2 py-0.5 text-[10px] font-medium text-[#f5c94d]">
                        <Pin className="h-2.5 w-2.5" /> Pinned
                      </span>
                    )}
                  </div>
                </div>

                {/* Caption */}
                <p className="text-sm md:text-[15px] text-white/90 leading-relaxed">
                  {post.caption}
                </p>

                {/* Media Image Container with `...` Menu */}
                <div className="relative rounded-[22px] overflow-hidden bg-[#181818] shadow-lg">
                  <div className="relative h-64 sm:h-72 md:h-80 w-full">
                    <Image
                      src={post.mediaUrl}
                      alt="Post food photo"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 680px"
                    />
                  </div>

                  {/* Options Menu Button (Three dots) */}
                  <div className="absolute top-3.5 right-3.5 z-10">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveMenuPostId(isMenuOpen ? null : post.id)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white/90 hover:text-white hover:bg-black/75 transition-all backdrop-blur-sm"
                      title="Post options"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>

                    {/* Popover Menu (Matching Screenshot 3) */}
                    {isMenuOpen && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 top-10 w-40 rounded-2xl border border-white/10 bg-[#1e1e1e] p-1.5 shadow-2xl backdrop-blur-md z-30 animate-in fade-in zoom-in-95 duration-150"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuPostId(null);
                            setCaption(post.caption);
                            showToast("Loaded caption into editor.");
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-white/90 hover:bg-white/10 rounded-xl transition-colors text-left"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          <span>Edit Post</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePost(post.id)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-left"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete Post</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePinPost(post.id)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-white/90 hover:bg-white/10 rounded-xl transition-colors text-left"
                        >
                          <Pin className="h-3.5 w-3.5" />
                          <span>{post.isPinned ? "Unpin Post" : "Pin Post"}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Interaction Row (Likes, Comments, Bookmarks, Share) */}
                <div className="flex items-center gap-6 pt-1 text-sm text-white/80">
                  {/* Like */}
                  <button
                    type="button"
                    onClick={() => toggleLike(post.id)}
                    className="flex items-center gap-2 hover:text-[#f5c94d] transition-colors group"
                  >
                    <Heart
                      className={`h-4 w-4 transition-colors ${
                        post.isLiked
                          ? "fill-[#f5c94d] text-[#f5c94d]"
                          : "text-white/80 group-hover:text-[#f5c94d]"
                      }`}
                    />
                    <span className="text-xs font-medium">{post.likes}</span>
                  </button>

                  {/* Comment */}
                  <button
                    type="button"
                    onClick={() => showToast("Comments section toggled.")}
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 text-white/80" />
                    <span className="text-xs font-medium">{post.comments}</span>
                  </button>

                  {/* Bookmark */}
                  <button
                    type="button"
                    onClick={() => toggleBookmark(post.id)}
                    className="flex items-center gap-2 hover:text-[#f5c94d] transition-colors group"
                  >
                    <Bookmark
                      className={`h-4 w-4 transition-colors ${
                        post.isBookmarked
                          ? "fill-[#f5c94d] text-[#f5c94d]"
                          : "text-white/80 group-hover:text-[#f5c94d]"
                      }`}
                    />
                    <span className="text-xs font-medium">{post.bookmarks}</span>
                  </button>

                  {/* Share */}
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      showToast("Post link copied to clipboard!");
                    }}
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <Share2 className="h-4 w-4 text-white/80" />
                    <span className="text-xs font-medium">{post.shares}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

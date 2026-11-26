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
  MessageSquareOff,
  Check,
  AlertTriangle,
  LocateFixed,
  Loader2,
  Users,
  UtensilsCrossed,
  User as UserIcon,
  FileText,
  Clock,
  RotateCcw,
} from "lucide-react";
import { CommunityPost } from "./types";
import {
  useCreateCommunityPost,
  useUpdateCommunityPost,
  useTogglePostSave,
  useExploreCommunities,
  useCommunityTagSuggestions,
} from "@/lib/api/services/community.hooks";
import { communityService } from "@/lib/api/services/community.service";
import { useRestaurants } from "@/lib/api/services/restaurants.hooks";
import apiClient from "@/lib/api/client";
import { storeMediaBlob, getMediaBlobUrl } from "@/lib/storage/media-storage";
import {
  getStoredCommentsForPost,
  saveCommentForPost,
} from "@/lib/storage/comments-storage";

export const DRAFTS_STORAGE_KEY = "localbuka_creator_drafts_v1";

export interface CreatorDraft {
  id: string;
  caption: string;
  mediaUrl?: string | null;
  mediaType?: "image" | "video";
  location?: string;
  tags: string[];
  hashtags: string[];
  communitySlug?: string;
  savedAt: string;
}

interface ContentManagementTabProps {
  communityName?: string;
  communitySlug?: string;
  communityAvatar?: string;
  authorName?: string;
  authorHandle?: string;
  authorAvatar?: string;
  posts?: CommunityPost[];
  onPostsChange?: (posts: CommunityPost[]) => void;
}

export const INITIAL_CREATOR_POSTS: CommunityPost[] = [];

// Sample uploaded grilled chicken dish from Image 3 & 5
const SAMPLE_UPLOADED_IMAGE =
  "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1200&q=80";

const ONE_GB_BYTES = 1024 * 1024 * 1024;
const USED_HASHTAGS_STORAGE_KEY = "localbuka_used_hashtags_v1";
const SEED_PLACEHOLDER_SLUGS = new Set([
  "nigeria-food",
  "chef-amaka",
  "street-food",
  "baking-desserts",
  "suya-grill",
]);

interface TagSuggestionItem {
  id: string;
  handle: string;
  label: string;
  subtitle: string;
  category: "person" | "community" | "buka";
}

export function ContentManagementTab({
  communityName = "My Community",
  communitySlug = "",
  communityAvatar = "/images/community/cover-1.jpg",
  authorName = "Creator",
  authorHandle,
  authorAvatar,
  posts: externalPosts,
  onPostsChange,
}: ContentManagementTabProps) {
  const createPostMutation = useCreateCommunityPost(communitySlug);
  const updatePostMutation = useUpdateCommunityPost();
  const togglePostSaveMutation = useTogglePostSave();
  const { data: exploreCommunitiesData } = useExploreCommunities();
  const { data: backendTagSuggestions } = useCommunityTagSuggestions();
  const { data: restaurantsData } = useRestaurants({ page: 1, pageSize: 15 });
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // File upload states
  const [uploadedMedia, setUploadedMedia] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedMediaType, setUploadedMediaType] = useState<"image" | "video">("image");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<
    Array<{ name: string; address: string }>
  >([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [showTagInput, setShowTagInput] = useState(false);
  const [tagFilterCategory, setTagFilterCategory] = useState<
    "all" | "person" | "community" | "buka"
  >("all");
  const [userSearchResults, setUserSearchResults] = useState<TagSuggestionItem[]>([]);

  const [hashtagInput, setHashtagInput] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [rememberedHashtags, setRememberedHashtags] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = window.localStorage.getItem(USED_HASHTAGS_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch {
        // ignore
      }
    }
    return [];
  });
  const [showHashtagInput, setShowHashtagInput] = useState(false);

  // Saved Drafts state
  const [drafts, setDrafts] = useState<CreatorDraft[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = window.localStorage.getItem(DRAFTS_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch {
        // ignore
      }
    }
    return [];
  });
  const [showDraftsModal, setShowDraftsModal] = useState(false);
  const [activeDraftBanner, setActiveDraftBanner] = useState<CreatorDraft | null>(null);
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [postCommentsMap, setPostCommentsMap] = useState<
    Record<string, Array<{ id: string; author: string; avatar: string; text: string; time: string }>>
  >({});
  const [newCommentInput, setNewCommentInput] = useState("");

  // Check for existing saved draft for this community on mount
  useEffect(() => {
    if (drafts.length > 0 && !caption && !uploadedMedia) {
      const match = drafts.find(
        (d) => !communitySlug || d.communitySlug === communitySlug
      );
      if (match) {
        setActiveDraftBanner(match);
      }
    }
  }, [communitySlug]);

  const locationBoxRef = useRef<HTMLDivElement>(null);
  const tagBoxRef = useRef<HTMLDivElement>(null);
  const hashtagBoxRef = useRef<HTMLDivElement>(null);

  // Live OpenStreetMap Nominatim location search (same as Buka page)
  useEffect(() => {
    if (!locationQuery.trim()) {
      setLocationSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingLocation(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            locationQuery.trim()
          )}&limit=6&countrycodes=ng`
        );
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item: any) => {
            const parts = String(item.display_name || "").split(",");
            const name = parts.slice(0, 2).map((p) => p.trim()).join(", ");
            const address = parts.slice(2, 4).map((p) => p.trim()).join(", ");
            return { name: name || locationQuery, address: address || "Nigeria" };
          });
          setLocationSuggestions(mapped);
        } else {
          setLocationSuggestions([
            { name: locationQuery.trim(), address: "Custom Location" },
          ]);
        }
      } catch {
        setLocationSuggestions([
          { name: locationQuery.trim(), address: "Custom Location" },
        ]);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [locationQuery]);

  // Live user search from backend /search?type=users when typing @tag
  useEffect(() => {
    const cleanQ = tagInput.replace(/^@/, "").trim();
    const timer = setTimeout(async () => {
      try {
        const res = await apiClient.get(`/search`, {
          params: { q: cleanQ || "a", type: "users" },
        });
        const rawUsers =
          res?.data?.data?.users ||
          res?.data?.users ||
          (Array.isArray(res?.data?.data) ? res.data.data : []);
        if (Array.isArray(rawUsers)) {
          setUserSearchResults(
            rawUsers.slice(0, 8).map((u: any) => {
              const handle =
                u.username ||
                (u.fullName || u.name || "user")
                  .toLowerCase()
                  .replace(/[^a-z0-9_]/g, "_");
              return {
                id: `user-${u.id || handle}`,
                handle: `@${handle}`,
                label: u.fullName || u.name || handle,
                subtitle: "Person · LocalBuka User",
                category: "person" as const,
              };
            })
          );
        }
      } catch {
        // ignore if unauthenticated
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [tagInput]);

  // Unified Tag Suggestions Pool: ONLY Real Users + Real Created Communities + Real Buka Restaurants (Zero Placeholders)
  const allTagSuggestions: TagSuggestionItem[] = (() => {
    const backendComms: TagSuggestionItem[] = (
      backendTagSuggestions?.communities || []
    ).filter((c) => !SEED_PLACEHOLDER_SLUGS.has(c.handle.replace(/^@/, "")));

    const exploreComms: TagSuggestionItem[] = (
      exploreCommunitiesData?.items || []
    )
      .filter((c) => !SEED_PLACEHOLDER_SLUGS.has(c.slug))
      .map((c) => ({
        id: `comm-${c.id}`,
        handle: `@${c.slug}`,
        label: c.name,
        subtitle: `Fellow Community · ${c.members}`,
        category: "community" as const,
      }));

    // Also include local creator community if created in this session
    const localCommItems: TagSuggestionItem[] = [];
    if (
      communityName &&
      communitySlug &&
      !SEED_PLACEHOLDER_SLUGS.has(communitySlug)
    ) {
      localCommItems.push({
        id: `comm-local-${communitySlug}`,
        handle: `@${communitySlug}`,
        label: communityName,
        subtitle: "Fellow Community · Active",
        category: "community",
      });
    }

    const bukaSpots: TagSuggestionItem[] = (restaurantsData?.data || [])
      .slice(0, 8)
      .map((r: any) => {
        const slug = (r.name || "buka")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_");
        return {
          id: `buka-${r.id}`,
          handle: `@${slug}`,
          label: r.name,
          subtitle: `Buka Restaurant · ${r.city || r.address || "Nigeria"}`,
          category: "buka" as const,
        };
      });

    const combined = [
      ...localCommItems,
      ...backendComms,
      ...exploreComms,
      ...userSearchResults,
      ...bukaSpots,
    ];
    const seen = new Set<string>();
    return combined.filter((item) => {
      if (seen.has(item.handle)) return false;
      seen.add(item.handle);
      if (
        tagFilterCategory !== "all" &&
        item.category !== tagFilterCategory
      ) {
        return false;
      }
      const q = tagInput.replace(/^@/, "").trim().toLowerCase();
      if (!q) return true;
      return (
        item.handle.toLowerCase().includes(q) ||
        item.label.toLowerCase().includes(q)
      );
    });
  })();

  // Request live high-accuracy browser GPS directly on click (so it never misreads stale cached coordinates)
  const handleUseCurrentGpsLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      showToast("Geolocation is not supported by your browser.");
      return;
    }

    setIsSearchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await r.json();
          const addr = data?.address || {};
          const streetOrArea =
            addr.road ||
            addr.neighbourhood ||
            addr.suburb ||
            addr.quarter ||
            addr.hamlet ||
            addr.village ||
            addr.city_district ||
            "";
          const cityOrState =
            addr.city ||
            addr.town ||
            addr.county ||
            addr.state ||
            "";
          const resolved = [streetOrArea, cityOrState]
            .filter(Boolean)
            .join(", ");
          setLocation(
            resolved ||
              data?.display_name?.split(",").slice(0, 2).join(", ") ||
              `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          );
        } catch {
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } finally {
          setIsSearchingLocation(false);
          setIsEditingLocation(false);
        }
      },
      (err) => {
        setIsSearchingLocation(false);
        showToast(
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied. Please type your location in the search box."
            : "Could not read GPS position. Please search your location above."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleAddTagItem = (rawTag: string) => {
    const clean = rawTag.trim().replace(/^@+/, "");
    if (!clean) return;
    const formatted = `@${clean}`;
    if (!tags.includes(formatted)) {
      setTags((prev) => [...prev, formatted]);
    }
    setTagInput("");
  };

  const persistRememberedHashtags = (newTags: string[]) => {
    setRememberedHashtags((prev) => {
      const merged = Array.from(new Set([...newTags, ...prev]));
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(
            USED_HASHTAGS_STORAGE_KEY,
            JSON.stringify(merged)
          );
        } catch {
          // ignore
        }
      }
      return merged;
    });
  };

  const handleAddHashtagItem = (rawHash: string) => {
    const parts = rawHash
      .split(/[\s,]+/)
      .map((p) => p.trim().replace(/^#+/, ""))
      .filter(Boolean);
    if (parts.length === 0) return;
    const formattedList = parts.map((p) => `#${p}`);
    setHashtags((prev) => {
      const next = [...prev];
      for (const formatted of formattedList) {
        if (!next.includes(formatted)) {
          next.push(formatted);
        }
      }
      return next;
    });
    persistRememberedHashtags(formattedList);
    setHashtagInput("");
  };

  // Posts state (synced with CreatorDashboard when provided)
  const [internalPosts, setInternalPosts] = useState<CommunityPost[]>(
    externalPosts ?? INITIAL_CREATOR_POSTS
  );
  const posts = externalPosts ?? internalPosts;

  const updatePosts = (
    updater: CommunityPost[] | ((prev: CommunityPost[]) => CommunityPost[])
  ) => {
    const next = typeof updater === "function" ? updater(posts) : updater;
    setInternalPosts(next);
    onPostsChange?.(next);
  };

  const [activeMenuPostId, setActiveMenuPostId] = useState<string | null>(null);
  const [disabledCommentsPostIds, setDisabledCommentsPostIds] = useState<
    string[]
  >([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const postedSectionRef = useRef<HTMLDivElement>(null);

  // Close context menu and dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setActiveMenuPostId(null);
      }
      if (locationBoxRef.current && !locationBoxRef.current.contains(target)) {
        setIsEditingLocation(false);
      }
      if (tagBoxRef.current && !tagBoxRef.current.contains(target)) {
        setShowTagInput(false);
      }
      if (hashtagBoxRef.current && !hashtagBoxRef.current.contains(target)) {
        setShowHashtagInput(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const processSelectedFile = (file: File) => {
    if (file.size > ONE_GB_BYTES) {
      setUploadError("Files larger than 1GB can't be uploaded");
      setUploadedMedia(null);
      setSelectedFile(null);
      return;
    }
    setUploadError(null);
    setSelectedFile(file);
    const isVideo = file.type.startsWith("video/");
    setUploadedMediaType(isVideo ? "video" : "image");

    // For images under 5MB, convert to data URL so it persists across tabs/reload
    if (!isVideo && file.size < 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setUploadedMedia(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      const url = URL.createObjectURL(file);
      setUploadedMedia(url);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const nextPostIdRef = useRef(1000);

  const handlePost = () => {
    if (!uploadedMedia && !caption.trim()) {
      showToast("Please upload an image or write a caption before posting.");
      return;
    }

    const nextId = nextPostIdRef.current++;
    const formattedTags = [
      ...tags.map((t) => (t.startsWith("@") ? t : `@${t}`)),
      ...hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)),
    ].join(" ");
    const fullCaption =
      [caption.trim() || "Cooked some good food tonight!", formattedTags]
        .filter(Boolean)
        .join(" ");

    const mediaToUse = uploadedMedia || "";
    const fileToUpload = selectedFile;
    const postId = editingPostId || `post-${nextId}`;
    const isEditing = Boolean(editingPostId);
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    const authorHandleFormatted =
      authorHandle ||
      `@${(authorName || communityName || "creator")
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "")}`;

    const newPost: CommunityPost = {
      id: postId,
      communityName,
      communitySlug,
      communityAvatar: communityAvatar || "/images/community/cover-1.jpg",
      authorName: authorName || communityName,
      authorHandle: authorHandleFormatted,
      authorAvatar:
        authorAvatar || communityAvatar || "/images/community/cover-1.jpg",
      timestamp: "Just now",
      caption: fullCaption,
      mediaUrl: mediaToUse,
      location: location || undefined,
      tags: [...tags],
      hashtags: [...hashtags],
      likes: "0",
      comments: "0",
      bookmarks: "0",
      shares: "Share",
      isLiked: false,
      isBookmarked: false,
    };

    // Upload media to Cloudinary first, then create or update post on backend
    setIsPosting(true);
    void (async () => {
      let mediaUrls: string[] = mediaToUse.startsWith("http")
        ? [mediaToUse]
        : [];

      if (fileToUpload) {
        try {
          const formData = new FormData();
          formData.append("file", fileToUpload);
          const uploadRes = await apiClient.post<any>("/images/upload", formData);
          const payload = uploadRes?.data;
          const remoteUrl =
            payload?.secure_url ||
            payload?.url ||
            payload?.data?.secure_url ||
            payload?.data?.url ||
            (typeof payload?.data === "string" ? payload.data : undefined);
          if (typeof remoteUrl === "string" && remoteUrl.startsWith("http")) {
            mediaUrls = [remoteUrl];
            updatePosts((prev) =>
              prev.map((p) =>
                p.id === postId ? { ...p, mediaUrl: remoteUrl } : p
              )
            );
          }
        } catch (err: any) {
          showToast(
            err?.response?.data?.message ||
              "Media upload failed — check connection and try again."
          );
        }
      }

      try {
        if (isEditing && uuidRegex.test(postId)) {
          await updatePostMutation.mutateAsync({
            postId,
            data: {
              content: fullCaption,
              mediaUrls,
              location: location || null,
              tags,
              hashtags,
            },
          });
        } else {
          const createdRes: any = await createPostMutation.mutateAsync({
            content: fullCaption,
            mediaUrls,
            location: location || undefined,
            tags,
            hashtags,
          });
          const realId = createdRes?.data?.id || createdRes?.id;
          if (typeof realId === "string" && uuidRegex.test(realId)) {
            updatePosts((prev) =>
              prev.map((p) => (p.id === postId ? { ...p, id: realId } : p))
            );
          }
        }
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message;
        if (msg) showToast(`Post sync warning: ${msg}`);
      }
    })();

    setTimeout(() => {
      if (isEditing) {
        updatePosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  caption: fullCaption,
                  mediaUrl: mediaToUse,
                  location: location || undefined,
                  tags: [...tags],
                  hashtags: [...hashtags],
                }
              : p
          )
        );
      } else {
        updatePosts((prev) => [newPost, ...prev]);
      }
      setEditingPostId(null);
      setUploadedMedia(null);
      setSelectedFile(null);
      setUploadError(null);
      setCaption("");
      setLocation("");
      setTags([]);
      setHashtags([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      if (activeDraftBanner) {
        handleDeleteDraft(activeDraftBanner.id);
      }
      setIsPosting(false);
      showToast(
        isEditing
          ? "Post updated successfully!"
          : "Post published successfully to community feed!"
      );
      setTimeout(() => {
        postedSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }, 400);
  };

  const handleDraft = async () => {
    if (
      !caption.trim() &&
      !uploadedMedia &&
      tags.length === 0 &&
      hashtags.length === 0
    ) {
      showToast("Please add content or media before saving as draft.");
      return;
    }

    const draftId = `draft-${Date.now()}`;
    let mediaRef = uploadedMedia;

    if (selectedFile) {
      const idbRef = await storeMediaBlob(draftId, selectedFile);
      if (idbRef) mediaRef = idbRef;
    }

    const newDraft: CreatorDraft = {
      id: draftId,
      caption: caption.trim(),
      mediaUrl: mediaRef,
      mediaType: uploadedMediaType,
      location: location.trim(),
      tags: [...tags],
      hashtags: [...hashtags],
      communitySlug: communitySlug || undefined,
      savedAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        month: "short",
        day: "numeric",
      }),
    };

    const nextDrafts = [newDraft, ...drafts.filter((d) => d.id !== draftId)];
    setDrafts(nextDrafts);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(nextDrafts));
      } catch {
        // ignore
      }
    }
    setActiveDraftBanner(null);
    showToast("Draft saved successfully! You can restore it anytime from Saved Drafts.");
  };

  const handleRestoreDraft = async (draft: CreatorDraft) => {
    setCaption(draft.caption || "");
    setLocation(draft.location || "");
    setTags(draft.tags || []);
    setHashtags(draft.hashtags || []);
    setUploadedMediaType(draft.mediaType || "image");

    if (draft.mediaUrl) {
      if (draft.mediaUrl.startsWith("idb://")) {
        const blobUrl = await getMediaBlobUrl(draft.mediaUrl);
        setUploadedMedia(blobUrl || draft.mediaUrl);
      } else {
        setUploadedMedia(draft.mediaUrl);
      }
    } else {
      setUploadedMedia(null);
    }
    setActiveDraftBanner(null);
    setShowDraftsModal(false);
    showToast("Draft restored to editor.");
  };

  const handleDeleteDraft = (draftId: string) => {
    const next = drafts.filter((d) => d.id !== draftId);
    setDrafts(next);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
    }
    if (activeDraftBanner?.id === draftId) {
      setActiveDraftBanner(null);
    }
    showToast("Draft deleted.");
  };

  const handleDiscard = () => {
    setEditingPostId(null);
    setUploadedMedia(null);
    setSelectedFile(null);
    setUploadError(null);
    setCaption("");
    setLocation("");
    setTags([]);
    setHashtags([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setActiveDraftBanner(null);
    showToast("Upload and caption discarded.");
  };

  const showToast = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 3500);
  };

  const toggleLike = (postId: string) => {
    updatePosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const nextLiked = !p.isLiked;
        const currentCount = parseInt(String(p.likes || '0').replace(/[^0-9]/g, '') || '0', 10);
        const nextCount = Math.max(0, currentCount + (nextLiked ? 1 : -1));
        return {
          ...p,
          isLiked: nextLiked,
          likes: String(nextCount),
        };
      })
    );
  };

  const toggleBookmark = (postId: string) => {
    let nextSavedState = false;
    updatePosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const nextSaved = !p.isBookmarked;
        nextSavedState = nextSaved;
        const currentCount = parseInt(String(p.bookmarks || '0').replace(/[^0-9]/g, '') || '0', 10);
        const nextCount = Math.max(0, currentCount + (nextSaved ? 1 : -1));

        if (typeof window !== 'undefined') {
          try {
            const raw = window.localStorage.getItem('localbuka_saved_posts_v1');
            const list = raw ? JSON.parse(raw) : [];
            const existing = Array.isArray(list) ? list : [];
            let nextList;
            if (nextSaved) {
              const itemToSave = {
                id: p.id,
                communityId: communitySlug,
                communityName,
                caption: p.caption,
                mediaUrl: p.mediaUrl,
                authorName: p.authorName,
                authorAvatar: p.authorAvatar,
                timestamp: p.timestamp,
                savedAt: new Date().toISOString(),
              };
              nextList = [itemToSave, ...existing.filter((item: any) => item.id !== p.id)];
            } else {
              nextList = existing.filter((item: any) => item.id !== p.id);
            }
            window.localStorage.setItem('localbuka_saved_posts_v1', JSON.stringify(nextList));
            window.dispatchEvent(new Event('localbuka_saved_posts_updated'));
          } catch {}
        }

        return {
          ...p,
          isBookmarked: nextSaved,
          bookmarks: String(nextCount),
        };
      })
    );
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(postId)) {
      togglePostSaveMutation.mutate(postId);
    }
    showToast(nextSavedState ? 'Post saved to bookmarks!' : 'Removed from saved.');
  };

  const handleDeletePost = async (postId: string) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    setActiveMenuPostId(null);
    updatePosts((prev) => prev.filter((p) => p.id !== postId));
    if (uuidRegex.test(postId)) {
      try {
        await communityService.deletePost(postId);
      } catch {
        // already removed locally
      }
    }
    showToast("Post deleted from feed.");
  };

  const handleArchivePost = async (postId: string) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    setActiveMenuPostId(null);
    updatePosts((prev) => prev.filter((p) => p.id !== postId));
    if (uuidRegex.test(postId)) {
      try {
        await updatePostMutation.mutateAsync({
          postId,
          data: { isArchived: true },
        });
      } catch {
        // ignore
      }
    }
    showToast("Post archived from public feed.");
  };

  const toggleTurnOffComments = (postId: string) => {
    setDisabledCommentsPostIds((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
    setActiveMenuPostId(null);
    showToast("Post comments setting updated.");
  };

  // ─────────────────────────────────────────────────────────
  // LOADING / SKELETON STATE (Figma Content Management Loading)
  // ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="w-full text-white pt-2">
        <div className="space-y-0">
          {/* Skeleton Box 1: Upload area (882x424, r:40) */}
          <div
            style={{
              width: '100%',
              maxWidth: '882px',
              height: '424px',
              borderRadius: '40px',
              backgroundColor: '#1E1E22',
              border: '1px solid rgba(255, 255, 255, 0.04)',
            }}
            className="flex flex-col items-center justify-center shadow-lg relative"
          >
            {/* Pill inside Box 1 (207x43, r:100) */}
            <div
              style={{
                width: '207px',
                height: '43px',
                borderRadius: '100px',
                backgroundColor: '#2A2A2E',
              }}
              className="animate-pulse"
            />
          </div>

          {/* Skeleton Box 2: Caption area (882x205, r:20, mt:28px) */}
          <div
            style={{
              width: '100%',
              maxWidth: '882px',
              height: '205px',
              borderRadius: '20px',
              backgroundColor: '#1E1E22',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              marginTop: '28px',
            }}
            className="shadow-lg animate-pulse"
          />

          {/* 3 Action Pill Skeletons (244x48 each, r:100, gap:22px) */}
          <div
            className="flex items-center"
            style={{
              maxWidth: '776px',
              gap: '22px',
              marginTop: '24px',
            }}
          >
            {[1, 2, 3].map((pill) => (
              <div
                key={pill}
                style={{
                  width: '244px',
                  height: '48px',
                  borderRadius: '100px',
                  backgroundColor: '#1E1E22',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                }}
                className="animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[680px] text-white space-y-7 pt-2">
      {/* Posting Spinner Overlay (339x339 SpinnerGap, blurred backdrop) */}
      {isPosting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
          <div
            className="animate-spin"
            style={{ width: '339px', height: '339px', animationDuration: '1.2s' }}
          >
            <svg width="339" height="339" viewBox="0 0 339 339" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M177.445 42.375V84.75C177.445 86.8572 176.608 88.8781 175.118 90.3682C173.628 91.8582 171.607 92.6953 169.5 92.6953C167.393 92.6953 165.372 91.8582 163.882 90.3682C162.392 88.8781 161.555 86.8572 161.555 84.75V42.375C161.555 40.2678 162.392 38.2468 163.882 36.7568C165.372 35.2668 167.393 34.4297 169.5 34.4297C171.607 34.4297 173.628 35.2668 175.118 36.7568C176.608 38.2468 177.445 40.2678 177.445 42.375ZM296.625 161.555H254.25C252.143 161.555 250.122 162.392 248.632 163.882C247.142 165.372 246.305 167.393 246.305 169.5C246.305 171.607 247.142 173.628 248.632 175.118C250.122 176.608 252.143 177.445 254.25 177.445H296.625C298.732 177.445 300.753 176.608 302.243 175.118C303.733 173.628 304.57 171.607 304.57 169.5C304.57 167.393 303.733 165.372 302.243 163.882C300.753 162.392 298.732 161.555 296.625 161.555ZM235.049 223.793C233.556 222.3 231.532 221.462 229.421 221.462C227.31 221.462 225.286 222.3 223.793 223.793C222.3 225.286 221.462 227.31 221.462 229.421C221.462 231.532 222.3 233.556 223.793 235.049L253.76 265.003C255.266 266.406 257.258 267.17 259.317 267.134C261.375 267.098 263.339 266.264 264.795 264.808C266.25 263.352 267.084 261.388 267.121 259.33C267.157 257.272 266.393 255.279 264.989 253.773L235.049 223.793ZM169.5 246.305C167.393 246.305 165.372 247.142 163.882 248.632C162.392 250.122 161.555 252.143 161.555 254.25V296.625C161.555 298.732 162.392 300.753 163.882 302.243C165.372 303.733 167.393 304.57 169.5 304.57C171.607 304.57 173.628 303.733 175.118 302.243C176.608 300.753 177.445 298.732 177.445 296.625V254.25C177.445 252.143 176.608 250.122 175.118 248.632C173.628 247.142 171.607 246.305 169.5 246.305ZM103.951 223.793L73.9973 253.773C73.2167 254.501 72.5906 255.378 72.1564 256.352C71.7221 257.327 71.4886 258.379 71.4698 259.446C71.4509 260.513 71.6472 261.572 72.0468 262.562C72.4464 263.551 73.0412 264.45 73.7957 265.204C74.5501 265.959 75.4488 266.554 76.4382 266.953C77.4275 267.353 78.4872 267.549 79.554 267.53C80.6208 267.511 81.6729 267.278 82.6475 266.844C83.6222 266.409 84.4993 265.783 85.2267 265.003L115.207 235.049C115.946 234.31 116.532 233.432 116.932 232.467C117.332 231.501 117.538 230.466 117.538 229.421C117.538 228.376 117.332 227.341 116.932 226.375C116.532 225.409 115.946 224.532 115.207 223.793C114.468 223.054 113.591 222.468 112.625 222.068C111.659 221.668 110.624 221.462 109.579 221.462C108.534 221.462 107.499 221.668 106.533 222.068C105.568 222.468 104.69 223.054 103.951 223.793ZM92.6953 169.5C92.6953 167.393 91.8582 165.372 90.3682 163.882C88.8781 162.392 86.8572 161.555 84.75 161.555H42.375C40.2678 161.555 38.2468 162.392 36.7568 163.882C35.2668 165.372 34.4297 167.393 34.4297 169.5C34.4297 171.607 35.2668 173.628 36.7568 175.118C38.2468 176.608 40.2678 177.445 42.375 177.445H84.75C86.8572 177.445 88.8781 176.608 90.3682 175.118C91.8582 173.628 92.6953 171.607 92.6953 169.5ZM85.2267 73.9973C83.7206 72.5939 81.7284 71.8298 79.6701 71.8661C77.6117 71.9025 75.6478 72.7363 74.192 74.192C72.7363 75.6478 71.9025 77.6117 71.8661 79.6701C71.8298 81.7284 72.5939 83.7206 73.9973 85.2267L103.951 115.207C105.444 116.7 107.468 117.538 109.579 117.538C111.69 117.538 113.714 116.7 115.207 115.207C116.7 113.714 117.538 111.69 117.538 109.579C117.538 107.468 116.7 105.444 115.207 103.951L85.2267 73.9973Z" fill="#FBBE15"/>
            </svg>
          </div>
        </div>
      )}

      {/* Toast alert */}
      {feedbackMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#f5c94d] px-5 py-3 text-sm font-semibold text-black shadow-xl animate-in slide-in-from-top duration-200">
          <Check className="h-4 w-4" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Saved Draft Restore Banner */}
      {activeDraftBanner && (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#1e1e1e] border border-[#f5c94d]/40 p-3.5 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <Clock className="w-4 h-4 text-[#f5c94d] shrink-0" />
            <div className="text-xs text-white min-w-0">
              <span className="font-semibold text-[#f5c94d]">Saved Draft: </span>
              <span className="text-white/70 truncate">
                {activeDraftBanner.caption || "Untitled upload"} · {activeDraftBanner.savedAt}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => void handleRestoreDraft(activeDraftBanner)}
              className="inline-flex items-center gap-1 rounded-full bg-[#f5c94d] px-3.5 py-1 text-xs font-bold text-black hover:bg-[#eab308] cursor-pointer active:scale-95 transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Load Draft</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveDraftBanner(null)}
              className="p-1 text-white/50 hover:text-white cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Upload File Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base md:text-lg font-semibold text-white">
            Upload File
          </h2>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,audio/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Upload Container States */}
        {uploadError ? (
          /* Error State (>1GB, Matching Screenshot 4) */
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="w-full rounded-[24px] bg-[#1a1a1a] border border-red-500/80 py-12 md:py-16 px-6 flex flex-col items-center justify-center text-center shadow-lg transition-all"
          >
            {/* Red Alert Triangle Icon */}
            <div className="mb-4 text-red-500">
              <AlertTriangle className="h-16 w-16 fill-red-500 stroke-red-500 stroke-1" />
            </div>

            {/* Error text */}
            <p className="text-sm md:text-base font-medium text-white mb-6">
              {uploadError}
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
        ) : !uploadedMedia ? (
          /* Empty state (Matching Screenshot 2) */
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="w-full rounded-[24px] bg-[#1a1a1a] border border-white/5 py-12 md:py-16 px-6 flex flex-col items-center justify-center text-center shadow-lg transition-all"
          >
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
          /* Uploaded Preview state (Matching Screenshot 5) */
          <div className="relative w-full rounded-[24px] overflow-hidden bg-[#1a1a1a] border border-white/5 shadow-lg group">
            <div className="relative h-64 md:h-80 w-full">
              {uploadedMediaType === "video" ? (
                <video
                  src={uploadedMedia}
                  controls
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={uploadedMedia}
                  alt="Uploaded food media"
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 680px"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
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

          {/* Tags / Location / Hashtags row inside caption card */}
          <div className="space-y-3 pt-2">
            {/* Active Selected Chips (Tags & Hashtags) */}
            {(tags.length > 0 || hashtags.length > 0) && (
              <div className="flex flex-wrap items-center gap-1.5">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-full bg-[#f5c94d]/15 border border-[#f5c94d]/35 px-2.5 py-0.5 text-xs font-semibold text-[#f5c94d]"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => setTags(tags.filter((x) => x !== t))}
                      className="hover:text-white cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {hashtags.map((h) => (
                  <span
                    key={h}
                    className="inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/15 px-2.5 py-0.5 text-xs font-medium text-white/90"
                  >
                    <span>{h}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setHashtags(hashtags.filter((x) => x !== h))
                      }
                      className="text-white/60 hover:text-white cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-white/90 relative">
              {/* 1. Location Search Dropdown (works just like Buka Page) */}
              <div ref={locationBoxRef} className="relative">
                <div
                  onClick={() => {
                    setIsEditingLocation(true);
                    setShowTagInput(false);
                    setShowHashtagInput(false);
                  }}
                  className="flex items-center gap-1.5 cursor-pointer hover:text-[#f5c94d] transition-colors"
                >
                  <MapPin className="h-4 w-4 text-[#f5c94d]" />
                  <span>{location || "Add Location"}</span>
                </div>

                {isEditingLocation && (
                  <div className="absolute left-0 top-7 z-40 w-72 rounded-2xl border border-[#f5c94d]/40 bg-[#18181b] p-3 shadow-2xl space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#f5c94d]" />
                        <span>Search Location (Buka Map)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsEditingLocation(false)}
                        className="text-zinc-400 hover:text-white cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Search city, area or address..."
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && locationQuery.trim()) {
                          e.preventDefault();
                          setLocation(locationQuery.trim());
                          setIsEditingLocation(false);
                        }
                      }}
                      autoFocus
                      className="w-full rounded-xl bg-[#242428] border border-white/10 px-3 py-2 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-[#f5c94d]"
                    />

                    {/* Use Current GPS Location Button */}
                    <button
                      type="button"
                      onClick={handleUseCurrentGpsLocation}
                      className="w-full flex items-center gap-2 rounded-xl bg-[#f5c94d]/15 hover:bg-[#f5c94d]/25 border border-[#f5c94d]/30 px-3 py-2 text-xs font-semibold text-[#f5c94d] transition-colors cursor-pointer text-left"
                    >
                      <LocateFixed className="h-3.5 w-3.5 shrink-0" />
                      <span>Use my current location</span>
                    </button>

                    {/* Live Suggestions List */}
                    <div className="max-h-44 overflow-y-auto space-y-1 pr-1">
                      {isSearchingLocation ? (
                        <div className="flex items-center justify-center py-4 text-xs text-zinc-400 gap-2">
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-[#f5c94d]" />
                          <span>Reading location...</span>
                        </div>
                      ) : locationSuggestions.length === 0 ? (
                        <p className="py-3 px-2 text-[11px] text-zinc-400 text-center">
                          Type your city, neighborhood, or street above, or tap &ldquo;Use my current location&rdquo;.
                        </p>
                      ) : (
                        locationSuggestions.map((loc, idx) => (
                          <button
                            key={`${loc.name}-${idx}`}
                            type="button"
                            onClick={() => {
                              setLocation(loc.name);
                              setLocationQuery("");
                              setIsEditingLocation(false);
                            }}
                            className="w-full flex flex-col items-start rounded-xl px-2.5 py-2 hover:bg-white/10 transition-colors text-left cursor-pointer"
                          >
                            <span className="text-xs font-semibold text-white">
                              {loc.name}
                            </span>
                            <span className="text-[10.5px] text-zinc-400">
                              {loc.address}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Real @Tagging Dropdown (Real People, Real Fellow Communities & Bukas) */}
              <div ref={tagBoxRef} className="relative">
                <div
                  onClick={() => {
                    setShowTagInput(true);
                    setIsEditingLocation(false);
                    setShowHashtagInput(false);
                  }}
                  className="flex items-center gap-1.5 cursor-pointer hover:text-[#f5c94d] transition-colors"
                >
                  <Tag className="h-4 w-4 text-[#f5c94d]" />
                  <span>
                    {tags.length > 0 ? tags.join(", ") : "Add @Tag"}
                  </span>
                </div>

                {showTagInput && (
                  <div className="absolute left-0 top-7 z-40 w-80 rounded-2xl border border-[#f5c94d]/40 bg-[#18181b] p-3 shadow-2xl space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5 text-[#f5c94d]" />
                        <span>Tag Real Person, Community or Buka</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowTagInput(false)}
                        className="text-zinc-400 hover:text-white cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Filter Pills: All | People | Communities | Bukas */}
                    <div className="flex items-center gap-1">
                      {(
                        [
                          { id: "all", label: "All" },
                          { id: "community", label: "Communities" },
                          { id: "person", label: "People" },
                          { id: "buka", label: "Bukas" },
                        ] as const
                      ).map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setTagFilterCategory(tab.id)}
                          className={`rounded-lg px-2 py-1 text-[10.5px] font-semibold transition-colors cursor-pointer ${
                            tagFilterCategory === tab.id
                              ? "bg-[#f5c94d] text-black"
                              : "bg-white/5 text-zinc-400 hover:text-white"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      placeholder="Search real @community, @user or @buka..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && tagInput.trim()) {
                          e.preventDefault();
                          handleAddTagItem(tagInput);
                        }
                      }}
                      autoFocus
                      className="w-full rounded-xl bg-[#242428] border border-white/10 px-3 py-2 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-[#f5c94d]"
                    />

                    <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                      {allTagSuggestions.length === 0 ? (
                        <p className="py-3 px-2 text-[11px] text-zinc-400 text-center">
                          No matching {tagFilterCategory === "all" ? "communities or users" : tagFilterCategory} found. Type a handle and press Enter.
                        </p>
                      ) : (
                        allTagSuggestions.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleAddTagItem(item.handle)}
                            className="w-full flex items-center justify-between gap-2 rounded-xl px-2.5 py-2 hover:bg-white/10 transition-colors text-left cursor-pointer"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#f5c94d]">
                                {item.category === "community" ? (
                                  <Users className="h-3.5 w-3.5" />
                                ) : item.category === "buka" ? (
                                  <UtensilsCrossed className="h-3.5 w-3.5" />
                                ) : (
                                  <UserIcon className="h-3.5 w-3.5" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-white truncate">
                                  {item.label}{" "}
                                  <span className="text-[#f5c94d] font-normal">
                                    {item.handle}
                                  </span>
                                </div>
                                <div className="text-[10px] text-zinc-400 truncate">
                                  {item.subtitle}
                                </div>
                              </div>
                            </div>
                            {tags.includes(item.handle) && (
                              <Check className="h-3.5 w-3.5 text-[#4ade80] shrink-0" />
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Real #Hashtags (Shows actual hashtag names like #foodie, remembers used hashtags, zero preset placeholders) */}
              <div ref={hashtagBoxRef} className="relative">
                <div
                  onClick={() => {
                    setShowHashtagInput(true);
                    setIsEditingLocation(false);
                    setShowTagInput(false);
                  }}
                  className="flex items-center gap-1.5 cursor-pointer hover:text-[#f5c94d] transition-colors"
                >
                  <Hash className="h-4 w-4 text-[#f5c94d]" />
                  <span>
                    {hashtags.length > 0 ? hashtags.join(" ") : "Hashtags"}
                  </span>
                </div>

                {showHashtagInput && (
                  <div className="absolute left-0 sm:left-auto sm:right-0 top-7 z-40 w-72 rounded-2xl border border-[#f5c94d]/40 bg-[#18181b] p-3 shadow-2xl space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Hash className="h-3.5 w-3.5 text-[#f5c94d]" />
                        <span>Add Hashtags</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowHashtagInput(false)}
                        className="text-zinc-400 hover:text-white cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Type #tag and press Enter or Space..."
                      value={hashtagInput}
                      onChange={(e) => setHashtagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (
                          (e.key === "Enter" ||
                            e.key === " " ||
                            e.key === ",") &&
                          hashtagInput.trim()
                        ) {
                          e.preventDefault();
                          handleAddHashtagItem(hashtagInput);
                        }
                      }}
                      autoFocus
                      className="w-full rounded-xl bg-[#242428] border border-white/10 px-3 py-2 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-[#f5c94d]"
                    />

                    {(() => {
                      const historyTags = Array.from(
                        new Set([
                          ...rememberedHashtags,
                          ...(backendTagSuggestions?.hashtags || []),
                          ...posts.flatMap((p) => [
                            ...(p.hashtags || []),
                            ...((p.caption || "").match(/#[a-zA-Z0-9_]+/g) || []),
                          ]),
                        ])
                      );
                      if (historyTags.length === 0) {
                        return (
                          <p className="text-[10.5px] text-zinc-400">
                            Hashtags you use will be remembered here for future posts.
                          </p>
                        );
                      }
                      return (
                        <div className="space-y-1.5">
                          <span className="text-[10.5px] font-semibold text-zinc-400">
                            Your recently used hashtags:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {historyTags.map((h) => {
                              const active = hashtags.includes(h);
                              return (
                                <button
                                  key={h}
                                  type="button"
                                  onClick={() =>
                                    active
                                      ? setHashtags(
                                          hashtags.filter((x) => x !== h)
                                        )
                                      : handleAddHashtagItem(h)
                                  }
                                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                                    active
                                      ? "bg-[#f5c94d] text-black font-bold"
                                      : "bg-white/8 text-zinc-300 hover:bg-white/15"
                                  }`}
                                >
                                  {h}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Row (Draft, Post, Discard, Saved Drafts) */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleDraft}
            className="flex-1 sm:flex-none rounded-full bg-[#f5c94d] px-8 py-2.5 text-sm font-semibold text-black hover:bg-[#eab308] active:scale-95 transition-all text-center shadow-md cursor-pointer"
          >
            Draft
          </button>
          <button
            type="button"
            onClick={handlePost}
            className="flex-1 sm:flex-none rounded-full bg-[#f5c94d] px-10 py-2.5 text-sm font-semibold text-black hover:bg-[#eab308] active:scale-95 transition-all text-center shadow-md cursor-pointer"
          >
            Post
          </button>
          <button
            type="button"
            onClick={handleDiscard}
            className="flex-1 sm:flex-none rounded-full bg-white px-8 py-2.5 text-sm font-semibold text-black hover:bg-neutral-200 active:scale-95 transition-all text-center shadow-md cursor-pointer"
          >
            Discard
          </button>

          {drafts.length > 0 && (
            <button
              type="button"
              onClick={() => setShowDraftsModal(true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/15 active:scale-95 transition-all text-center cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#f5c94d]" />
              <span>Saved Drafts ({drafts.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Posted Content Section */}
      <div ref={postedSectionRef} id="posted-content-section" className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Posted Content
          </h2>
          <span className="text-xs font-medium text-white/50">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </span>
        </div>

        {/* Community Branding Header for Feed */}
        <div className="flex items-center gap-3 pb-1">
          <div className="relative h-9 w-9 rounded-full overflow-hidden bg-zinc-800">
            <Image
              src={communityAvatar || "/images/community/cover-1.jpg"}
              alt={communityName}
              fill
              unoptimized
              className="object-cover"
              sizes="36px"
            />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white">
            {communityName}
          </h3>
        </div>

        {/* Post Items */}
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-10 text-center space-y-2">
            <p className="text-sm font-semibold text-white">
              No posts published yet
            </p>
            <p className="text-xs text-zinc-400">
              Upload your first photo or video above to share with your community.
            </p>
          </div>
        ) : (
        <div className="space-y-8">
          {posts.map((post) => {
            const isMenuOpen = activeMenuPostId === post.id;
            const commentsDisabled = disabledCommentsPostIds.includes(post.id);

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
                  <div className="flex items-center gap-1.5 text-sm text-white/90 flex-wrap">
                    <span className="font-semibold">{post.authorHandle}</span>
                    <span className="text-white/40">·</span>
                    <span className="text-white/60">{post.timestamp}</span>
                    {post.location && (
                      <>
                        <span className="text-white/40">·</span>
                        <span className="inline-flex items-center gap-1 text-xs text-[#f5c94d]">
                          <MapPin className="h-3 w-3" />
                          {post.location}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Caption with highlighted @tags and #hashtags */}
                <p className="text-sm md:text-[15px] text-white/90 leading-relaxed">
                  {post.caption.split(/(\s+)/).map((part, idx) => {
                    if (/^@[a-zA-Z0-9_.-]+/.test(part)) {
                      return (
                        <span
                          key={idx}
                          className="text-[#f5c94d] font-semibold cursor-pointer hover:underline"
                        >
                          {part}
                        </span>
                      );
                    }
                    if (/^#[a-zA-Z0-9_]+/.test(part)) {
                      return (
                        <span
                          key={idx}
                          className="text-[#74e3a4] font-medium cursor-pointer hover:underline"
                        >
                          {part}
                        </span>
                      );
                    }
                    return <span key={idx}>{part}</span>;
                  })}
                </p>

                {/* Media Image Container with `...` Menu */}
                <div className="relative rounded-[22px] overflow-hidden bg-[#181818] shadow-lg">
                  {post.mediaUrl ? (
                    <div className="relative h-64 sm:h-72 md:h-80 w-full">
                      <Image
                        src={post.mediaUrl}
                        alt="Post food photo"
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 680px"
                      />
                    </div>
                  ) : (
                    <div className="px-5 py-4 min-h-[56px] flex items-center bg-[#1c1c1e] border border-white/5 rounded-[22px]">
                      <span className="text-xs text-white/45">Text-only post</span>
                    </div>
                  )}

                  {/* Options Menu Button (Three dots - Matching Screenshot 5) */}
                  <div className="absolute top-3.5 right-3.5 z-10">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveMenuPostId(isMenuOpen ? null : post.id)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white/90 hover:text-white hover:bg-black/85 transition-all backdrop-blur-sm cursor-pointer"
                      title="Post options"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>

                    {/* Popover Menu (Matching Screenshot 5) */}
                    {isMenuOpen && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 top-10 w-44 rounded-2xl border border-white/10 bg-[#1e1e1e] p-1.5 shadow-2xl backdrop-blur-md z-30 animate-in fade-in zoom-in-95 duration-150"
                      >
                        {/* Edit post */}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuPostId(null);
                            setEditingPostId(post.id);
                            setCaption(post.caption);
                            setUploadedMedia(post.mediaUrl || null);
                            showToast("Loaded post into editor — save changes to update.");
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-white/90 hover:bg-white/10 rounded-xl transition-colors text-left cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          <span>Edit post</span>
                        </button>

                        {/* Archive post */}
                        <button
                          type="button"
                          onClick={() => void handleArchivePost(post.id)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-white/90 hover:bg-white/10 rounded-xl transition-colors text-left cursor-pointer"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>Archive post</span>
                        </button>

                        {/* Turn off comments */}
                        <button
                          type="button"
                          onClick={() => toggleTurnOffComments(post.id)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-white/90 hover:bg-white/10 rounded-xl transition-colors text-left cursor-pointer"
                        >
                          <MessageSquareOff className="h-3.5 w-3.5" />
                          <span>
                            {commentsDisabled
                              ? "Turn on comments"
                              : "Turn off comments"}
                          </span>
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDeletePost(post.id)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-left cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
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
                    className="flex items-center gap-2 hover:text-[#f5c94d] transition-colors group cursor-pointer"
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
                    disabled={commentsDisabled}
                    onClick={() => {
                      if (commentsDisabled) {
                        showToast("Comments are turned off for this post.");
                      } else {
                        setActiveCommentsPostId(activeCommentsPostId === post.id ? null : post.id);
                      }
                    }}
                    className={`flex items-center gap-2 transition-colors ${
                      commentsDisabled
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:text-white cursor-pointer"
                    }`}
                  >
                    <MessageCircle className="h-4 w-4 text-white/80" />
                    <span className="text-xs font-medium">
                      {commentsDisabled ? "Off" : post.comments}
                    </span>
                  </button>

                  {/* Bookmark */}
                  <button
                    type="button"
                    onClick={() => toggleBookmark(post.id)}
                    className="flex items-center gap-2 hover:text-[#f5c94d] transition-colors group cursor-pointer"
                  >
                    <Bookmark
                      className={`h-4 w-4 transition-colors ${
                        post.isBookmarked
                          ? "fill-[#f5c94d] text-[#f5c94d]"
                          : "text-white/80 group-hover:text-[#f5c94d]"
                      }`}
                    />
                    <span className="text-xs font-medium">
                      {post.bookmarks}
                    </span>
                  </button>

                  {/* Share */}
                  <button
                    type="button"
                    onClick={() => {
                      const shareUrl = typeof window !== "undefined" ? window.location.href : "";
                      if (typeof navigator !== "undefined" && navigator.share) {
                        navigator.share({ title: post.authorName, text: post.caption, url: shareUrl }).catch(() => {});
                      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
                        navigator.clipboard.writeText(shareUrl);
                      }
                      showToast("Post link copied to clipboard! 📋");
                    }}
                    className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
                  >
                    <Share2 className="h-4 w-4 text-white/80" />
                    <span className="text-xs font-medium">{post.shares}</span>
                  </button>
                </div>

                {/* Inline Comments View when clicked */}
                {activeCommentsPostId === post.id && !commentsDisabled && (
                  <div className="rounded-2xl border border-white/10 bg-[#161616] p-4 space-y-3 mt-2 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="text-xs font-semibold text-white/90">
                        Comments ({post.comments})
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveCommentsPostId(null)}
                        className="text-xs text-white/40 hover:text-white transition-colors cursor-pointer"
                      >
                        ✕ Close
                      </button>
                    </div>

                    {/* Comments list */}
                    <div className="space-y-2.5 max-h-48 overflow-y-auto">
                      {(() => {
                        const localComments = postCommentsMap[post.id] || [];
                        const storedComments = getStoredCommentsForPost(post.id, post.caption).map((c) => ({
                          id: c.id,
                          author: c.author,
                          avatar: c.avatar,
                          text: c.text,
                          time: c.timeAgo,
                        }));
                        const merged = [...localComments];
                        for (const sc of storedComments) {
                          if (!merged.some((m) => m.id === sc.id || m.text.trim().toLowerCase() === sc.text.trim().toLowerCase())) {
                            merged.push(sc);
                          }
                        }
                        if (merged.length === 0) {
                          return (
                            <p className="text-xs text-white/40 text-center py-3">
                              No comments yet. Start the conversation!
                            </p>
                          );
                        }
                        return merged.map((c) => (
                          <div key={c.id} className="flex items-start gap-2 text-xs">
                            <span className="font-semibold text-white/90 shrink-0">
                              {c.author}:
                            </span>
                            <span className="text-white/70 leading-relaxed">
                              {c.text}
                            </span>
                          </div>
                        ));
                      })()}
                    </div>

                    {/* Add comment input */}
                    <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                      <input
                        type="text"
                        value={newCommentInput}
                        onChange={(e) => setNewCommentInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newCommentInput.trim()) {
                            e.preventDefault();
                            const trimmed = newCommentInput.trim();
                            const newC = {
                              id: `c-${Date.now()}`,
                              author: "You",
                              avatar: "/images/community/avatar-1.png",
                              text: trimmed,
                              time: "Just now",
                            };
                            saveCommentForPost(
                              post.id,
                              {
                                id: newC.id,
                                author: "You",
                                avatar: "/images/community/avatar-1.png",
                                text: trimmed,
                                timeAgo: "Just now",
                              },
                              post.caption
                            );
                            setPostCommentsMap((prev) => ({
                              ...prev,
                              [post.id]: [...(prev[post.id] || []), newC],
                            }));
                            setNewCommentInput("");
                            const currentC = parseInt(String(post.comments || "0").replace(/[^0-9]/g, "") || "0", 10);
                            updatePosts((prev) =>
                              prev.map((p) =>
                                p.id === post.id
                                  ? { ...p, comments: String(currentC + 1) }
                                  : p
                              )
                            );
                            showToast("Comment added! 💬");
                          }
                        }}
                        placeholder="Write a comment…"
                        className="flex-1 bg-[#222] rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/40 outline-none border border-white/10 focus:border-[#f5c94d]/40"
                      />
                      <button
                        type="button"
                        disabled={!newCommentInput.trim()}
                        onClick={() => {
                          const trimmed = newCommentInput.trim();
                          if (!trimmed) return;
                          const newC = {
                            id: `c-${Date.now()}`,
                            author: "You",
                            avatar: "/images/community/avatar-1.png",
                            text: trimmed,
                            time: "Just now",
                          };
                          saveCommentForPost(
                            post.id,
                            {
                              id: newC.id,
                              author: "You",
                              avatar: "/images/community/avatar-1.png",
                              text: trimmed,
                              timeAgo: "Just now",
                            },
                            post.caption
                          );
                          setPostCommentsMap((prev) => ({
                            ...prev,
                            [post.id]: [...(prev[post.id] || []), newC],
                          }));
                          setNewCommentInput("");
                          const currentC = parseInt(String(post.comments || "0").replace(/[^0-9]/g, "") || "0", 10);
                          updatePosts((prev) =>
                            prev.map((p) =>
                              p.id === post.id
                                ? { ...p, comments: String(currentC + 1) }
                                : p
                            )
                          );
                          showToast("Comment added! 💬");
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#f5c94d] text-zinc-950 font-bold text-xs disabled:opacity-40 transition-opacity cursor-pointer"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
        )}
      </div>

      {/* Saved Drafts Dialog */}
      {showDraftsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
        >
          <div className="w-full max-w-lg rounded-2xl bg-[#1c1c1c] border border-white/10 p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#f5c94d]" />
                <h3 className="text-lg font-bold text-white">Saved Drafts</h3>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold text-white/70">
                  {drafts.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowDraftsModal(false)}
                className="text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-3 pr-1">
              {drafts.length === 0 ? (
                <p className="text-center text-sm text-white/50 py-8">
                  No saved drafts yet.
                </p>
              ) : (
                drafts.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-start justify-between gap-3 rounded-xl bg-[#252525] border border-white/5 p-4 hover:border-white/15 transition-all"
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#f5c94d]">
                          {d.mediaType === "video" ? "Video Draft" : "Post Draft"}
                        </span>
                        <span className="text-[11px] text-white/40">· {d.savedAt}</span>
                      </div>
                      <p className="text-sm text-white/90 line-clamp-2">
                        {d.caption || "No caption provided"}
                      </p>
                      {d.location && (
                        <p className="text-xs text-white/50 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#f5c94d]" />
                          <span>{d.location}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-1">
                      <button
                        type="button"
                        onClick={() => void handleRestoreDraft(d)}
                        className="rounded-lg bg-[#f5c94d] px-3 py-1.5 text-xs font-bold text-black hover:bg-[#eab308] cursor-pointer transition-all"
                      >
                        Load
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDraft(d.id)}
                        className="p-1.5 text-white/40 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete draft"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowDraftsModal(false)}
                className="rounded-lg bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/15 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

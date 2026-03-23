import { Video } from "@/types/video";

export const mockVideos: Video[] = [
  {
    id: "1",
    src: "/media/video.mp4",
    username: "Localbuka",
    isVerified: true,
    hashtags: ["localbuka", "local", "buka", "Food"],
    likes: 24000,
    comments: 200000,
    saves: 40000,
    shares: 30000,
  }
];

export const formatCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${Math.floor(count / 1000)}k`;
  }
  return count.toString();
};

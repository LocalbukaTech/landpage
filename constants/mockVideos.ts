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
  },
  {
    id: "2",
    src: "/media/video1.mp4",
    username: "Localbuka",
    isVerified: true,
    hashtags: ["localbuka", "cooking", "recipe"],
    likes: 18500,
    comments: 150000,
    saves: 32000,
    shares: 25000,
  },
  {
    id: "3",
    src: "/media/video3.mp4",
    username: "Localbuka",
    isVerified: true,
    hashtags: ["localbuka", "foodie", "delicious"],
    likes: 35000,
    comments: 280000,
    saves: 55000,
    shares: 42000,
  },
  {
    id: "4",
    src: "/media/video.mp4",
    username: "Localbuka",
    isVerified: true,
    hashtags: ["localbuka", "local", "buka", "Food"],
    likes: 24000,
    comments: 200000,
    saves: 40000,
    shares: 30000,
  },
  {
    id: "5",
    src: "/media/video1.mp4",
    username: "Localbuka",
    isVerified: true,
    hashtags: ["localbuka", "cooking", "recipe"],
    likes: 18500,
    comments: 150000,
    saves: 32000,
    shares: 25000,
  },
  {
    id: "6",
    src: "/media/video3.mp4",
    username: "Localbuka",
    isVerified: true,
    hashtags: ["localbuka", "foodie", "delicious"],
    likes: 35000,
    comments: 280000,
    saves: 55000,
    shares: 42000,
  },
  {
    id: "7",
    src: "/media/video1.mp4",
    username: "Localbuka",
    isVerified: true,
    hashtags: ["localbuka", "cooking", "recipe"],
    likes: 18500,
    comments: 150000,
    saves: 32000,
    shares: 25000,
  },
  {
    id: "8",
    src: "/media/video3.mp4",
    username: "Localbuka",
    isVerified: true,
    hashtags: ["localbuka", "foodie", "delicious"],
    likes: 35000,
    comments: 280000,
    saves: 55000,
    shares: 42000,
  },
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

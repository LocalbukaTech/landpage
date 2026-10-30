import { MobileCommunityItem, CommunityComment, MobileNotificationItem } from "./types";

export const MOCK_COMMUNITIES: MobileCommunityItem[] = [
  {
    id: "nigeria-food",
    name: "Nigeria food and culture",
    creator: "Localbuka owned",
    ownerLine: "Owned by Localbuka · 12.4k members · 340 posts",
    members: "12.4k members",
    posts: "340 posts",
    priceBadge: "Free",
    priceAmount: 0,
    yearlyPriceAmount: 0,
    isFree: true,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
    accent: "green",
    description:
      "A space to explore Nigerian dishes, cooking traditions, and the stories behind the food. Share recipes, ask questions, and connect with fellow food lovers across the country.",
    shares: [
      { id: "1", icon: "recipe", title: "Recipes and cooking tips" },
      { id: "2", icon: "chat", title: "Food discussions" },
      { id: "3", icon: "media", title: "Photos and short videos" },
    ],
    recentPostImage:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "chef-amaka",
    name: "Chef Amaka's kitchen",
    creator: "By Amaka Obi",
    ownerLine: "Owned by Amaka Obi · 2.1k members · 58 posts",
    members: "2.1k members",
    posts: "58 posts",
    priceBadge: "Paid · ₦2,500/mo",
    priceAmount: 2500,
    yearlyPriceAmount: 25000,
    isFree: false,
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
    accent: "yellow",
    description:
      "Weekly private recipes, live cook-alongs, and direct feedback from Chef Amaka for members serious about leveling up their cooking.",
    benefits: [
      "Exclusive weekly recipes",
      "Monthly live cook-alongs",
      "Direct Q&A with Chef Amaka",
    ],
    shares: [
      { id: "1", icon: "recipe", title: "VIP Masterclasses & Secrets" },
      { id: "2", icon: "chat", title: "Direct Q&A Feedback" },
      { id: "3", icon: "media", title: "Unreleased recipe reels" },
    ],
    recentPostImage:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "street-food",
    name: "Street food lovers",
    creator: "Localbuka owned",
    ownerLine: "Owned by Localbuka · 8.7k members · 210 posts",
    members: "8.7k members",
    posts: "210 posts",
    priceBadge: "Free",
    priceAmount: 0,
    yearlyPriceAmount: 0,
    isFree: true,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    accent: "rose",
    description:
      "Discover the craziest suya joints, akara spots, and roadside delights across Lagos and beyond.",
    shares: [
      { id: "1", icon: "recipe", title: "Suya & Street Spice secrets" },
      { id: "2", icon: "chat", title: "Midnight street food recommendations" },
      { id: "3", icon: "media", title: "Street vendor videos" },
    ],
  },
  {
    id: "taste-hunters",
    name: "Taste Hunters",
    creator: "By Wilson",
    ownerLine: "Owned by Wilson · 3.7k members · 90 posts",
    members: "3.7k members",
    posts: "90 posts",
    priceBadge: "Free",
    priceAmount: 0,
    yearlyPriceAmount: 0,
    isFree: true,
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80",
    accent: "blue",
    description:
      "A community dedicated to hunting hidden buka culinary gems across West Africa.",
  },
  {
    id: "budget-bites",
    name: "Budget bites",
    creator: "Localbuka owned",
    ownerLine: "Owned by Localbuka · 5.3k members · 96 posts",
    members: "5.3k members",
    posts: "96 posts",
    priceBadge: "Free",
    priceAmount: 0,
    yearlyPriceAmount: 0,
    isFree: true,
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
    accent: "yellow",
    description:
      "Delicious and pocket-friendly meal guides for students and budget-conscious food lovers.",
  },
  {
    id: "food-travel",
    name: "Food and travel",
    creator: "By Blessing",
    ownerLine: "Owned by Blessing · 2.1k members · 58 posts",
    members: "2.1k members",
    posts: "58 posts",
    priceBadge: "Paid · ₦1,200/mo",
    priceAmount: 1200,
    yearlyPriceAmount: 12000,
    isFree: false,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    accent: "blue",
    description:
      "Culinary trips across Nigerian cities, highlighting unique delicacies and market journeys.",
  },
  {
    id: "grill-masters",
    name: "Grill masters NG",
    creator: "By Grill Masters",
    ownerLine: "Owned by Grill Masters · 3.7k members · 170 posts",
    members: "3.7k members",
    posts: "170 posts",
    priceBadge: "Free",
    priceAmount: 0,
    yearlyPriceAmount: 0,
    isFree: true,
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
    accent: "green",
    description:
      "Barbecue, Asun, Kilishi and roasted plantain enthusiasts connecting over open fires.",
  },
  {
    id: "food-room",
    name: "The food room",
    creator: "By Festus Ojo",
    ownerLine: "Owned by Festus Ojo · 1.3k members · 78 posts",
    members: "1.3k members",
    posts: "78 posts",
    priceBadge: "Paid · ₦1,200/mo",
    priceAmount: 1200,
    yearlyPriceAmount: 12000,
    isFree: false,
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
    accent: "rose",
    description:
      "Chef room for gourmet presentations and contemporary African gastronomy.",
  },
];

export const INITIAL_COMMENTS: CommunityComment[] = [
  {
    id: "c1",
    author: "@ada_eats",
    text: "Smoked paprika is underrated honestly, saving this",
    timeAgo: "2h",
  },
  {
    id: "c2",
    author: "@Uju_ui/ux",
    text: "Need this recipe fr",
    timeAgo: "1h",
  },
  {
    id: "c3",
    author: "@femmywills_",
    text: "Smoked paprika is underrated honestly, saving this",
    timeAgo: "45m",
  },
];

export const MOCK_NOTIFICATIONS: MobileNotificationItem[] = [
  {
    id: "n1",
    type: "like",
    avatar: "/images/avatar-meghan.png",
    title: "Anika Press, Mckenna James liked your post",
    time: "5 mins ago",
    thumbnail:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80",
    isNew: true,
  },
  {
    id: "n2",
    type: "post",
    avatar: "/images/avatar-bryan.jpg",
    title: "Chef Tolu posted in Nigerian food and culture",
    time: "8 mins ago",
    thumbnail:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=200&q=80",
    isNew: true,
  },
  {
    id: "n3",
    type: "follow",
    avatar: "/images/avatar-christiana.png",
    title: "Anika Press started following you",
    time: "10 mins ago",
    isNew: true,
  },
  {
    id: "n4",
    type: "restaurant",
    avatar: "/images/localBuka_logo.png",
    title: "Hey James, check out this restaurant",
    time: "22h ago",
    isNew: false,
    restaurantCard: {
      name: "Commiint Buka",
      rating: "4.5",
      reviews: "200+",
      address: "15/17 Majekodunmi Street, Omotayo Street, Ikeja",
      image: "/images/commit_buka.png",
    },
  },
  {
    id: "n5",
    type: "reply",
    avatar: "/images/avatar-marcus.png",
    title: "Ada Eats replied to your post in Street food lovers",
    time: "18h ago",
    thumbnail:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80",
    isNew: false,
  },
  {
    id: "n6",
    type: "post",
    avatar: "/images/avatar-eleanor.png",
    title: "Grill masters NG published a new post",
    time: "19h ago",
    thumbnail:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=200&q=80",
    isNew: false,
  },
];

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: "customer" | "vendor" | "botanist" | "admin";
  points: number;
  badgeLevel: string;
  treesPlanted: number;
  challengesCompletedCount: number;
  unlockedVirtualPlants: string[]; // List of IDs of virtual plants currently active in their digital garden
  avatar: string;
  specialization?: string;
  rating?: number;
  consultationFee?: number;
  clinicAddress?: string;
  totalEarnings?: number;
  bio?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: "customer" | "seller" | "both";
  points: number;
  badgeLevel: string;
  treesPlanted: number;
  challengesCompletedCount: number;
  unlockedVirtualPlants: string[];
}

export interface Product {
  id: string;
  name: string;
  category: "Indoor Plants" | "Outdoor Flowers" | "Organic Seeds" | "Biological Fertilizers" | "Artisan Pots";
  description: string;
  priceCurrency: number; // PKR or standard currency
  pricePoints?: number;  // Price in reward coins
  rating: number;
  image: string;
  sellerName: string;
  sellerRole: "local-farmer" | "hobbyist" | "guild-nursery" | "botanical-store";
  stock: number;
  sellerId?: string; // Links product to a specific vendor account
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category: "customer-lounge" | "seller-hub" | "seed-swap" | "disease-help";
  authorName: string;
  authorBadge: string;
  authorRole: "customer" | "seller";
  likesCount: number;
  comments: Comment[];
  hasLiked?: boolean;
  date: string;
  tag: string;
}

export interface Comment {
  id: string;
  authorName: string;
  authorRole: "customer" | "seller";
  content: string;
  date: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  fullText: string;
  source: string;
  date: string;
  badge: "botany" | "conservation" | "gardening-tips" | "research";
  imageUrl: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  rewardPoints: number;
  targetValue: number;
  currentValue: number;
  completed: boolean;
  claimed: boolean;
  actionLabel: string;
  metricType: "clipping" | "sharing" | "diagnosing" | "planting" | "purchasing";
}

export interface BotChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
  image?: string;
}

export interface VirtualPlant {
  id: string;
  name: string;
  costPoints: number;
  svgPath: string;
  growthStage: "seedling" | "sprout" | "flowering" | "majestic";
  description: string;
}

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  botanistId: string;
  botanistName: string;
  date: string;
  timeSlot: string;
  plantType: string;
  symptoms: string;
  status: "scheduled" | "completed" | "cancelled";
}

export interface DirectMessage {
  id: string;
  appointmentId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: "card" | "cod" | "points";
  paymentStatus: "paid" | "pending_cod" | "points_deducted";
  shippingStatus: "pending" | "shipped" | "delivered";
  date: string;
  pointsAwarded: number;
  pointsCredited: boolean;
}

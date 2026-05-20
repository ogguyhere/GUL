import React, { useState, useEffect } from "react";
import { UserAccount, UserProfile, Product, CommunityPost, Challenge, BotChatMessage, Appointment, DirectMessage, Order, CartItem } from "./types";
import { INITIAL_PRODUCTS, INITIAL_COMMUNITIES, INITIAL_NEWS, INITIAL_CHALLENGES } from "./data";
import Navbar from "./components/Navbar";
import BotanyDoctor from "./components/BotanyDoctor";
import Store from "./components/Store";
import Community from "./components/Community";
import News from "./components/News";
import Challenges from "./components/Challenges";

// Import our newly created modular components
import LoginRegister from "./components/LoginRegister";
import ProfilesView from "./components/ProfilesView";
import Appointments from "./components/Appointments";
import CartPayment from "./components/CartPayment";
import AdminDashboard from "./components/AdminDashboard";
import VendorDashboard from "./components/VendorDashboard";

import { 
  Sparkles, 
  Coins, 
  Award, 
  Leaf, 
  Activity, 
  UserCheck, 
  ShieldCheck, 
  RotateCcw, 
  X,
  Compass,
  ChevronRight,
  TrendingUp,
  MapPin,
  CalendarDays,
  ShoppingBag,
  Clock,
  Truck,
  CreditCard,
  PackageCheck,
  History
} from "lucide-react";

// Preconfigured sandbox user profiles representing all requested system roles
const INITIAL_ACCOUNTS: UserAccount[] = [
  {
    id: "acc-customer-1",
    name: "Ayesha Malik",
    email: "ayesha@gulgarden.org",
    role: "customer",
    points: 230,
    badgeLevel: "Sprout Caretaker",
    treesPlanted: 3,
    challengesCompletedCount: 2,
    unlockedVirtualPlants: ["vp-1"],
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    bio: "Enthusiastic urban gardener potting crimson bougainvilleas and fresh cherry tomatoes on a narrow fourth-floor balcony."
  },
  {
    id: "acc-vendor-1",
    name: "Greenwood Valley",
    email: "greenwood@gulgarden.org",
    role: "vendor",
    points: 150,
    badgeLevel: "Elite Nursery Guild",
    treesPlanted: 22,
    challengesCompletedCount: 15,
    unlockedVirtualPlants: [],
    avatar: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=200",
    bio: "First-generation florists. Bringing rare climbers and evergreen indoor purifiers to municipal balconies.",
    rating: 4.7
  },
  {
    id: "acc-botanist-1",
    name: "Dr. Gul",
    email: "dr.gul@gulgarden.org",
    role: "botanist",
    points: 80,
    badgeLevel: "Lead Phyto-Pathologist",
    treesPlanted: 15,
    challengesCompletedCount: 12,
    unlockedVirtualPlants: ["vp-1", "vp-3"],
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200",
    specialization: "Leaf Pathology & Diagnosis",
    rating: 4.9,
    consultationFee: 40,
    bio: "Deep Mind researcher in botanical sciences. Specialize in curative organic compositions, urban microclimates, and rose garden revivals."
  },
  {
    id: "acc-botanist-2",
    name: "Dr. Sarah Phyto",
    email: "sarah.phyto@gulgarden.org",
    role: "botanist",
    points: 120,
    badgeLevel: "Senior Phyto-Biologist",
    treesPlanted: 8,
    challengesCompletedCount: 6,
    unlockedVirtualPlants: ["vp-2"],
    avatar: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=200",
    specialization: "Soil Bio-Activity & Composting",
    rating: 4.8,
    consultationFee: 30,
    bio: "10+ years helping organic nurseries grow. Specialized in worm-composting, soil bio-activity, and root-rot prevention."
  },
  {
    id: "acc-admin-1",
    name: "Platform Overseer",
    email: "admin@gulgarden.org",
    role: "admin",
    points: 500,
    badgeLevel: "Ecology Architect",
    treesPlanted: 40,
    challengesCompletedCount: 20,
    unlockedVirtualPlants: [],
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
    bio: "Nurtures general systems integrity, approves physical shipments, and administers global botanical parameters."
  }
];

export default function App() {
  // Authentication & Switching States
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [accounts, setAccounts] = useState<UserAccount[]>(INITIAL_ACCOUNTS);
  const [currentUserId, setCurrentUserId] = useState<string>("acc-customer-1");

  // Retrieve current active user profile
  const currentUser = accounts.find((a) => a.id === currentUserId) || accounts[0];

  // Map legacy profile to maintain 100% linter and props compatibility
  const legacyProfile: UserProfile = {
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role === "vendor" ? "seller" : (currentUser.role === "botanist" ? "both" : "customer"),
    points: currentUser.points,
    badgeLevel: currentUser.badgeLevel,
    treesPlanted: currentUser.treesPlanted,
    challengesCompletedCount: currentUser.challengesCompletedCount,
    unlockedVirtualPlants: currentUser.unlockedVirtualPlants
  };

  // Helper setter for compatibility
  const setLegacyProfile = (updater: React.SetStateAction<UserProfile>) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === currentUser.id) {
          const resolved = typeof updater === "function" ? updater(legacyProfile) : updater;
          return {
            ...acc,
            name: resolved.name,
            points: resolved.points,
            badgeLevel: resolved.badgeLevel,
            treesPlanted: resolved.treesPlanted,
            challengesCompletedCount: resolved.challengesCompletedCount,
            unlockedVirtualPlants: resolved.unlockedVirtualPlants
          };
        }
        return acc;
      })
    );
  };

  // Tab State
  const [currentTab, setCurrentTab] = useState<string>("dashboard");

  // Core Data Lists
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [communities, setCommunities] = useState<CommunityPost[]>(INITIAL_COMMUNITIES);
  const [news, setNews] = useState(INITIAL_NEWS);
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [chatHistory, setChatHistory] = useState<BotChatMessage[]>([]);

  // Cart & Appointment Operations
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>([]);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ord-init-101",
      customerId: "acc-customer-1",
      customerName: "Ayesha Malik",
      items: [
        {
          product: INITIAL_PRODUCTS[0],
          quantity: 2
        }
      ],
      totalAmount: INITIAL_PRODUCTS[0].priceCurrency * 2,
      paymentMethod: "points",
      paymentStatus: "points_deducted",
      shippingStatus: "shipped",
      date: "2026-05-18",
      pointsAwarded: 0,
      pointsCredited: true
    },
    {
      id: "ord-init-102",
      customerId: "acc-customer-1",
      customerName: "Ayesha Malik",
      items: [
        {
          product: INITIAL_PRODUCTS[1],
          quantity: 1
        }
      ],
      totalAmount: INITIAL_PRODUCTS[1].priceCurrency,
      paymentMethod: "cod",
      paymentStatus: "pending_cod",
      shippingStatus: "pending",
      date: "2026-05-19",
      pointsAwarded: Math.floor(INITIAL_PRODUCTS[1].priceCurrency * 0.1),
      pointsCredited: false
    }
  ]);

  // Modals / Drawer State
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Profile Edit fields
  const [editName, setEditName] = useState(currentUser.name);
  const [editBio, setEditBio] = useState(currentUser.bio || "");

  // Auto Dismiss Toasts
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Handle auto-tab shift when changing profiles
  useEffect(() => {
    if (currentUser.role === "customer") setCurrentTab("dashboard");
    else if (currentUser.role === "vendor") setCurrentTab("vendor_dashboard");
    else if (currentUser.role === "botanist") setCurrentTab("appointments");
    else if (currentUser.role === "admin") setCurrentTab("admin_dashboard");
  }, [currentUserId]);

  const handleAddPoints = (amount: number) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === currentUser.id) {
          const updatedPts = acc.points + amount;
          let level = acc.badgeLevel;
          if (acc.role === "customer") {
            if (updatedPts >= 600) level = "Eco King / Queen 👑";
            else if (updatedPts >= 400) level = "Master Canopy Forester 🌲";
            else if (updatedPts >= 250) level = "Ecology Guardian 🌿";
            else level = "Sprout Caretaker 🌱";
          }
          return { ...acc, points: updatedPts, badgeLevel: level };
        }
        return acc;
      })
    );
    setToastMessage(`Earned +${amount} GUL Points! Ledger balance updated.`);
  };

  const handleDeductPoints = (amount: number): boolean => {
    let succeeded = false;
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === currentUser.id) {
          if (acc.points >= amount) {
            succeeded = true;
            return { ...acc, points: acc.points - amount };
          }
        }
        return acc;
      })
    );
    return succeeded;
  };

  const handleChallengeProgress = (
    type: "clipping" | "sharing" | "diagnosing" | "planting" | "purchasing", 
    amount: number
  ) => {
    setChallenges((prev) =>
      prev.map((chal) => {
        if (chal.metricType === type && !chal.completed) {
          const newVal = chal.currentValue + amount;
          const isDone = newVal >= chal.targetValue;
          
          if (isDone) {
            setToastMessage(`Challenge Complete: "${chal.title}"! Claim your coin rewards in the Challenges tab.`);
          }

          return { ...chal, currentValue: newVal, completed: isDone };
        }
        return chal;
      })
    );
  };

  const handleClaimReward = (challengeId: string, rewardPoints: number) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === challengeId ? { ...c, claimed: true } : c))
    );
    handleAddPoints(rewardPoints);
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === currentUser.id) {
          return { ...acc, challengesCompletedCount: acc.challengesCompletedCount + 1 };
        }
        return acc;
      })
    );
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === currentUser.id) {
          return { ...acc, name: editName, bio: editBio };
        }
        return acc;
      })
    );
    setShowProfileDrawer(false);
    setToastMessage("Ecology settings modifications captured successfully!");
  };

  const handleManualAddTree = () => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === currentUser.id) {
          return { ...acc, treesPlanted: acc.treesPlanted + 1 };
        }
        return acc;
      })
    );
    handleChallengeProgress("planting", 1);
    setToastMessage("Eco-Action! Virtual Sapling registered in GUL Canopy.");
    handleAddPoints(15);
  };

  const handleAddToCart = (product: Product) => {
    if (currentUser.role !== "customer") {
      setToastMessage("⚠️ Swapped out of Customer mode. Only Buyer accounts can add Bazaar items.");
      return;
    }
    setCart((prev) => {
      const exists = prev.find((item) => item.product.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setToastMessage(`Added "${product.name}" to cart! Click Basket tab to buy.`);
  };

  // Handles shipment dispatches by Admin. Credits points to customers for COD orders
  const handleAdminShipOrder = (orderId: string, customerId: string, pointsAwarded: number) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            shippingStatus: "shipped",
            paymentStatus: "paid",
            pointsCredited: true
          };
        }
        return ord;
      })
    );

    // Add points to customer ledger
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === customerId) {
          return { ...acc, points: acc.points + pointsAwarded };
        }
        return acc;
      })
    );

    setToastMessage(`Approved! Order ID ${orderId} Shipped & +${pointsAwarded} PTS credited to buyer.`);
  };

  const handleLogin = (account: UserAccount) => {
    setCurrentUserId(account.id);
    setIsLoggedIn(true);
    setToastMessage(`Welcome back, ${account.name}! Logged in as ${account.role.toUpperCase()}.`);
  };

  const handleRegisterNewAccount = (account: UserAccount) => {
    setAccounts((prev) => [...prev, account]);
    setCurrentUserId(account.id);
    setIsLoggedIn(true);
    setToastMessage(`Congratulations, account created for ${account.name}! Now visiting Canopy.`);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setToastMessage("Logged out securely. Switch canopy workspace identity below:");
  };

  // Click handler to instantly trigger booking form inside Experts directory
  const handleVisitBookAppointment = (botanist: UserAccount) => {
    setCurrentTab("appointments");
    setToastMessage(`Transitioned to Schedule form. Please fill slot details for Dr. ${botanist.name}.`);
  };

  if (!isLoggedIn) {
    return (
      <LoginRegister
        accounts={accounts}
        onLogin={handleLogin}
        onRegister={handleRegisterNewAccount}
      />
    );
  }

  // Count items inside cart
  const cartTotalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F7F6F0] text-forest-950 font-sans selection:bg-sage-200">
      
      {/* Toast Alert System */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 rounded-2xl border-l-4 border-gold-500 bg-forest-900 px-5 py-4 text-cream-50 shadow-xl text-xs font-bold flex items-center space-x-2.5 animate-fadeIn">
          <Sparkles className="h-4.5 w-4.5 text-gold-500 animate-spin-slow shrinking-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Multi-Role Navigation Header */}
      <Navbar 
        currentUser={currentUser} 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        onOpenProfile={() => {
          setEditName(currentUser.name);
          setEditBio(currentUser.bio || "");
          setShowProfileDrawer(true);
        }}
        onSignOut={handleSignOut}
        cartCount={cartTotalQty}
      />

      {/* Primary Workspace Sections */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        
        {/* CUSTOMER VIEWS */}
        {currentUser.role === "customer" && currentTab === "dashboard" && (
          <div className="space-y-8 py-3 animate-fadeIn">
            {/* Greeting */}
            <div className="rounded-[40px] bg-[#112318] border-2 border-[#1B3022] text-cream-50 p-6 sm:p-10 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 h-48 w-48 bg-gradient-to-br from-sage-500/20 to-gold-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <span className="bg-[#88A070]/20 text-[#FAF9F5] text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full inline-flex items-center mb-4 border border-[#88A070]/30">
                  <Leaf className="h-3.5 w-3.5 mr-1.5 animate-pulse text-gold-500" />
                  GUL Personal Canopy Oasis
                </span>
                
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-none text-white">
                  Adaab, <span className="text-gold-500">{currentUser.name}</span>!
                </h1>

                <p className="text-xs sm:text-sm text-sage-200 mt-3 max-w-xl leading-relaxed">
                  Mitigating carbon emissions through active balcony plants canopy. Balance ledger holds <span className="text-gold-500 font-mono font-black text-sm">{currentUser.points} PTS</span>.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#1F3E2B]">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-sage-300 uppercase font-mono tracking-wider">ecological level</span>
                    <span className="text-xs sm:text-sm font-bold text-emerald-400 mt-1 flex items-center">
                      <Award className="h-4 w-4 mr-1 text-gold-500" />
                      {currentUser.badgeLevel}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] text-sage-300 uppercase font-mono tracking-wider">trees registered</span>
                    <span className="text-xs sm:text-sm font-black text-cream-50 mt-1 font-mono">
                      {currentUser.treesPlanted} planted
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] text-sage-300 uppercase font-mono tracking-wider">completed milestones</span>
                    <span className="text-xs sm:text-sm font-black text-cream-50 mt-1 font-mono">
                      {currentUser.challengesCompletedCount} done
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] text-sage-300 uppercase font-mono tracking-wider">canopy status</span>
                    <span className="text-xs sm:text-sm font-black text-gold-500 mt-1 capitalize tracking-wide">
                      {currentUser.role.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-8">
                  <button
                    onClick={handleManualAddTree}
                    className="px-5 py-2.5 cursor-pointer bg-gold-500 hover:bg-gold-600 active:scale-95 text-forest-950 font-black text-[11px] sm:text-xs rounded-full shadow-md transition-all flex items-center space-x-1"
                  >
                    <span>➕ Register a Sapling (+15 PTS)</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab("profiles")}
                    className="px-5 py-2.5 border border-white/20 hover:border-white/45 bg-white/5 text-sage-100 text-[11px] sm:text-xs rounded-full font-bold transition-all cursor-pointer"
                  >
                    Visit Local Agronomist Profiles
                  </button>
                </div>
              </div>
            </div>

            {/* Portal bento grids */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-4">
                <h3 className="font-display font-extrabold text-xs uppercase tracking-widest text-[#1B3022]/60 flex items-center px-1">
                  <Activity className="h-4 w-4 text-sage-400 mr-2" />
                  <span>Module Bento Navigation</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Botany Doctor Card */}
                  <div 
                    onClick={() => setCurrentTab("doctor")}
                    className="group cursor-pointer p-6 rounded-[32px] border-2 border-forest-900/10 bg-cream-50 hover:bg-white hover:border-[#88A070] transition-all flex flex-col justify-between min-h-[180px] shadow-2xs"
                  >
                    <div>
                      <span className="text-xl">🩺</span>
                      <h4 className="font-display font-black text-sm sm:text-base uppercase tracking-tight text-forest-900 mt-3">AI Pathology Diagnoses</h4>
                      <p className="text-xs text-forest-750 mt-1.5 leading-relaxed">Consult our automated soil agent Dr. Gul to find compound cure remedies instantly.</p>
                    </div>
                    <span className="text-[11px] uppercase tracking-widest font-black text-[#1B3022] mt-3 inline-flex items-center group-hover:underline">Instant Consult →</span>
                  </div>

                  {/* Seed Bazaar Card */}
                  <div 
                    onClick={() => setCurrentTab("store")}
                    className="group cursor-pointer p-6 rounded-[32px] border-2 border-forest-900/10 bg-cream-50 hover:bg-white hover:border-[#88A070] transition-all flex flex-col justify-between min-h-[180px] shadow-2xs"
                  >
                    <div>
                      <span className="text-xl">🛍️</span>
                      <h4 className="font-display font-black text-sm sm:text-base uppercase tracking-tight text-forest-900 mt-3">Canopy Bazaar Store</h4>
                      <p className="text-xs text-forest-750 mt-1.5 leading-relaxed">Exchange harvested seeds, buy air-purifying Peace Lilies, or spend coins for pots.</p>
                    </div>
                    <span className="text-[11px] uppercase tracking-widest font-black text-[#1B3022] mt-3 inline-flex items-center group-hover:underline">Shop Store →</span>
                  </div>

                  {/* Experts Directory */}
                  <div 
                    onClick={() => setCurrentTab("profiles")}
                    className="group cursor-pointer p-6 rounded-[32px] border-2 border-forest-900/10 bg-cream-50 hover:bg-white hover:border-[#88A070] transition-all flex flex-col justify-between min-h-[180px] shadow-2xs"
                  >
                    <div>
                      <span className="text-xl">👩‍🔬</span>
                      <h4 className="font-display font-black text-sm sm:text-base uppercase tracking-tight text-forest-900 mt-3">Human Member directory</h4>
                      <p className="text-xs text-forest-750 mt-1.5 leading-relaxed">Visit actual merchant farm profiles and book remote consultations with botanists.</p>
                    </div>
                    <span className="text-[11px] uppercase tracking-widest font-black text-[#1B3022] mt-3 inline-flex items-center group-hover:underline">Meet Members →</span>
                  </div>

                  {/* Schedules & Chat */}
                  <div 
                    onClick={() => setCurrentTab("appointments")}
                    className="group cursor-pointer p-6 rounded-[32px] border-2 border-forest-900/10 bg-cream-50 hover:bg-white hover:border-[#88A070] transition-all flex flex-col justify-between min-h-[180px] shadow-2xs"
                  >
                    <div>
                      <span className="text-xl">📅</span>
                      <h4 className="font-display font-black text-sm sm:text-base uppercase tracking-tight text-forest-900 mt-3">Bookings & Live Chat</h4>
                      <p className="text-xs text-forest-750 mt-1.5 leading-relaxed">Review scheduled expert slots and type direct consultations messages to botanists.</p>
                    </div>
                    <span className="text-[11px] uppercase tracking-widest font-black text-[#1B3022] mt-3 inline-flex items-center group-hover:underline">Check Appointments →</span>
                  </div>
                </div>
              </div>

              {/* Sidebar Garden pot */}
              <div className="lg:col-span-4 space-y-4">
                <h3 className="font-display font-extrabold text-xs uppercase tracking-widest text-[#1B3022]/60 flex items-center px-1">
                  <Sparkles className="h-4 w-4 text-gold-500 mr-2" />
                  <span>Sandbox virtual Conservatory</span>
                </h3>

                <div 
                  onClick={() => setCurrentTab("challenges")}
                  className="rounded-[32px] border-2 border-forest-900/10 bg-cream-50 p-6 shadow-xs cursor-pointer hover:border-gold-500 hover:scale-[1.01] transition-all"
                >
                  <p className="text-xs text-forest-700 italic mb-4 font-medium">Miniature digital conservatory pot:</p>
                  <div className="h-36 w-full rounded-2xl bg-[#E2EDE5]/40 border-2 border-forest-900/10 flex flex-col items-center justify-center relative p-3 overflow-hidden">
                    <div className="text-4xl animate-bounce mb-3 select-none">🌱</div>
                    <span className="text-xs font-bold text-forest-900 font-display">Active Sprout Bud</span>
                    <span className="text-[10px] text-sage-600 mt-1 font-mono">Status: Hydrated</span>
                  </div>
                  <p className="text-[11px] text-forest-750 mt-4 h-12 leading-relaxed">
                    Earn coins from challenges, then purchase and plant seeds inside the Sandbox Oasis Garden!
                  </p>
                  <div className="mt-4 pt-3 border-t border-forest-120 flex justify-end text-xs font-black uppercase tracking-wider text-[#1B3022]/85 hover:underline">
                    <span>Manage Virtual Plants →</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Order History Section */}
            <div className="mt-12 bg-cream-50 rounded-[40px] border-2 border-forest-900/10 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-forest-100 gap-3">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-forest-900 text-gold-500 rounded-2xl">
                    <History className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-display font-black text-lg text-forest-900 tracking-tight">Eco-Order Registry</h2>
                    <p className="text-xs text-forest-700 mt-0.5">Track your purchases, points redemptions, and delivery progress securely.</p>
                  </div>
                </div>
                <div className="text-xs font-mono font-bold text-sage-600 bg-sage-50 px-3.5 py-1.5 rounded-full self-start sm:self-auto border border-sage-200">
                  Total Orders: {orders.filter((o) => o.customerId === currentUser.id).length}
                </div>
              </div>

              {orders.filter((o) => o.customerId === currentUser.id).length === 0 ? (
                <div className="py-12 flex flex-col items-center text-center max-w-sm mx-auto">
                  <div className="text-3xl mb-3">📦</div>
                  <h4 className="font-display font-bold text-sm text-forest-900">No Orders Registered</h4>
                  <p className="text-xs text-forest-600 mt-1 leading-relaxed">
                    You haven’t ordered any seeds or potting mix yet! Visit our Seed Bazaar Store to check out with card, COD, or points.
                  </p>
                  <button
                    onClick={() => setCurrentTab("store")}
                    className="mt-4 px-4 py-2 bg-forest-900 text-cream-50 rounded-xl text-xs font-extrabold hover:bg-forest-950 transition-all cursor-pointer"
                  >
                    Go To Store
                  </button>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {orders
                    .filter((o) => o.customerId === currentUser.id)
                    .map((order) => {
                      const pointsNeeded = order.items.reduce(
                        (sum, item) => sum + (item.product.pricePoints || Math.ceil(item.product.priceCurrency * 0.2)) * item.quantity,
                        0
                      );

                      return (
                        <div
                          key={order.id}
                          className="bg-white/80 border border-forest-900/5 hover:border-sage-300 rounded-3xl p-5 sm:p-6 transition-all shadow-2xs hover:shadow-xs relative"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-forest-100/50 pb-4 mb-4 gap-4">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[10px] font-mono font-bold uppercase text-sage-500 tracking-wider">
                                  ID: {order.id}
                                </span>
                                <span className="text-[10px] text-forest-600 font-mono">
                                  • {order.date}
                                </span>
                              </div>
                              <div className="mt-1.5">
                                <p className="text-xs font-bold text-forest-950">
                                  Settlement:{" "}
                                  <span className={`inline-flex items-center gap-1 font-extrabold capitalize ${
                                    order.paymentMethod === "points" 
                                      ? "text-purple-700" 
                                      : order.paymentMethod === "card" 
                                        ? "text-emerald-700" 
                                        : "text-amber-700"
                                  }`}>
                                    {order.paymentMethod === "points" && <Sparkles className="h-3.5 w-3.5 animate-pulse" />}
                                    {order.paymentMethod === "card" && <CreditCard className="h-3.5 w-3.5" />}
                                    {order.paymentMethod === "cod" && <Truck className="h-3.5 w-3.5" />}
                                    {order.paymentMethod === "points" ? `${pointsNeeded} GUL Points` : `Rs. ${order.totalAmount}`}
                                  </span>
                                </p>
                              </div>
                            </div>

                            {/* Status badges */}
                            <div className="flex flex-wrap gap-2 text-[10px] font-mono tracking-wider font-black text-white select-none">
                              {/* Payment status badge */}
                              <span className={`px-3 py-1 rounded-full flex items-center gap-1 ${
                                order.paymentStatus === "paid"
                                  ? "bg-emerald-600"
                                  : order.paymentStatus === "points_deducted"
                                    ? "bg-purple-600"
                                    : "bg-amber-600"
                              }`}>
                                {order.paymentStatus === "paid" && "Paid (Card)"}
                                {order.paymentStatus === "points_deducted" && "Redeemed (Pts)"}
                                {order.paymentStatus === "pending_cod" && "COD Pending"}
                              </span>

                              {/* Shipping status badge */}
                              <span className={`px-3 py-1 rounded-full flex items-center gap-1 ${
                                order.shippingStatus === "shipped"
                                  ? "bg-emerald-800"
                                  : "bg-[#88A070]"
                              }`}>
                                {order.shippingStatus === "shipped" ? "✓ Shipped" : "⏳ Arriving Soon"}
                              </span>
                            </div>
                          </div>

                          {/* Items listing */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {order.items.map((item, idx) => {
                              const calculatedPoints = item.product.pricePoints || Math.ceil(item.product.priceCurrency * 0.2);
                              return (
                                <div
                                  key={idx}
                                  className="flex items-center space-x-3 p-3 bg-cream-50/70 border border-forest-100/50 rounded-2xl"
                                >
                                  {item.product.image ? (
                                    <img
                                      src={item.product.image}
                                      alt={item.product.name}
                                      className="h-11 w-11 rounded-xl object-cover border border-[#88A070]/20"
                                    />
                                  ) : (
                                    <div className="h-11 w-11 bg-sage-100 rounded-xl flex items-center justify-center text-lg">
                                      🌱
                                    </div>
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-xs text-forest-950 truncate">{item.product.name}</h4>
                                    <p className="text-[10px] text-forest-700 leading-none mt-1">
                                      Qty: <span className="font-mono font-bold text-forest-900">{item.quantity}</span> • Rs. {item.product.priceCurrency} <span className="text-[9px] text-purple-600 font-semibold font-mono">({calculatedPoints} PTS)</span>
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Ecological Coin impact audit line */}
                          <div className="mt-4 pt-3 border-t border-forest-100/40 flex justify-between items-center text-[10px] font-bold">
                            <span className="text-sage-600 flex items-center gap-1">
                              <Coins className="h-3.5 w-3.5 text-gold-500" />
                              Ecological Coin Audit:
                            </span>
                            <span className={`${order.paymentMethod === "points" || order.pointsCredited ? "text-emerald-700" : "text-amber-700"}`}>
                              {order.paymentMethod === "points"
                                ? `-${pointsNeeded} PTS Deducted at Checkout`
                                : order.pointsCredited
                                  ? `✓ +${order.pointsAwarded} PTS Credited to Ledger`
                                  : `⏳ +${order.pointsAwarded} PTS Pending Shipment`
                              }
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CUSTOMER TABS */}
        {currentUser.role === "customer" && currentTab === "profiles" && (
          <ProfilesView 
            accounts={accounts} 
            products={products} 
            onBookAppointmentClick={handleVisitBookAppointment} 
            onAddToCart={handleAddToCart}
            currentUser={currentUser}
          />
        )}

        {currentUser.role === "customer" && currentTab === "cart" && (
          <CartPayment 
            cart={cart} 
            setCart={setCart} 
            currentUser={currentUser} 
            onAddPoints={handleAddPoints} 
            onDeductPoints={handleDeductPoints}
            orders={orders} 
            setOrders={setOrders} 
            onSubmitOrderSuccess={(msg) => {
              setToastMessage(msg);
              setCurrentTab("dashboard");
            }}
          />
        )}

        {currentTab === "appointments" && (
          <Appointments 
            currentUser={currentUser} 
            accounts={accounts} 
            appointments={appointments} 
            setAppointments={setAppointments} 
            directMessages={directMessages} 
            setDirectMessages={setDirectMessages} 
            onDeductPoints={handleDeductPoints} 
            onAddPoints={handleAddPoints}
            onChallengeProgress={handleChallengeProgress}
          />
        )}

        {currentTab === "doctor" && (
          <BotanyDoctor 
            onChallengeProgress={handleChallengeProgress} 
            chatHistory={chatHistory} 
            setChatHistory={setChatHistory} 
          />
        )}

        {currentTab === "store" && (
          <Store 
            products={products} 
            setProducts={setProducts} 
            profile={legacyProfile} 
            onAddPoints={handleAddPoints}
            onChallengeProgress={handleChallengeProgress}
            onAddToCart={handleAddToCart}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === "communities" && (
          <Community 
            communities={communities}
            setCommunities={setCommunities}
            profile={legacyProfile}
            onAddPoints={handleAddPoints}
            onChallengeProgress={handleChallengeProgress}
          />
        )}

        {currentTab === "news" && (
          <News 
            articles={news}
            profile={legacyProfile}
            onAddPoints={handleAddPoints}
          />
        )}

        {currentTab === "challenges" && (
          <Challenges 
            challenges={challenges}
            onClaimReward={handleClaimReward}
            profile={legacyProfile}
            setProfile={setLegacyProfile}
            onDeductPoints={handleDeductPoints}
            onAddPoints={handleAddPoints}
            setCurrentTab={setCurrentTab}
          />
        )}

        {/* VENDOR SPECIFIC VIEWS */}
        {currentUser.role === "vendor" && currentTab === "vendor_dashboard" && (
          <VendorDashboard 
            currentUser={currentUser} 
            products={products} 
            setProducts={setProducts} 
            orders={orders} 
            onAddPoints={handleAddPoints}
          />
        )}

        {/* ADMIN SPECIFIC VIEWS */}
        {currentUser.role === "admin" && currentTab === "admin_dashboard" && (
          <AdminDashboard 
            orders={orders} 
            setOrders={setOrders} 
            accounts={accounts} 
            setAccounts={setAccounts} 
            onAdminShipOrder={handleAdminShipOrder}
          />
        )}

      </main>

      {/* Slide-out/modal Sidebar for Editing User profile */}
      {showProfileDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-forest-950/40 backdrop-blur-xs transition-opacity" onClick={() => setShowProfileDrawer(false)} />
          
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="w-screen max-w-md transform bg-cream-50 border-l border-forest-100 p-6 sm:p-8 flex flex-col justify-between shadow-2xl animate-slideIn">
              
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-forest-100 mb-6">
                  <h3 className="font-display font-extrabold text-forest-900 text-lg">
                    Member profile details
                  </h3>
                  <button
                    onClick={() => setShowProfileDrawer(false)}
                    className="h-8 w-8 rounded-lg bg-forest-100 hover:bg-forest-250 text-forest-800 transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <form id="profile-edit-form" onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="flex items-center space-x-4 mb-4">
                    <img src={currentUser.avatar} alt={currentUser.name} referrerPolicy="no-referrer" className="h-16 w-16 rounded-2xl object-cover" />
                    <div>
                      <h4 className="font-bold text-sm uppercase text-forest-950 leading-none">{currentUser.name}</h4>
                      <span className="text-[10px] text-sage-500 uppercase tracking-widest font-mono font-bold mt-1 inline-block">{currentUser.role} Workspace</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-forest-900 uppercase">Interactive Persona Name</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-forest-100 bg-cream-100/30 px-3.5 py-2.5 text-xs text-forest-950"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-forest-900 uppercase">Member Bio Description</label>
                    <textarea
                      required
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-forest-100 bg-cream-100/30 p-3 text-xs text-forest-950 h-24 resize-none"
                    />
                  </div>
                </form>
              </div>

              <div className="mt-8 pt-4 border-t border-forest-100 space-y-3">
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to reset simulation ledger?")) {
                      setAccounts(INITIAL_ACCOUNTS);
                      setCurrentUserId("acc-customer-1");
                      setProducts(INITIAL_PRODUCTS);
                      setCommunities(INITIAL_COMMUNITIES);
                      setChallenges(INITIAL_CHALLENGES);
                      setCart([]);
                      setAppointments([]);
                      setDirectMessages([]);
                      setOrders([]);
                      setChatHistory([]);
                      setToastMessage("Simulator defaults restored.");
                      setShowProfileDrawer(false);
                      setIsLoggedIn(true);
                    }
                  }}
                  className="w-full py-2.5 bg-red-650/5 hover:bg-rose-500/10 text-red-700 hover:text-red-800 text-xs font-bold rounded-xl flex items-center justify-center space-x-1 border border-red-300 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset Simulation Ledger</span>
                </button>

                <button
                  type="submit"
                  form="profile-edit-form"
                  className="w-full py-3 cursor-pointer bg-forest-900 hover:bg-forest-950 text-cream-50 text-xs font-extrabold rounded-xl shadow-md transition-all text-center"
                >
                  Save Profile Settings
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-forest-100 bg-cream-50 mt-16 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-xs text-sage-600 space-y-2">
          <p className="font-display font-medium text-forest-900">
            GUL House Gardening Canopy Ecosystem Prototype
          </p>
          <p className="text-[11px]">
            Fully functional client-server concept backed with Google Gemini Flash-3.5 Phyto-Diagnosis capabilities.
          </p>
        </div>
      </footer>

    </div>
  );
}

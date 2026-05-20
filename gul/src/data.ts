import { Product, CommunityPost, NewsArticle, Challenge, VirtualPlant } from "./types";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Peace Lily 'GUL Special'",
    category: "Indoor Plants",
    description: "An elegant, shade-loving purifier. Promotes healthy indoor air circulation with rich dark broad leaves and stunning white sail-shaped blooms.",
    priceCurrency: 1250,
    pricePoints: 250,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=400",
    sellerName: "Greenwood Valley Nurseries",
    sellerRole: "guild-nursery",
    stock: 14
  },
  {
    id: "prod-2",
    name: "Organic Heirloom Cherry Tomato Seeds",
    category: "Organic Seeds",
    description: "Pack of 100 super-active organic seeds optimized for home balconies and small patio gardening pots. High germination rate guarantee.",
    priceCurrency: 320,
    pricePoints: 60,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=400",
    sellerName: "Baba's Organic Farm & Seed Bank",
    sellerRole: "local-farmer",
    stock: 50
  },
  {
    id: "prod-3",
    name: "Handmade Saffron Terracotta Craft Urn",
    category: "Artisan Pots",
    description: "Stretches back to traditional clay potting heritage. Double-kilned terracotta featuring organic ventilation pores that prevent soil waterlog.",
    priceCurrency: 1800,
    pricePoints: 350,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=400",
    sellerName: "Kashan Potter Guild",
    sellerRole: "hobbyist",
    stock: 6
  },
  {
    id: "prod-4",
    name: "Liquid Neem-Shell Extract (Biopesticide)",
    category: "Biological Fertilizers",
    description: "Cold-pressed natural plant defense tonic. Effectively counters leaf mites, scale bugs, and whiteflies while feeding the beneficial potting micro-fauna.",
    priceCurrency: 850,
    pricePoints: 180,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1605000797439-75a150088d44?auto=format&fit=crop&q=80&w=400",
    sellerName: "Gul-Botanix Laboratories",
    sellerRole: "botanical-store",
    stock: 22
  },
  {
    id: "prod-5",
    name: "Swiss-Cheese Monstera Deliciosa",
    category: "Indoor Plants",
    description: "Vibrant evergreen indoor giant. Features dramatic split-leaf architecture. Perfect for glowing up living room corners or shaded home office spaces.",
    priceCurrency: 2100,
    pricePoints: 400,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=400",
    sellerName: "Nurture Nursery",
    sellerRole: "guild-nursery",
    stock: 8
  },
  {
    id: "prod-6",
    name: "Crimson Hybrid Bougainvillea Starter",
    category: "Outdoor Flowers",
    description: "Sun-thriving hardy climber plant with heavy crimson leaf blooms. Spectacular selection for standard house fences, boundary walls, or roof terraces.",
    priceCurrency: 1100,
    pricePoints: 200,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&q=80&w=400",
    sellerName: "Baba's Organic Farm & Seed Bank",
    sellerRole: "local-farmer",
    stock: 12
  }
];

export const INITIAL_COMMUNITIES: CommunityPost[] = [
  {
    id: "post-1",
    title: "My Fiddle Leaf Fig leaves are drooping and turning yellow - advice needed!",
    content: "I started house-gardening 3 months ago with this Fiddle Leaf Fig. Recently, the lower leaves have started showing prominent yellowing with soft dark edges. I water it roughly every alternate day when the top surface looks slightly dry. Is this a symptom of overwatering or root moisture stress?",
    category: "disease-help",
    authorName: "Ayesha Malik",
    authorBadge: "Sprout Caretaker",
    authorRole: "customer",
    likesCount: 14,
    date: "2026-05-18",
    tag: "Yellowing Leaves",
    comments: [
      {
        id: "com-1",
        authorName: "Hamza Tariq",
        authorRole: "seller",
        content: "Every alternate day is highly likely too frequent for Fiddle Leaf Figs! Their roots need aerated drying periods. Insert a wooden chopstick 3-4 inches into the soil; water ONLY if it comes out completely dry.",
        date: "2026-05-18"
      },
      {
        id: "com-2",
        authorName: "Dr. Gul AI Bot",
        authorRole: "customer",
        content: "Beep! You can copy-paste this direct query inside my chat box above! I'll instantly draft a tailored water treatment schedule with step-by-step root revival exercises for Ayesha's exact environmental settings.",
        date: "2026-05-19"
      }
    ]
  },
  {
    id: "post-2",
    title: "Eco Seed Swapping Drive - Exchange Lemon Sprouts for Jasmine Cuttings",
    content: "Greetings fellow gardening enthusiasts! I have 10 incredibly healthy germinated organic Lemon saplings growing in bio-degradable coco cups. I am looking to trade 4 of them for some local Jasmine flower vines or standard Rose cuttings in Lahore. Happy to meet up or ship safely in custom breathable plant packets!",
    category: "seed-swap",
    authorName: "Zainab Gool",
    authorBadge: "Earth Guardian",
    authorRole: "customer",
    likesCount: 22,
    date: "2026-05-19",
    tag: "Seed Swap",
    comments: [
      {
        id: "com-3",
        authorName: "Noman Shah",
        authorRole: "customer",
        content: "I have some premium Sufi White Jasmine cuttings rooted in wet sand! I would absolutely love to trade two lemons for these. Sending you a direct platform message.",
        date: "2026-05-19"
      }
    ]
  },
  {
    id: "post-3",
    title: "Top 5 organic pest deterrent secrets for Commercial Sellers in summer",
    content: "As professional plant growers, avoiding toxic pesticide sprays on indoor foliage plants is both a core sales pitch and ethical standard. Here are our nurseries' secret organic recipes: 1) Garlic oil-pepper extract soap spray for aphids, 2) Cinnamon powder soil seasoning for fungal dampening, and 3) Rosemary essential oil vapors. Your buyers will love the aromatic, chemical-free scent!",
    category: "seller-hub",
    authorName: "Siddique Nurseries HQ",
    authorBadge: "Master Agronomist",
    authorRole: "seller",
    likesCount: 31,
    date: "2026-05-15",
    tag: "Seller Secrets",
    comments: [
      {
        id: "com-4",
        authorName: "Farhan Dev",
        authorRole: "customer",
        content: "This cinnamon trick is wonderful! I seasoned my small mint containers and it instantly stopped the fuzzy white mold from creeping over the upper loam.",
        date: "2026-05-16"
      }
    ]
  }
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: "art-1",
    title: "The Urban Canopy Revival: How House Gardens are Combating City Heat-Islands",
    summary: "New meteorological telemetry confirms that high-density residential balcony plants and terrace gardens cool building surfaces by up to 4°C through natural transpiration.",
    fullText: "A collaborative atmospheric experiment by urban forestry researchers reveals the massive collective impact of home gardening networks. Dubbed 'Residential Transpiration Coolers', thousands of closely clustered foliage balconies and rooftop gardens together act as large-scale air conditioning networks. In neighborhoods like city centers where concrete can trap intense heat, homes utilizing outdoor flower beds, climbing creepers, and dense potted groupings reported a measured drop in indoor temperatures. This reduces personal electric cooling expenditure, actively supports urban bee populations, and forms natural micro-climates that ease modern stress levels.",
    source: "Global Botany Journal",
    date: "2026-05-18",
    badge: "conservation",
    imageUrl: "https://images.unsplash.com/photo-1530745342582-0795f23ec976?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "art-2",
    title: "Understanding Soil Microbiome: The Secret Underground Network in Your Pots",
    summary: "The beautiful science behind organic composting and why synthetic chemical sprays could harm your home garden's underground fungal root companions.",
    fullText: "Healthy soil isn't just dark dirt—it's a thriving biological metropolis. Agronomists specify that high-quality house potting loam contains billions of helpful bacteria and Mycorrhizal fungi. These microscopic structures form dynamic symbiotic relationships with plant root capillaries, helping them trade water and crucial minerals for sugar. Introducing heavy synthetic liquid chemical feeds can disrupt this cycle, pushing roots into chemical dependency and deteriorating soil texture over seasons. Resorting instead to biological feeds, like dry leaf compost, eggshell powder, compost tea, and neem leaves, keeps the underground metropolis active, strong, and highly resistant to leaf root fungus.",
    source: "Science Daily - Soil Branch",
    date: "2026-05-16",
    badge: "research",
    imageUrl: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "art-3",
    title: "Monstera Root Grooming: Simple Steps to Stop Root Binding in Tight Indoor Pots",
    summary: "A practical guide to identifying root binding issues in major indoor foliage plants and how to safely guide repotting without shocking the foliage.",
    fullText: "Is your beloved Monstera growing thick woody roots out of bottom drainage outlets? Runaway aerial roots are happy signs of vigor, but underwater root binding constricts vital nutrition absorption. In this guide, botanists outline the safe repotting ritual: 1) Gently water 24 hours prior to loosen soil adhesion, 2) Slide the root structure out vertically, 3) Gently untangle dense spiral root grids at the base, and 4) Plant directly into a 3-inch wider organic container lined with thick perlite gravel to support optimal water flow.",
    source: "Gardener's Handbook Quarterly",
    date: "2026-05-12",
    badge: "gardening-tips",
    imageUrl: "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=400"
  }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: "cha-1",
    title: "Ecological Tree Planter",
    description: "Successfully plant trees or saplings in your home, community yard, or local garden. Track your eco-footprint directly!",
    rewardPoints: 100,
    targetValue: 5,
    currentValue: 3,
    completed: false,
    claimed: false,
    actionLabel: "Add Sapling",
    metricType: "planting"
  },
  {
    id: "cha-2",
    title: "Botanical Diagnostic Quiz",
    description: "Submit a plant health inquiry to Dr. Gul (our Expert AI Doctor) to diagnose leaf spots, pests, or humidity issues.",
    rewardPoints: 50,
    targetValue: 1,
    currentValue: 0,
    completed: false,
    claimed: false,
    actionLabel: "Consult Doctor",
    metricType: "diagnosing"
  },
  {
    id: "cha-3",
    title: "Eco Seed Swapper",
    description: "Post a friendly seed-swap or plant cutting proposal in our community to share rare organic specimens with neighbors.",
    rewardPoints: 80,
    targetValue: 1,
    currentValue: 0,
    completed: false,
    claimed: false,
    actionLabel: "Host Trade",
    metricType: "sharing"
  },
  {
    id: "cha-4",
    title: "Local Market Patron",
    description: "Purchase active botanical supplies, pots, or organic green starters from local sellers or nursery creators in GUL Store.",
    rewardPoints: 120,
    targetValue: 1,
    currentValue: 0,
    completed: false,
    claimed: false,
    actionLabel: "Browse Store",
    metricType: "purchasing"
  }
];

export const VIRTUAL_FLOWERS: VirtualPlant[] = [
  {
    id: "vp-1",
    name: "Royal Crimson Rose",
    costPoints: 100,
    growthStage: "seedling",
    description: "A gorgeous historic scarlet bloom representing loyalty and organic passion.",
    svgPath: "M12 2C8 2 6 5 6 9c0 4 6 11 6 11s6-7 6-11c0-4-2-7-6-7zm0 10c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
  },
  {
    id: "vp-2",
    name: "Golden Jasmine Vine",
    costPoints: 180,
    growthStage: "seedling",
    description: "Sweetly scented climbing climber with glowing bright yellow honey stars.",
    svgPath: "M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm0 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"
  },
  {
    id: "vp-3",
    name: "Sacred Saffron Lily",
    costPoints: 250,
    growthStage: "seedling",
    description: "Exquisite royal magenta lily holding premium culinary saffron threads inside.",
    svgPath: "M12 3v18M3 12h18M12 3l9 9-9 9-9-9 9-9z"
  },
  {
    id: "vp-4",
    name: "Emerald Fern Frill",
    costPoints: 300,
    growthStage: "seedling",
    description: "Dense shade-loving prehistoric crown that cleans virtual carbon-emissions.",
    svgPath: "M12 2l2 4 4-2-2 4 4 2-4 2 2 4-4-2-2 4-2-4-4 2 2-4-4-2 4-2-2-4 4 2z"
  }
];

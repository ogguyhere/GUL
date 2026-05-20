import React, { useState } from "react";
import { Search, ShoppingBag, Plus, Sparkles, Filter, CheckCircle, ArrowRight, UserCheck, AlertCircle } from "lucide-react";
import { Product, UserProfile } from "../types";

interface StoreProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  profile: UserProfile;
  onAddPoints: (amount: number) => void;
  onChallengeProgress: (type: "clipping" | "sharing" | "diagnosing" | "planting" | "purchasing", amount: number) => void;
  onAddToCart: (product: Product) => void;
  setCurrentTab: (tab: string) => void;
}

export default function Store({ products, setProducts, profile, onAddPoints, onChallengeProgress, onAddToCart, setCurrentTab }: StoreProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isSellerMode, setIsSellerMode] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Listing form state for sellers
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState<Product["category"]>("Indoor Plants");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");

  const categories = [
    "All",
    "Indoor Plants",
    "Outdoor Flowers",
    "Organic Seeds",
    "Biological Fertilizers",
    "Artisan Pots",
  ];

  // Filters
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDesc || !newPrice) {
      setErrorText("Please fill out name, description and price.");
      return;
    }

    const priceNum = parseFloat(newPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setErrorText("Please state a valid numeric price.");
      return;
    }

    const stockNum = parseInt(newStock) || 5;

    // We can use a randomized high-quality unsplash fallback for house gardening or plants
    const plantUnsplashImages = [
      "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1453904300433-a2686788af0c?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1533038590840-1cde6b668731?auto=format&fit=crop&q=80&w=400",
    ];
    const pickedImage = plantUnsplashImages[Math.floor(Math.random() * plantUnsplashImages.length)];

    const addedProd: Product = {
      id: `prod-user-${Date.now()}`,
      name: newName,
      category: newCategory,
      description: newDesc,
      priceCurrency: priceNum,
      pricePoints: Math.ceil(priceNum * 0.2), // conversion factor for point redemption
      rating: 5.0,
      image: pickedImage,
      sellerName: profile.name,
      sellerRole: "hobbyist",
      stock: stockNum,
    };

    setProducts((prev) => [addedProd, ...prev]);
    setPurchaseSuccess(`Successfully listed "${newName}" in GUL Market!`);
    
    // reset form
    setNewName("");
    setNewDesc("");
    setNewPrice("");
    setNewStock("");
    setErrorText(null);
    setIsSellerMode(false); // return to store browse

    // Earning 30 seller points for contributing to the local seed economy!
    onAddPoints(30);
  };

  const handleAddToBasketOnly = (product: Product) => {
    onAddToCart(product);
  };

  const handleBuyAndCheckoutDirectly = (product: Product) => {
    onAddToCart(product);
    setCurrentTab("cart");
  };

  return (
    <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
      {/* Upper banner section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-forest-100 pb-5 mb-6 gap-4">
        <div>
          <h2 className="font-display text-3xl font-extrabold text-forest-900 tracking-tight">GUL Botanical Bazaar</h2>
          <p className="text-xs sm:text-sm text-sage-700 mt-1">
            Browse and trade active plant species, nutrient soil, seed kits, and beautiful handcrafted artisan pots.
          </p>
        </div>

        {/* Seller Mode Toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-forest-800">Browse Mode</span>
          <button
            onClick={() => {
              setIsSellerMode(!isSellerMode);
              setPurchaseSuccess(null);
              setErrorText(null);
            }}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-1 focus:ring-sage-500 ${
              isSellerMode ? "bg-forest-900" : "bg-sage-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-cream-50 shadow-sm ring-0 transition duration-200 ease-in-out ${
                isSellerMode ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span className="text-xs font-bold text-forest-900 flex items-center space-x-1">
            <span>Seller Hub</span>
            <UserCheck className="h-3.5 w-3.5 text-sage-600" />
          </span>
        </div>
      </div>

      {/* Visual notification boxes */}
      {purchaseSuccess && (
        <div className="mb-6 rounded-xl border border-emerald-300 bg-emerald-500/10 p-4 flex items-start space-x-3 text-emerald-800 animate-fadeIn">
          <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm font-medium">{purchaseSuccess}</div>
        </div>
      )}

      {errorText && (
        <div className="mb-6 rounded-xl border border-red-300 bg-red-500/10 p-4 flex items-start space-x-3 text-red-800 animate-fadeIn">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm font-medium">{errorText}</div>
        </div>
      )}

      {/* SELLER MODE (Publish listings) */}
      {isSellerMode ? (
        <div className="mx-auto max-w-2xl rounded-[32px] border-2 border-forest-900/10 bg-cream-50 shadow-xs overflow-hidden p-6 sm:p-8">
          <div className="flex items-center space-x-2 border-b border-forest-100 pb-4 mb-6">
            <Plus className="h-5 w-5 text-gold-500" />
            <h3 className="font-display font-bold text-forest-900 text-lg">List a Gardening Item for Sale</h3>
          </div>

          <form onSubmit={handleCreateListing} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-forest-900 uppercase">Plant / Product Name</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Rare Velvet Purple Orchid Starter"
                className="mt-1.5 w-full rounded-xl border border-forest-100 bg-cream-100/30 px-3 py-2.5 text-xs sm:text-sm text-forest-950 placeholder-sage-400 focus:outline-hidden focus:ring-1 focus:ring-sage-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-forest-900 uppercase">Product Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as Product["category"])}
                  className="mt-1.5 w-full rounded-xl border border-forest-100 bg-cream-100/30 px-3 py-2.5 text-xs sm:text-sm text-forest-950 focus:outline-hidden focus:ring-1 focus:ring-sage-500"
                >
                  <option value="Indoor Plants">Indoor Plants</option>
                  <option value="Outdoor Flowers">Outdoor Flowers</option>
                  <option value="Organic Seeds">Organic Seeds</option>
                  <option value="Biological Fertilizers">Biological Fertilizers</option>
                  <option value="Artisan Pots">Artisan Pots</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-900 uppercase">Price (Rs.)</label>
                <input
                  type="number"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="e.g. 500"
                  className="mt-1.5 w-full rounded-xl border border-forest-100 bg-cream-100/30 px-3 py-2.5 text-xs sm:text-sm text-forest-950 placeholder-sage-400 focus:outline-hidden focus:ring-1 focus:ring-sage-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-forest-900 uppercase">Available Stock</label>
                <input
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  placeholder="e.g. 10"
                  className="mt-1.5 w-full rounded-xl border border-forest-100 bg-cream-100/30 px-3 py-2.5 text-xs sm:text-sm text-forest-950 placeholder-sage-400 focus:outline-hidden focus:ring-1 focus:ring-sage-500"
                />
              </div>

              <div className="bg-amber-500/5 rounded-xl border border-gold-400/30 p-3 self-end text-[11px] text-forest-800">
                <span className="font-bold block text-gold-600">💡 Point Listing Bonus!</span>
                You will instantly receive **+30 dynamic GUL points** on listing your first local nursery harvest.
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-900 uppercase">Detailed Botanical Description</label>
              <textarea
                required
                rows={4}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Mention watering schedules, light limits, flower frequency, or specific features..."
                className="mt-1.5 w-full rounded-xl border border-forest-100 bg-cream-100/30 px-3 py-2.5 text-xs sm:text-sm text-forest-950 placeholder-sage-400 focus:outline-hidden focus:ring-1 focus:ring-sage-500"
              />
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsSellerMode(false)}
                className="px-4 py-2 text-xs font-semibold text-forest-800 hover:bg-forest-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-forest-900 hover:bg-forest-950 text-cream-50 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center space-x-1"
              >
                <span>Publish Listing</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* BUYER MODE (Browse listings & products) */
        <div>
          {/* Filters & search bars */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-cream-50 p-5 rounded-[32px] border-2 border-forest-900/10 shadow-xs">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-sage-400" />
              <input
                type="text"
                placeholder="Search seed varieties, succulents, artisan terracotta..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-forest-100 bg-cream-100/30 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-forest-950 placeholder-sage-400 focus:outline-hidden focus:ring-1 focus:ring-sage-500"
              />
            </div>

            {/* Category horizontal filters */}
            <div className="flex overflow-x-auto whitespace-nowrap scrollbar-none space-x-1.5 pb-1 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-forest-900 text-cream-50"
                      : "text-forest-800 hover:bg-forest-100 bg-cream-100/40 border border-forest-100/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid list of catalog */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-cream-50 rounded-[32px] border-2 border-forest-900/10 p-8 max-w-sm mx-auto">
              <ShoppingBag className="mx-auto h-12 w-12 text-sage-300" />
              <h4 className="mt-4 text-sm font-bold text-forest-900">No items detected</h4>
              <p className="text-xs text-forest-700 mt-1">Try relaxing your search terms or category selections above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => {
                const calculatedPoints = p.pricePoints || Math.ceil(p.priceCurrency * 0.2);
                return (
                  <div
                    key={p.id}
                    className="flex flex-col h-full rounded-[32px] border-2 border-forest-900/10 bg-cream-50 overflow-hidden shadow-2xs hover:shadow-xs hover:scale-[1.01] transition-all group"
                  >
                    {/* Plant photo with fallback */}
                    <div className="relative h-48 w-full overflow-hidden bg-forest-100">
                      <img
                        src={p.image}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-3 right-3 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-forest-900/80 text-cream-50 backdrop-blur-xs">
                        {p.category}
                      </span>
                    </div>

                    {/* Meta specifics */}
                    <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                      <div>
                        {/* Rating & Stock */}
                        <div className="flex items-center justify-between text-[10px] font-mono font-medium text-sage-600 mb-2">
                          <span>⭐⭐⭐⭐⭐ {p.rating.toFixed(1)}</span>
                          <span className={p.stock > 5 ? "text-sage-600" : "text-amber-600 font-bold"}>
                            {p.stock > 0 ? `${p.stock} left in stock` : "Sold Out"}
                          </span>
                        </div>

                        {/* Plant title */}
                        <h4 className="font-display font-extrabold text-base text-forest-900 group-hover:text-forest-950 transition-colors leading-snug">
                          {p.name}
                        </h4>

                        {/* Description excerpt */}
                        <p className="text-[11px] sm:text-xs text-forest-700 mt-2 line-clamp-2 leading-relaxed">
                          {p.description}
                        </p>

                        {/* Seller profile indicator */}
                        <div className="border-t border-forest-50 mt-4 pt-3 flex items-center justify-between text-[10px]">
                          <span className="text-forest-600">Listed by <span className="font-bold text-forest-800">{p.sellerName}</span></span>
                          <span className="text-sage-700 bg-sage-200/50 rounded-sm px-1.5 py-0.5 max-w-[120px] truncate">
                            {p.sellerRole}
                          </span>
                        </div>
                      </div>

                      {/* Buy action drawer */}
                      <div className="border-t border-forest-100 mt-4 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex flex-col">
                          <span className="text-xs text-forest-600 font-mono scale-95 origin-left">Price RS</span>
                          <span className="font-display text-base font-bold text-forest-900 leading-tight">
                            Rs. {p.priceCurrency}
                          </span>
                          <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-0.5 mt-0.5 mt-1 bg-amber-500/5 px-2 py-0.5 rounded-sm border border-gold-400/10">
                            <Sparkles className="h-2.5 w-2.5 text-gold-500 shrink-0" />
                            <span>Or {calculatedPoints} PTS</span>
                          </span>
                        </div>

                        <div className="flex items-center space-x-1.5 shrink-0">
                          {/* Add to Cart button */}
                          <button
                            onClick={() => handleAddToBasketOnly(p)}
                            title="Add item to your basket"
                            className="bg-cream-100/70 border-2 border-forest-900/10 hover:border-forest-950 text-forest-950 font-bold text-[10px] px-2.5 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1 hover:bg-cream-200"
                          >
                            <ShoppingBag className="h-3 w-3 shrink-0" />
                            <span>Add Basket</span>
                          </button>

                          {/* Instant Checkout button */}
                          <button
                            onClick={() => handleBuyAndCheckoutDirectly(p)}
                            title="Buy now and check out instantly"
                            className="bg-forest-900 cursor-pointer text-cream-50 font-extrabold text-[10px] hover:bg-forest-950 px-2.5 py-2 rounded-xl transition-all flex items-center justify-center space-x-1 hover:shadow-xs"
                          >
                            <span>Buy Now</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

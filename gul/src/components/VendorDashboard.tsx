import React, { useState } from "react";
import { Product, Order, UserAccount } from "../types";
import { ShoppingBag, Plus, Sparkles, Trash2, Coins, Landmark, Archive, ShieldCheck, CheckSquare, PlusCircle } from "lucide-react";

interface VendorDashboardProps {
  currentUser: UserAccount;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  onAddPoints: (amount: number) => void;
}

export default function VendorDashboard({
  currentUser,
  products,
  setProducts,
  orders,
  onAddPoints
}: VendorDashboardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Product listing form state
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState<Product["category"]>("Indoor Plants");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("10");

  // Filter products listed by this vendor
  const vendorProducts = products.filter(
    (p) => p.sellerName.toLowerCase().trim() === currentUser.name.toLowerCase().trim()
  );

  // Calculate Vendor Earnings (sum of priceCurrency * quantity for items bought that match this vendor's listings)
  const vendorSalesOrders = orders.filter((o) =>
    o.items.some((item) => item.product.sellerName.toLowerCase().trim() === currentUser.name.toLowerCase().trim())
  );

  const earnings = vendorSalesOrders.reduce((sum, order) => {
    const vendorItemsPrice = order.items
      .filter((item) => item.product.sellerName.toLowerCase().trim() === currentUser.name.toLowerCase().trim())
      .reduce((t, item) => t + item.product.priceCurrency * item.quantity, 0);
    return sum + vendorItemsPrice;
  }, 0);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");

    const priceNum = parseFloat(price);
    if (!name || !desc || isNaN(priceNum) || priceNum <= 0) {
      alert("Please fill out all fields with valid information.");
      return;
    }

    const stockNum = parseInt(stock) || 10;
    const unsplashPics = [
      "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=400"
    ];
    const pickImage = unsplashPics[Math.floor(Math.random() * unsplashPics.length)];

    const addedProd: Product = {
      id: `prod-vendor-${Date.now()}`,
      name,
      category,
      description: desc,
      priceCurrency: priceNum,
      pricePoints: Math.ceil(priceNum * 0.2),
      rating: 5.0,
      image: pickImage,
      sellerName: currentUser.name,
      sellerRole: "guild-nursery",
      stock: stockNum,
      sellerId: currentUser.id
    };

    setProducts((prev) => [addedProd, ...prev]);
    setSuccessMsg(`"${name}" is listed successfully inside GUL Bazaar store!`);
    setIsAdding(false);

    // Reset Form
    setName("");
    setDesc("");
    setPrice("");
    setStock("10");

    // Award standard points
    onAddPoints(20);
  };

  const handleDeleteListing = (productId: string) => {
    if (confirm("Are you sure you want to remove this active listing from GUL Store?")) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
  };

  return (
    <div className="mx-auto max-w-7xl py-6 px-4 animate-fadeIn">
      {/* Title Header */}
      <div className="border-b border-forest-100 pb-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-extrabold text-forest-900 tracking-tight flex items-center">
            <ShoppingBag className="h-8 w-8 text-emerald-600 mr-2.5 animate-pulse" />
            <span>Nursery Guild Merchant Terminal</span>
          </h2>
          <p className="text-xs sm:text-sm text-sage-700 mt-1">
            Dispatch fresh organic foliage starters, update inventory levels, and check custom nursery business statistics.
          </p>
        </div>
        <div className="bg-emerald-900/10 border border-emerald-500/20 text-emerald-800 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider">
          Partner Guild: {currentUser.name}
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 rounded-[24px] border-2 border-emerald-300 bg-emerald-500/10 p-5 text-xs sm:text-sm font-bold text-emerald-800 animate-fadeIn">
          ✓ {successMsg}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-[32px] bg-[#112318] text-cream-50 shadow-xs flex flex-col justify-between">
          <Landmark className="h-6 w-6 text-emerald-400" />
          <div className="mt-4">
            <span className="text-[10px] text-emerald-200 uppercase tracking-widest font-mono font-bold block">Gross Revenue Earned</span>
            <span className="text-2xl font-black font-mono mt-1 block">Rs. {earnings}</span>
          </div>
        </div>

        <div className="p-6 rounded-[32px] bg-cream-50 border-2 border-forest-900/10 shadow-xs flex flex-col justify-between text-forest-900">
          <Archive className="h-6 w-6 text-sage-500" />
          <div className="mt-4">
            <span className="text-[10px] text-sage-500 uppercase tracking-widest font-mono font-bold block">Items Under Catalog</span>
            <span className="text-2xl font-extrabold font-mono mt-1 block">{vendorProducts.length} Listings</span>
          </div>
        </div>

        <div className="p-6 rounded-[32px] bg-cream-50 border-2 border-forest-900/10 shadow-xs flex flex-col justify-between text-forest-900">
          <Sparkles className="h-6 w-6 text-gold-500" />
          <div className="mt-4">
            <span className="text-[10px] text-sage-500 uppercase tracking-widest font-mono font-bold block">Active Sales orders</span>
            <span className="text-2xl font-extrabold font-mono mt-1 block">{vendorSalesOrders.length} Received</span>
          </div>
        </div>
      </div>

      {/* Main grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Listed products section */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-[40px] border-2 border-forest-900/10 bg-cream-50 p-6 sm:p-8 shadow-xs">
            <div className="flex justify-between items-center pb-4 border-b border-forest-100 mb-6">
              <h3 className="font-display font-black text-xs uppercase tracking-widest text-forest-900 flex items-center gap-1.5">
                <CheckSquare className="h-4 w-4 text-emerald-600" />
                <span>My Active Store Offerings ({vendorProducts.length})</span>
              </h3>
              <button
                onClick={() => setIsAdding(!isAdding)}
                className="px-4 py-2 cursor-pointer bg-forest-900 hover:bg-forest-950 text-cream-50 text-[10px] uppercase font-black tracking-wider rounded-full transition-all flex items-center space-x-1.5"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>{isAdding ? "Cancel Builder" : "Publish Listing (+20 PTS)"}</span>
              </button>
            </div>

            {isAdding && (
              <form onSubmit={handleAddProduct} className="p-5 border-2 border-dashed border-[#88A070]/30 rounded-[28px] bg-white space-y-4 mb-6 animate-fadeIn">
                <h4 className="font-display font-bold text-xs uppercase tracking-widest text-[#1B3022]/70">Publish New Organic Starter</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-sage-600 mb-1">Item Title Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rare Saffron Bud Kit"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-forest-900/10 rounded-xl p-2 text-xs text-forest-950 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-sage-600 mb-1">Category Type</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Product["category"])}
                      className="w-full bg-[#FAF9F5] border border-forest-900/10 rounded-xl p-2 text-xs text-forest-950 font-bold"
                    >
                      <option>Indoor Plants</option>
                      <option>Outdoor Flowers</option>
                      <option>Organic Seeds</option>
                      <option>Biological Fertilizers</option>
                      <option>Artisan Pots</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-sage-600 mb-1">Price (Rs. Currency)</label>
                    <input
                      type="number"
                      required
                      placeholder="1200"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-forest-900/10 rounded-xl p-2 text-xs text-forest-950 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-sage-600 mb-1">Warehouse Stock</label>
                    <input
                      type="number"
                      required
                      placeholder="10"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-forest-900/10 rounded-xl p-2 text-xs text-forest-950 font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-sage-600 mb-1">Description</label>
                  <textarea
                    required
                    placeholder="Details about seed origin, drainage pores, shade requirements..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-forest-900/10 rounded-xl p-2.5 text-xs text-forest-950 h-16 resize-none font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold uppercase text-[10px] tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
                >
                  CONFIRM BAZAAR PUBLISH (+20 PTS)
                </button>
              </form>
            )}

            {vendorProducts.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-10 w-10 text-sage-300 mx-auto mb-2" />
                <p className="text-xs text-forest-700 font-bold">You don't have listed botanicals currently.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {vendorProducts.map((p) => (
                  <div key={p.id} className="p-4 rounded-3xl bg-[#FAF9F5] border border-forest-900/5 hover:border-forest-900/10 transition-all flex flex-col justify-between">
                    <div>
                      <img src={p.image} className="h-28 w-full object-cover rounded-2xl mb-3" />
                      <h4 className="font-bold text-xs uppercase text-forest-950 leading-tight mb-1">{p.name}</h4>
                      <span className="text-[9px] uppercase tracking-wider font-mono font-black text-[#88A070] bg-[#88A070]/10 px-2.5 py-0.5 rounded-full inline-block">{p.category}</span>
                      <p className="text-[11px] text-forest-750 line-clamp-2 mt-2 leading-relaxed">"{p.description}"</p>
                    </div>

                    <div className="pt-3 border-t border-forest-100/50 mt-4 flex justify-between items-center">
                      <div className="font-mono text-xs text-forest-950 font-bold">
                        <p>Rs. {p.priceCurrency}</p>
                        <p className="text-[9px] text-sage-500 font-sans">Stock: {p.stock} units</p>
                      </div>

                      <button
                        onClick={() => handleDeleteListing(p.id)}
                        className="p-1.5 rounded-lg text-red-650 hover:bg-red-50 hover:text-red-750"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sales Logs */}
        <div className="lg:col-span-4 rounded-[40px] border-2 border-forest-900/10 bg-cream-50 p-6 shadow-xs">
          <h3 className="font-display font-black text-xs uppercase tracking-widest text-[#1B3022]/60 mb-5 flex items-center gap-1.5 pb-2 border-b border-forest-100">
            <Coins className="h-4 w-4 text-[#88A070]" />
            <span>Incoming Guild Orders ({vendorSalesOrders.length})</span>
          </h3>

          <div className="space-y-4">
            {vendorSalesOrders.length === 0 ? (
              <p className="text-[11px] text-sage-500 font-bold text-center py-6">No client purchases feature your listed plant stock yet.</p>
            ) : (
              vendorSalesOrders.map((ord) => (
                <div key={ord.id} className="p-3.5 bg-[#FAF9F5] border border-forest-900/5 rounded-2xl text-xs space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono border-b border-forest-900/5 pb-1.5">
                    <span className="font-black text-forest-950">ID: {ord.id}</span>
                    <span className="text-sage-400">{ord.shippingStatus.toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-bold text-forest-900">Buyer: {ord.customerName}</p>
                    <div className="mt-1 text-[11px] text-forest-750 pr-1">
                      {ord.items
                        .filter((i) => i.product.sellerName.toLowerCase().trim() === currentUser.name.toLowerCase().trim())
                        .map((i) => (
                          <p key={i.product.id}>• {i.product.name} x{i.quantity}</p>
                        ))}
                    </div>
                  </div>
                  <div className="text-[10px] text-sage-600 italic bg-forest-900/5 p-2 rounded-xl border border-forest-900/5 mt-2">
                    Payment Status: {ord.paymentStatus === "paid" ? "✅ captured" : "⏳ pending COD approve"}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

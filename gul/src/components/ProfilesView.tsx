import React, { useState } from "react";
import { UserAccount, Product } from "../types";
import { Star, MapPin, Award, ShoppingBag, Sparkles, MessageCircle, Calendar, ChevronLeft, ShieldCheck, Heart } from "lucide-react";

interface ProfilesViewProps {
  accounts: UserAccount[];
  products: Product[];
  onBookAppointmentClick: (botanist: UserAccount) => void;
  onAddToCart: (product: Product) => void;
  currentUser: UserAccount;
}

export default function ProfilesView({ accounts, products, onBookAppointmentClick, onAddToCart, currentUser }: ProfilesViewProps) {
  const [selectedProfile, setSelectedProfile] = useState<UserAccount | null>(null);

  // Filter accounts for botanists and vendors only
  const profiles = accounts.filter((acc) => acc.role === "botanist" || acc.role === "vendor");

  // Get products listed by the visited vendor
  const getVendorProducts = (vendorName: string) => {
    return products.filter(
      (p) => p.sellerName.toLowerCase().trim() === vendorName.toLowerCase().trim()
    );
  };

  const renderStars = (rating?: number) => {
    const rate = rating || 4.7;
    const count = Math.round(rate);
    return (
      <div className="flex items-center space-x-0.5 text-gold-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 fill-current ${i < count ? "text-gold-500" : "text-sage-200"}`}
          />
        ))}
        <span className="text-xs font-bold text-forest-800 ml-1">({rate})</span>
      </div>
    );
  };

  if (selectedProfile) {
    const isBotanist = selectedProfile.role === "botanist";
    const isVendor = selectedProfile.role === "vendor";
    const vendorProds = isVendor ? getVendorProducts(selectedProfile.name) : [];

    return (
      <div className="mx-auto max-w-4xl py-6 px-4 animate-fadeIn">
        {/* Back navigation button */}
        <button
          onClick={() => setSelectedProfile(null)}
          className="px-4 py-2 border-2 border-forest-900/10 rounded-full hover:border-forest-900 bg-cream-50 text-forest-900 text-xs font-black uppercase tracking-wider mb-6 flex items-center space-x-1.5 transition-all cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Member Directory</span>
        </button>

        {/* Hero Canopy Profile Card */}
        <div className="rounded-[40px] border-2 border-forest-900/10 bg-cream-50 p-6 sm:p-10 shadow-sm relative overflow-hidden mb-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl from-sage-400/20 to-gold-500/10 rounded-full blur-2xl pointer-events-none" />
          
          {/* Avatar Area */}
          <div className="md:col-span-4 flex flex-col items-center text-center">
            <div className="relative">
              <img
                src={selectedProfile.avatar}
                alt={selectedProfile.name}
                referrerPolicy="no-referrer"
                className="h-32 w-32 rounded-[32px] object-cover border-4 border-white shadow-md"
              />
              <span className={`absolute -bottom-2 -right-2 h-7 w-7 rounded-lg flex items-center justify-center text-sm shadow-md border border-forest-900/10 ${
                isBotanist ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
              }`}>
                {isBotanist ? "🩺" : "🛍️"}
              </span>
            </div>

            <h3 className="font-display font-black text-xl text-forest-900 mt-4 leading-tight">
              {selectedProfile.name}
            </h3>
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mt-2 inline-block ${
              isBotanist ? "bg-amber-500/10 text-amber-700" : "bg-emerald-500/10 text-emerald-700"
            }`}>
              {selectedProfile.role} Member
            </span>

            <div className="mt-4">{renderStars(selectedProfile.rating)}</div>
          </div>

          {/* Details / Bios Area */}
          <div className="md:col-span-8 space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] text-sage-500 uppercase tracking-widest font-mono font-bold block">
                Official Designation
              </span>
              <p className="text-sm font-bold text-forest-900 flex items-center">
                <Award className="h-4 w-4 text-gold-500 mr-1.5 shrink-0" />
                {selectedProfile.badgeLevel}
              </p>
            </div>

            {isBotanist && selectedProfile.specialization && (
              <div className="space-y-1">
                <span className="text-[10px] text-sage-500 uppercase tracking-widest font-mono font-bold block">
                  Curation Specialization
                </span>
                <p className="text-xs font-bold text-[#1B3022] bg-[#E8EFE9] px-3 py-1 rounded-lg inline-block">
                  {selectedProfile.specialization}
                </p>
              </div>
            )}

            <div className="space-y-1">
              <span className="text-[10px] text-sage-500 uppercase tracking-widest font-mono font-bold block">
                Expertise Bio & Statement
              </span>
              <p className="text-xs sm:text-sm text-forest-850 leading-relaxed italic">
                "{selectedProfile.bio}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-forest-100">
              <div>
                <span className="text-[10px] text-sage-500 uppercase tracking-widest font-mono font-bold block">
                  Location / Office
                </span>
                <span className="text-xs font-bold text-forest-800 flex items-center mt-1">
                  <MapPin className="h-3.5 w-3.5 text-sage-400 mr-1 shrink-0" />
                  {isBotanist ? "GUL Online Clinic Room" : "Canopy Central Green Hub"}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-sage-500 uppercase tracking-widest font-mono font-bold block">
                  {isBotanist ? "Diagnostic Fee" : "Eco Integrity"}
                </span>
                <span className="text-xs font-extrabold text-gold-600 flex items-center mt-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-sage-500 mr-1 shrink-0" />
                  {isBotanist ? `${selectedProfile.consultationFee} Coins / slot` : "Certified GUL Seller"}
                </span>
              </div>
            </div>

            {/* Quick Actions for Visitors */}
            <div className="pt-6">
              {isBotanist ? (
                currentUser.role === "customer" ? (
                  <button
                    onClick={() => onBookAppointmentClick(selectedProfile)}
                    className="w-full sm:w-auto px-6 py-3 cursor-pointer bg-gold-500 hover:bg-gold-600 active:scale-95 text-forest-950 font-black tracking-wider uppercase text-xs rounded-full shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>BOOK DIAL-IN APPOINTMENT ({selectedProfile.consultationFee} PTS)</span>
                  </button>
                ) : (
                  <p className="text-[11px] text-rose-700 font-bold bg-rose-50 border border-rose-100 p-2.5 rounded-2xl">
                    ⚠️ Swapped out of Customer status. Only customer accounts can book appointment slots.
                  </p>
                )
              ) : (
                <div className="text-xs text-sage-600 font-semibold flex items-center space-x-1">
                  <Sparkles className="h-3.5 w-3.5 text-gold-500 animate-spin-slow" />
                  <span>Authorized botanical trade merchant with ecological backing.</span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Additional Profile Sections (Items or Schedule) */}
        {isVendor && (
          <div className="space-y-4">
            <h4 className="font-display font-black text-xs uppercase tracking-widest text-[#1B3022]/60 flex items-center gap-1.5 px-2">
              <ShoppingBag className="h-4 w-4 text-emerald-500" />
              <span>Products listed by {selectedProfile.name} in Bazaar</span>
            </h4>

            {vendorProds.length === 0 ? (
              <div className="text-center py-12 rounded-[32px] border-2 border-dashed border-forest-900/10 bg-cream-50/50 p-6">
                <ShoppingBag className="h-10 w-10 text-sage-300 mx-auto mb-2" />
                <p className="text-xs text-forest-700 font-bold">No active listings for this merchant right now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {vendorProds.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex flex-col justify-between rounded-[32px] border-2 border-forest-900/10 bg-cream-50 p-4 shadow-2xs hover:shadow-xs hover:scale-[1.01] transition-all group"
                  >
                    <div>
                      <div className="h-32 w-full rounded-2xl overflow-hidden bg-forest-100 mb-3">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h5 className="font-display font-black text-xs text-forest-900 uppercase">
                        {prod.name}
                      </h5>
                      <span className="text-[10px] text-sage-500 font-mono font-bold uppercase tracking-wider block mt-0.5">
                        {prod.category}
                      </span>
                      <p className="text-[11px] text-forest-750 line-clamp-2 mt-2 leading-relaxed">
                        {prod.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-forest-100 mt-4 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-sage-500 font-mono">Retail Price</span>
                        <span className="text-xs font-black text-forest-950 font-mono">
                          Rs. {prod.priceCurrency}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => onAddToCart(prod)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-[10px] text-white font-extrabold uppercase tracking-wider rounded-full cursor-pointer transition-colors shadow-2xs"
                      >
                        Add to Cart 🛒
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {isBotanist && (
          <div className="rounded-[32px] border-2 border-forest-900/10 bg-cream-50 p-6 shadow-xs">
            <h4 className="font-display font-black text-xs uppercase tracking-widest text-forest-900 flex items-center gap-1.5 pb-2 border-b border-forest-100 mb-4">
              <Heart className="h-4 w-4 text-rose-500" />
              <span>Diagnostic Core & Client Policy</span>
            </h4>
            <div className="space-y-3 text-xs text-forest-800 leading-relaxed">
              <p>
                As a community-driven science portal, diagnostic slot bookings with **{selectedProfile.name}** directly connect you to customized plant recipes. Included with your {selectedProfile.consultationFee}-points fee:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>One-to-one secure chat console with actual prescription answers.</li>
                <li>Custom nutrient compounding ratios (using banana peels, neem sprays, and bone ashes).</li>
                <li>Digital watering calendars with solar-angle alerts tailored for local balcony dynamics.</li>
              </ul>
              <p className="text-[10px] text-sage-600 font-mono bg-forest-900/5 p-2 rounded-xl border border-forest-900/5">
                Note: In sandbox demo mode, booking will instantly schedule. You can then login as the Botanist to respond to the questions directly!
              </p>
            </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl py-6 px-4">
      <div className="border-b border-forest-100 pb-5 mb-8">
        <h2 className="font-display text-3xl font-extrabold text-forest-900 tracking-tight">
          Member Directory & Profiles
        </h2>
        <p className="text-xs sm:text-sm text-sage-700 mt-1">
          Explore and visit the listings, specialties, and profiles of vetted local plant merchants and pathology experts.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => {
          const isB = profile.role === "botanist";
          const vendorProdCount = !isB ? getVendorProducts(profile.name).length : 0;

          return (
            <div
              key={profile.id}
              onClick={() => setSelectedProfile(profile)}
              className="group cursor-pointer rounded-[32px] border-2 border-forest-900/10 bg-cream-50 p-6 shadow-xs hover:border-gold-500 hover:shadow-md hover:scale-[1.01] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start space-x-4">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    referrerPolicy="no-referrer"
                    className="h-16 w-16 rounded-2xl object-cover border border-forest-900/10"
                  />
                  <div>
                    <h3 className="font-display font-black text-sm text-forest-900 uppercase group-hover:text-forest-950">
                      {profile.name}
                    </h3>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mt-1.4 inline-block ${
                      isB ? "bg-amber-500/10 text-amber-700" : "bg-emerald-500/10 text-emerald-700"
                    }`}>
                      {profile.role}
                    </span>
                    <div className="mt-2">{renderStars(profile.rating)}</div>
                  </div>
                </div>

                <p className="text-xs text-forest-750 line-clamp-3 mt-4 leading-relaxed">
                  {profile.bio}
                </p>
              </div>

              <div className="pt-4 border-t border-forest-100 mt-5 flex justify-between items-center text-[10px] font-mono">
                <span className="text-sage-500 uppercase tracking-wider font-bold">
                  {isB ? "Fee" : "Products Listed"}
                </span>
                <span className="font-black text-forest-900">
                  {isB ? `${profile.consultationFee} PTS/slot` : `${vendorProdCount} items available`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

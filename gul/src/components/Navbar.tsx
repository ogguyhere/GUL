import React from "react";
import { Leaf, Award, Coins, Compass, MessageCircleHeart, ShoppingBag, Newspaper, Sparkles, User, ShieldAlert, LogOut, CheckSquare, CalendarDays, ShoppingCart } from "lucide-react";
import { UserAccount } from "../types";

interface NavbarProps {
  currentUser: UserAccount;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenProfile: () => void;
  onSignOut: () => void;
  cartCount: number;
}

export default function Navbar({ currentUser, currentTab, setCurrentTab, onOpenProfile, onSignOut, cartCount }: NavbarProps) {
  // Determine tabs dynamically based on user role
  const getTabsForRole = () => {
    switch (currentUser.role) {
      case "customer":
        return [
          { id: "dashboard", label: "Oasis", icon: Compass, color: "text-sage-500" },
          { id: "doctor", label: "AI Bot", icon: Sparkles, color: "text-gold-500" },
          { id: "store", label: "Store", icon: ShoppingBag, color: "text-emerald-500" },
          { id: "profiles", label: "Experts", icon: User, color: "text-indigo-500" },
          { id: "appointments", label: "Bookings", icon: CalendarDays, color: "text-amber-500" },
          { id: "cart", label: `Cart (${cartCount})`, icon: ShoppingCart, color: "text-rose-500" },
          { id: "communities", label: "Communities", icon: MessageCircleHeart, color: "text-teal-500" },
          { id: "news", label: "Almanac News", icon: Newspaper, color: "text-amber-500" },
          { id: "challenges", label: "Challenges", icon: Award, color: "text-indigo-500" },
        ];
      case "botanist":
        return [
          { id: "appointments", label: "Diagnostic Queue", icon: CalendarDays, color: "text-amber-500" },
          { id: "communities", label: "Communities", icon: MessageCircleHeart, color: "text-teal-500" },
          { id: "news", label: "Almanac News", icon: Newspaper, color: "text-amber-500" },
        ];
      case "vendor":
        return [
          { id: "vendor_dashboard", label: "My Warehouse", icon: CheckSquare, color: "text-emerald-500" },
          { id: "store", label: "Browse Bazaar", icon: ShoppingBag, color: "text-teal-500" },
          { id: "news", label: "Almanac News", icon: Newspaper, color: "text-amber-500" },
        ];
      case "admin":
        return [
          { id: "admin_dashboard", label: "System HQ", icon: ShieldAlert, color: "text-red-500" },
          { id: "store", label: "Bazaar Store", icon: ShoppingBag, color: "text-emerald-500" },
          { id: "communities", label: "Communities", icon: MessageCircleHeart, color: "text-teal-500" },
          { id: "news", label: "Almanac News", icon: Newspaper, color: "text-amber-500" },
        ];
      default:
        return [];
    }
  };

  const tabs = getTabsForRole();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-forest-100 bg-[#FAF9F5]/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <div 
          onClick={() => {
            if (currentUser.role === "customer") setCurrentTab("dashboard");
            if (currentUser.role === "botanist") setCurrentTab("appointments");
            if (currentUser.role === "vendor") setCurrentTab("vendor_dashboard");
            if (currentUser.role === "admin") setCurrentTab("admin_dashboard");
          }} 
          className="flex cursor-pointer items-center space-x-2 transition-transform hover:scale-[1.02]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-900 shadow-md">
            <Leaf className="h-5 w-5 text-gold-500 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-2xl font-bold tracking-tight text-forest-900 leading-none">GUL</span>
            <span className="text-[9px] uppercase tracking-widest text-[#88A070] font-bold">House Canopy</span>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <nav className="hidden xl:flex items-center space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`relative flex items-center space-x-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-forest-900 text-cream-50 shadow-xs"
                    : "text-forest-800 hover:bg-forest-100 hover:text-forest-900"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-gold-500" : tab.color}`} />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 h-1 w-4 -translate-x-1/2 rounded-full bg-gold-500" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Balance and Status Icons */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          
          {/* Role badge */}
          <span className="text-[10px] uppercase font-black text-forest-900 bg-[#E8EFE9] border border-[#88A070]/20 px-2.5 py-1 rounded-md hidden sm:inline-block">
            {currentUser.role}
          </span>

          {/* Point Counter */}
          <div 
            onClick={() => {
              if (currentUser.role === "customer") {
                setCurrentTab("challenges");
              }
            }}
            title="GUL reward points balance!"
            className="group flex cursor-pointer items-center space-x-2 rounded-full border border-gold-400 bg-amber-500/10 px-3 py-1.5 transition-all hover:bg-amber-500/20"
          >
            <Coins className="h-4 w-4 text-gold-500 group-hover:rotate-12 transition-transform" />
            <span className="font-mono text-xs sm:text-sm font-bold text-gold-600">
              {currentUser.points} <span className="text-[9px] text-amber-700 font-sans font-black">PTS</span>
            </span>
          </div>

          {/* Profile Quick Button */}
          <button
            onClick={onOpenProfile}
            title="Inspect Canvas Profile"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-100/50 hover:bg-forest-100 hover:scale-105 text-forest-900 transition-all border border-forest-100 cursor-pointer"
          >
            <User className="h-4 w-4 text-forest-800" />
          </button>

          {/* Sign Out Button */}
          <button
            onClick={onSignOut}
            title="Change Member Identity"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 hover:bg-rose-100 hover:scale-105 text-rose-700 transition-all border border-rose-100 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile Tab Navigation Sub-bar */}
      <div className="xl:hidden flex border-t border-forest-100 bg-[#FAF9F5] overflow-x-auto whitespace-nowrap scrollbar-none px-2 py-1.5">
        <div className="flex space-x-1 mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center space-x-1 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? "bg-forest-900 text-cream-50"
                    : "text-forest-800 hover:bg-forest-100"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-gold-500" : tab.color}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

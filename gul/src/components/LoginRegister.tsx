import React, { useState } from "react";
import { UserAccount } from "../types";
import { Leaf, LogIn, Lock, Mail, User, ShieldAlert, Sparkles, UserCheck, Star } from "lucide-react";

interface LoginRegisterProps {
  accounts: UserAccount[];
  onLogin: (account: UserAccount) => void;
  onRegister: (account: UserAccount) => void;
}

export default function LoginRegister({ accounts, onLogin, onRegister }: LoginRegisterProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"customer" | "vendor" | "botanist" | "admin">("customer");
  const [specialization, setSpecialization] = useState("");
  const [consultationFee, setConsultationFee] = useState("30");
  const [bio, setBio] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please fill in both email and password.");
      return;
    }
    const account = accounts.find(
      (a) => a.email.toLowerCase() === email.toLowerCase().trim()
    );
    if (account) {
      onLogin(account);
      setErrorMsg("");
    } else {
      setErrorMsg("Account not found. Select a preset below for instant login or Register a new account.");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      setErrorMsg("Please fill in name and email.");
      return;
    }

    const exists = accounts.some((a) => a.email.toLowerCase() === email.toLowerCase().trim());
    if (exists) {
      setErrorMsg("An account with this email already exists.");
      return;
    }

    // Role-specific definitions
    const avatar = role === "botanist" 
      ? "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=200"
      : role === "vendor" 
      ? "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=200"
      : role === "admin"
      ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"
      : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200";

    const newAccount: UserAccount = {
      id: `acc-${Date.now()}`,
      name,
      email: email.trim(),
      role,
      points: role === "customer" ? 250 : 0, // Customer starts with 250 PTS bonus
      badgeLevel: role === "admin" 
        ? "Ecology Architect" 
        : role === "botanist" 
        ? "Certified Botanist" 
        : role === "vendor" 
        ? "Registered Merchant" 
        : "Sprout Caretaker",
      treesPlanted: 0,
      challengesCompletedCount: 0,
      unlockedVirtualPlants: [],
      avatar,
      specialization: role === "botanist" ? (specialization || "General Botany Diagnosis") : undefined,
      rating: role === "botanist" ? 4.7 : role === "vendor" ? 4.6 : undefined,
      consultationFee: role === "botanist" ? (parseInt(consultationFee) || 30) : undefined,
      bio: bio || `Dedicated GUL ${role} helping the city garden transition.`,
      clinicAddress: role === "botanist" ? "GUL Canopy Lab & Online Diagnostic Desk" : undefined,
      totalEarnings: role === "vendor" ? 0 : undefined
    };

    onRegister(newAccount);
    onLogin(newAccount);
    setIsRegister(false);
    setErrorMsg("");
  };

  const selectPreset = (account: UserAccount) => {
    onLogin(account);
  };

  return (
    <div className="min-h-screen bg-[#F7F6F0] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-forest-900 shadow-xl mb-4">
          <Leaf className="h-7 w-7 text-gold-500 animate-pulse" />
        </div>
        <h2 className="text-3xl font-display font-extrabold text-forest-900 tracking-tight">
          GUL Botanical Canopy
        </h2>
        <p className="mt-2 text-sm text-sage-600 font-medium">
          Multi-Role Ecology, Commerce, and AI Consultation Network
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-cream-50 py-8 px-6 sm:px-10 rounded-[32px] border-2 border-forest-900/10 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sage-400 via-gold-500 to-forest-900" />
          
          {/* Tabs header */}
          <div className="flex border-b border-forest-100 mb-6 pb-2">
            <button
              onClick={() => {
                setIsRegister(false);
                setErrorMsg("");
              }}
              className={`flex-1 text-center py-2 font-display text-sm font-bold tracking-wider uppercase transition-colors ${
                !isRegister ? "text-forest-900 border-b-2 border-gold-500" : "text-forest-700/60 hover:text-forest-900"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsRegister(true);
                setErrorMsg("");
              }}
              className={`flex-1 text-center py-2 font-display text-sm font-bold tracking-wider uppercase transition-colors ${
                isRegister ? "text-forest-900 border-b-2 border-gold-500" : "text-forest-700/60 hover:text-forest-900"
              }`}
            >
              Register Account
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 bg-red-50 border border-red-250 rounded-2xl p-4 text-xs text-red-800 font-medium">
              {errorMsg}
            </div>
          )}

          {!isRegister ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-forest-800 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-sage-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter preset email or registered mail"
                    className="w-full bg-white border-2 border-forest-900/10 hover:border-forest-900/20 focus:border-forest-900 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-hidden transition-all text-forest-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-forest-800 mb-1.5">
                  Secure Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-sage-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Type anything (Simulated Demo)"
                    className="w-full bg-white border-2 border-forest-900/10 hover:border-forest-900/20 focus:border-forest-900 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-hidden transition-all text-forest-900 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-forest-900 hover:bg-forest-950 active:scale-[0.98] text-white font-extrabold uppercase tracking-widest text-xs rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <LogIn className="h-4 w-4" />
                <span>ACCESS CANOPY</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-forest-800 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-sage-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Zephyr Flora"
                    className="w-full bg-white border-2 border-forest-900/10 hover:border-forest-900/20 focus:border-forest-900 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-hidden transition-all text-forest-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-forest-800 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-sage-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="zephyr@gul.org"
                    className="w-full bg-white border-2 border-forest-900/10 hover:border-forest-900/20 focus:border-forest-900 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-hidden transition-all text-forest-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-forest-800 mb-1.5">
                  Assigned Operational Role
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["customer", "vendor", "botanist", "admin"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 transition-all cursor-pointer ${
                        role === r
                          ? "bg-forest-900 text-cream-50 border-forest-900"
                          : "bg-white text-forest-800 border-forest-900/10 hover:border-forest-900/20"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {role === "botanist" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-forest-800 mb-1">
                        Specialization Area
                      </label>
                      <input
                        type="text"
                        required
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        placeholder="e.g. Fern Physiology"
                        className="w-full bg-white border border-forest-900/10 rounded-xl p-2 text-xs text-forest-950 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-forest-800 mb-1">
                        Fee / Session (Coins)
                      </label>
                      <input
                        type="number"
                        required
                        value={consultationFee}
                        onChange={(e) => setConsultationFee(e.target.value)}
                        placeholder="30"
                        className="w-full bg-white border border-forest-900/10 rounded-xl p-2 text-xs text-forest-950 font-mono font-bold"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-forest-800 mb-1.5">
                  About Me / Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell customers or growers about your organic motives..."
                  className="w-full bg-white border-2 border-forest-900/10 hover:border-forest-900/20 focus:border-forest-900 rounded-2xl py-2 px-3 text-xs font-medium focus:outline-hidden transition-all text-forest-900 h-16 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-extrabold uppercase tracking-widest text-xs rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <UserCheck className="h-4 w-4" />
                <span>CONFIRM REGISTRATION</span>
              </button>
            </form>
          )}

          {/* Quick Sandbox Login Presets */}
          <div className="mt-8 pt-6 border-t border-forest-100">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-sage-600 mb-3 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-gold-500 animate-spin-slow" />
              <span>Simulated Sandbox Accounts (Click to Sign In)</span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {accounts.map((acc) => {
                let roleColor = "text-[#88A070]";
                if (acc.role === "admin") roleColor = "text-red-500 bg-red-50";
                if (acc.role === "botanist") roleColor = "text-amber-600 bg-amber-50";
                if (acc.role === "vendor") roleColor = "text-emerald-700 bg-emerald-50";
                
                return (
                  <button
                    key={acc.id}
                    onClick={() => selectPreset(acc)}
                    className="flex items-center space-x-2 text-left p-2.5 rounded-2xl border border-forest-100 bg-[#FAF9F5] hover:bg-white hover:border-gold-500 cursor-pointer hover:scale-[1.02] transition-all group"
                  >
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      referrerPolicy="no-referrer"
                      className="h-8 w-8 rounded-xl object-cover shrink-0 border border-forest-100"
                    />
                    <div className="overflow-hidden">
                      <p className="text-[11px] font-bold text-forest-900 truncate group-hover:text-forest-950">
                        {acc.name}
                      </p>
                      <span className={`text-[9px] uppercase font-black tracking-wider ${roleColor} rounded-full px-1.5 py-0.5 mt-0.5 inline-block`}>
                        {acc.role}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

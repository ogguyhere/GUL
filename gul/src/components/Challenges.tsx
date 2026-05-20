import React, { useState } from "react";
import { Award, CheckCircle2, Droplets, Sparkles, Coins, ShoppingBag, ArrowUpRight, HelpCircle } from "lucide-react";
import { Challenge, VirtualPlant, UserProfile } from "../types";
import { VIRTUAL_FLOWERS } from "../data";

interface ChallengesProps {
  challenges: Challenge[];
  onClaimReward: (challengeId: string, rewardPoints: number) => void;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onDeductPoints: (amount: number) => boolean;
  onAddPoints: (amount: number) => void;
  setCurrentTab: (tab: string) => void;
}

export default function Challenges({
  challenges,
  onClaimReward,
  profile,
  setProfile,
  onDeductPoints,
  onAddPoints,
  setCurrentTab,
}: ChallengesProps) {
  const [selectedSeedToBuy, setSelectedSeedToBuy] = useState<VirtualPlant | null>(null);
  const [wateringLogs, setWateringLogs] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Growth rates & virtual garden structures
  const [plantedList, setPlantedList] = useState<Array<{
    plantId: string;
    uniqueId: string;
    name: string;
    stage: "seedling" | "sprout" | "flowering" | "majestic";
    waterPercent: number;
    svgPath: string;
  }>>([
    // Start with a default seedling rose for onboarding
    {
      plantId: "vp-1",
      uniqueId: "initial-rose",
      name: "Onboarding Rose Sprout",
      stage: "sprout",
      waterPercent: 75,
      svgPath: VIRTUAL_FLOWERS[0].svgPath,
    }
  ]);

  const handleBuySeed = (plant: VirtualPlant) => {
    setErrorText(null);
    setWateringLogs(null);

    // Try to spend points
    const success = onDeductPoints(plant.costPoints);
    if (!success) {
      setErrorText(`Insufficient GUL points. You need ${plant.costPoints} PTS to buy a ${plant.name}.`);
      return;
    }

    const newInstance = {
      plantId: plant.id,
      uniqueId: `inst-${Date.now()}`,
      name: plant.name,
      stage: "seedling" as const,
      waterPercent: 20,
      svgPath: plant.svgPath,
    };

    setPlantedList((prev) => [...prev, newInstance]);
    setWateringLogs(`Planted a rare ${plant.name}! Water it regularly with GUL coins to see it bloom.`);
  };

  const handleWaterPlant = (uniqueId: string) => {
    setErrorText(null);
    setWateringLogs(null);

    // Dedicate 10 points or it can be a free interactive tap that rewards them!
    // Let's make watering cost a nominal 5 GUL points (meaning users must earn points to keep garden growing,
    // which completes the circular economy!). If they have 0 points, we can let them water for free
    // as a supportive mechanic!
    const cost = profile.points >= 5 ? 5 : 0;
    
    if (cost > 0) {
      onDeductPoints(cost);
    }

    setPlantedList((prev) =>
      prev.map((inst) => {
        if (inst.uniqueId === uniqueId) {
          let newPercent = inst.waterPercent + 25;
          let newStage = inst.stage;

          if (newPercent >= 100) {
            newPercent = 20; // reset water meter
            if (inst.stage === "seedling") {
              newStage = "sprout";
            } else if (inst.stage === "sprout") {
              newStage = "flowering";
            } else if (inst.stage === "flowering") {
              newStage = "majestic";
            } else {
              newPercent = 100; // lock at fully grown!
            }
          }

          if (newStage === "majestic" && inst.stage !== "majestic") {
            // Unlocked majestic plant bonus! Reward +40 points back!
            setTimeout(() => {
              onAddPoints(45);
              setWateringLogs(`✨ MAGNIFICENT! Your "${inst.name}" has matured into the majestic cosmic state! Awarded a botanical bonus of +45 GUL Points!`);
            }, 300);
          }

          return {
            ...inst,
            stage: newStage,
            waterPercent: newPercent,
          };
        }
        return inst;
      })
    );

    if (cost > 0) {
      setWateringLogs("Fed water! Soil carbon hydrated (-5 Points spent to feed organic water).");
    } else {
      setWateringLogs("Fed emergency water! Potting soil hydrated (Free emergency supply).");
    }
  };

  const handleActionRedirect = (type: string) => {
    if (type === "diagnosing") {
      setCurrentTab("doctor");
    } else if (type === "sharing") {
      setCurrentTab("communities");
    } else if (type === "purchasing") {
      setCurrentTab("store");
    }
  };

  return (
    <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
      
      {/* Upper header */}
      <div className="border-b border-forest-100 pb-5 mb-6">
        <h2 className="font-display text-3xl font-extrabold text-forest-900 tracking-tight">Eco-Challenges & Visual Oasis</h2>
        <p className="text-xs sm:text-sm text-sage-700 mt-1">
          Unlock botanical milestone rewards by gardening, and spend your points inside GUL Oasis to grow an gorgeous digital garden.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Challenges Milestone Ledger (Span 5) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-[32px] border-2 border-forest-900/10 bg-cream-50 p-6 shadow-xs">
            <h3 className="font-display font-bold text-forest-900 text-base mb-4 flex items-center space-x-2">
              <Award className="h-5 w-5 text-gold-500" />
              <span>Eco-Milestone Ledger</span>
            </h3>

            <div className="space-y-4">
              {challenges.map((c) => {
                const isFinished = c.currentValue >= c.targetValue;
                const canClaim = isFinished && !c.claimed;

                return (
                  <div
                    key={c.id}
                    className={`p-4 rounded-xl border transition-all ${
                      c.claimed
                        ? "bg-forest-100/30 border-forest-100/40 opacity-75"
                        : isFinished
                        ? "bg-emerald-500/5 border-emerald-400"
                        : "bg-cream-100/40 border-forest-100/30"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-display font-extrabold text-xs sm:text-sm text-forest-900">
                          {c.title}
                        </h4>
                        <p className="text-[10px] sm:text-xs text-forest-750 mt-1 leading-normal">
                          {c.description}
                        </p>
                      </div>

                      <div className="flex items-center space-x-1 border border-gold-400 bg-amber-500/10 rounded-sm px-1.5 py-0.5 mt-0.5 shrink-0">
                        <Coins className="h-3 w-3 text-gold-500" />
                        <span className="font-mono text-[9px] font-bold text-gold-600">
                          +{c.rewardPoints}
                        </span>
                      </div>
                    </div>

                    {/* Progress tracking bar */}
                    <div className="mt-4 flex items-center justify-between text-[10px] text-sage-600 font-mono">
                      <span>Progress:</span>
                      <span className="font-bold">
                        {c.currentValue} / {c.targetValue}
                      </span>
                    </div>

                    <div className="mt-1.5 h-1.5 w-full bg-cream-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          c.claimed ? "bg-sage-400" : "bg-forest-800"
                        }`}
                        style={{ width: `${Math.min(100, (c.currentValue / c.targetValue) * 100)}%` }}
                      />
                    </div>

                    {/* CTA button drawer */}
                    <div className="mt-4 flex justify-end space-x-2">
                      {c.claimed ? (
                        <span className="text-[10px] font-bold text-sage-500 flex items-center space-x-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-sage-400" />
                          <span>Reward Claimed</span>
                        </span>
                      ) : canClaim ? (
                        <button
                          onClick={() => onClaimReward(c.id, c.rewardPoints)}
                          className="px-3.5 py-1.5 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-cream-50 text-[10px] font-bold rounded-lg shadow-sm transition-all"
                        >
                          Claim {c.rewardPoints} PTS!
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActionRedirect(c.metricType)}
                          className="px-3 py-1.5 border border-forest-100 text-forest-800 hover:bg-forest-100 text-[10px] font-semibold rounded-lg flex items-center space-x-0.5"
                        >
                          <span>{c.actionLabel}</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: GUL Visual Sandbox Oasis (Span 7) */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          <div className="rounded-[32px] border-2 border-forest-900/10 bg-cream-50 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-forest-100 mb-5">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-gold-500 animate-spin-slow" />
                  <h3 className="font-display font-extrabold text-forest-900 text-base">GUL Sandbox Oasis</h3>
                </div>
                <span className="rounded-full bg-sage-200/50 px-2.5 py-0.5 text-[10px] font-bold text-sage-800 uppercase tracking-widest">
                  Live Ecology Simulator
                </span>
              </div>

              {/* Toast log feedbacks */}
              {wateringLogs && (
                <div className="mb-4 rounded-xl border border-sage-300 bg-sage-50 px-3.5 py-2.5 text-xs text-sage-800 italic flex items-center space-x-2 animate-fadeIn">
                  <span>🍃</span>
                  <p className="flex-1 font-medium">{wateringLogs}</p>
                </div>
              )}

              {errorText && (
                <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-3.5 py-2.5 text-xs text-red-800 flex items-center space-x-2 animate-fadeIn">
                  <span>⚠️</span>
                  <p className="flex-1 font-semibold">{errorText}</p>
                </div>
              )}

              {/* The Visual Garden Soil Ground */}
              <div className="relative h-[280px] w-full rounded-2xl border border-forest-100 bg-cover bg-center overflow-hidden flex flex-col justify-end p-5 shadow-inner" style={{ backgroundImage: "linear-gradient(to bottom, rgba(250, 247, 240, 0.2) 60%, rgba(26, 56, 33, 0.15)), url('https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=800&blur=2')" }}>
                
                {/* Floating environmental parameters */}
                <div className="absolute top-4 left-4 flex flex-col space-y-1.5 text-[9px] font-mono leading-none bg-forest-950/85 text-cream-50 rounded-lg p-2.5 shadow-md max-w-xs border border-forest-800">
                  <span className="font-bold text-gold-500 uppercase flex items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-ping" />
                    Microclimate Live
                  </span>
                  <span>Ambient Air: 26.4 °C</span>
                  <span>Soil Moist: Hydrated</span>
                  <span>Photosynthetic Gain: Max</span>
                </div>

                {/* Virtual Ground Bed */}
                <div className="relative w-full border-t border-yellow-800/10 bg-yellow-950/20 py-5 rounded-xl border border-yellow-905/40 backdrop-blur-xs flex items-end justify-around space-x-2 min-h-[140px]">
                  
                  {plantedList.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center text-center p-4">
                      <p className="text-xs text-forest-950 bg-cream-50/80 p-3 rounded-lg border border-forest-100">
                        🍂 Currently bare loam soil. Pick some rare seeds below using your balance points!
                      </p>
                    </div>
                  ) : (
                    plantedList.map((inst) => {
                      const stageLabel = inst.stage === "seedling" ? "Seedling" : inst.stage === "sprout" ? "Young Sprout" : inst.stage === "flowering" ? "Vibrant Bloom" : "Majestic Crown";
                      const sizeClass = inst.stage === "seedling" ? "scale-50 h-10 w-10 text-amber-800" : inst.stage === "sprout" ? "scale-75 h-14 w-14 text-emerald-500" : inst.stage === "flowering" ? "scale-100 h-20 w-20 text-teal-600" : "scale-110 h-24 w-24 text-gold-500 animate-pulse";
                      const plantEmoji = inst.stage === "seedling" ? "🥔" : inst.stage === "sprout" ? "🌱" : inst.stage === "flowering" ? "🌸" : "✨🌸✨";

                      return (
                        <div key={inst.uniqueId} className="flex flex-col items-center group relative p-1">
                          
                          {/* Tooltip drawer hover */}
                          <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center bg-forest-950 text-cream-50 rounded-md py-1 px-2 text-[9px] font-mono whitespace-nowrap z-10 w-28 text-center leading-normal shadow-lg">
                            <span className="font-bold">{inst.name}</span>
                            <span>Stage: {stageLabel}</span>
                            <span>Moisture: {inst.waterPercent}%</span>
                          </div>

                          {/* Graphical plant structure holding SVG */}
                          <div className={`transition-all duration-500 transform ${sizeClass} flex flex-col items-center justify-center`}>
                            {inst.stage === "seedling" ? (
                              /* Cozy seedling bio mud cup */
                              <div className="text-2xl h-10 w-10 bg-amber-900/30 rounded-t-full rounded-b-sm border-b-2 border-yellow-950 flex items-center justify-center select-none shadow-xs">
                                🤎
                              </div>
                            ) : inst.stage === "sprout" ? (
                              /* Green shoot sprouts */
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-10 w-10 text-emerald-500 drop-shadow-md animate-bounce">
                                <path d="M12 22V12M12 12c.03-3.03 2.03-5 5-5M12 15c-.03-2.03-1.53-4-3.5-4" />
                              </svg>
                            ) : inst.stage === "flowering" ? (
                              /* Active foliage flowering buds */
                              <svg viewBox="0 0 24 24" fill="none" class="h-14 w-14 text-teal-600 drop-shadow-lg" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22V10M12 10C8 10 6 7 6 5M12 10c4 0 6-3 6-5M12 14c-3 0-5-2-5-4" />
                                <circle cx="12" cy="7" r="2.5" className="fill-gold-500 stroke-none" />
                              </svg>
                            ) : (
                              /* Majestic crowning golden plant bloom with pulse */
                              <div className="flex flex-col items-center">
                                <span className="text-[10px] animate-bounce mb-0.5 text-gold-500 font-extrabold font-mono leading-none flex items-center space-x-0.5">
                                  <span>✨</span><span>COSMIC</span><span>✨</span>
                                </span>
                                <svg viewBox="0 0 24 24" fill="none" className="h-16 w-16 text-gold-500 drop-shadow-[0_0_8px_rgba(243,179,62,0.6)] animate-spin-slow" stroke="currentColor" strokeWidth="2">
                                  <path d="M12 20v-8M12 12c-3 0-6-3-6-6s3-6 6-6 6 3 6 6-3 6-6 6z" className="fill-amber-500/10" />
                                  <circle cx="12" cy="6" r="3" className="fill-gold-500 text-gold-500" />
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* Individual Watering Meter */}
                          {inst.stage !== "majestic" ? (
                            <button
                              onClick={() => handleWaterPlant(inst.uniqueId)}
                              className="mt-3 cursor-pointer rounded-full border border-forest-100 bg-cream-50 hover:bg-forest-100 px-2 py-1 text-[9px] font-bold text-forest-900 transition-all flex items-center space-x-1"
                            >
                              <Droplets className="h-3 w-3 text-sage-500" />
                              <span>Water ({inst.waterPercent}%)</span>
                            </button>
                          ) : (
                            <div className="mt-3 rounded-full bg-amber-500/20 border border-gold-400 px-2.5 py-1 text-[9px] font-mono leading-none font-bold text-gold-600 flex items-center space-x-1 text-center">
                              <span>🏆 Matured</span>
                            </div>
                          )}

                        </div>
                      );
                    })
                  )}

                </div>
              </div>

              {/* Seed selection market drawer below sandbox */}
              <div className="mt-6 border-t border-forest-100 pt-5">
                <h4 className="font-display font-extrabold text-xs text-forest-900 uppercase tracking-widest mb-3 flex items-center space-x-1">
                  <ShoppingBag className="h-4 w-4 text-sage-500" />
                  <span>Interactive Seed Pod Market</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {VIRTUAL_FLOWERS.map((v) => {
                    return (
                      <button
                        key={v.id}
                        onClick={() => handleBuySeed(v)}
                        className="p-3 text-left rounded-xl border border-forest-100 bg-cream-100/45 hover:border-gold-500 hover:scale-[1.01] transition-all flex flex-col justify-between h-28 group cursor-pointer"
                      >
                        <div>
                          <span className="text-[10px] font-mono font-bold text-gold-600 block flex items-center space-x-0.5">
                            <Coins className="h-3 w-3 text-gold-500 shrink-0" />
                            <span>{v.costPoints} PTS</span>
                          </span>
                          <span className="font-display font-bold text-[11px] sm:text-xs text-forest-950 mt-1.5 block leading-tight">
                            {v.name}
                          </span>
                        </div>
                        <span className="text-[9px] text-sage-500 line-clamp-2 leading-tight">
                          {v.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

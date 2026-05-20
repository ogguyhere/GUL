import React, { useState } from "react";
import { Newspaper, Sparkles, BookOpen, Clock, Heart, ArrowRight, CheckCircle2, Award } from "lucide-react";
import { NewsArticle, UserProfile } from "../types";

interface NewsProps {
  articles: NewsArticle[];
  profile: UserProfile;
  onAddPoints: (amount: number) => void;
}

export default function News({ articles, profile, onAddPoints }: NewsProps) {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [triviaSolved, setTriviaSolved] = useState<boolean | null>(null);
  const [claimedTriviaReward, setClaimedTriviaReward] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const triviaQuestion = {
    text: "Which organic phytohormone or plant gaseous compound is responsible for triggering natural fruit ripening and leaf shedding in autumn?",
    options: [
      { id: "A", label: "Gibberellins (growth regulators)" },
      { id: "B", label: "Ethylene (ripening gas)", correct: true },
      { id: "C", label: "Abscisic Acid (stress responder)" },
      { id: "D", label: "Cytokinins (cell division triggers)" }
    ],
    hint: "It is often emitted in heavy concentration by bananas!",
    rewardPts: 25
  };

  const handleSelectAnswer = (optionId: string, isCorrect?: boolean) => {
    setSelectedAnswer(optionId);
    if (isCorrect) {
      setTriviaSolved(true);
      if (!claimedTriviaReward) {
        onAddPoints(triviaQuestion.rewardPts);
        setClaimedTriviaReward(true);
      }
    } else {
      setTriviaSolved(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl py-6 px-4 sm:px-6">
      
      {/* Upper header */}
      <div className="border-b border-forest-100 pb-5 mb-6">
        <h2 className="font-display text-3xl font-extrabold text-forest-900 tracking-tight">Botany Gazette & Trivia</h2>
        <p className="text-xs sm:text-sm text-sage-700 mt-1">
          Stay informed about global soil microbiome breakthroughs, urban cooling campaigns, and test your plant intelligence daily!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* News Feed (Col span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {selectedArticle ? (
            /* Open full news reader */
            <div className="rounded-[32px] border-2 border-forest-900/10 bg-cream-50 p-6 sm:p-8 shadow-xs animate-fadeIn">
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-xs font-semibold text-sage-600 hover:text-forest-900 mb-4 flex items-center space-x-1"
              >
                ← Back to News Gazette
              </button>

              <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-6">
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex items-center space-x-3 text-xs mb-3 text-sage-700 font-mono">
                <span className="px-2.5 py-0.5 rounded-full bg-forest-900 text-cream-50 font-sans tracking-wide">
                  {selectedArticle.badge}
                </span>
                <span>• {selectedArticle.source}</span>
                <span>• {selectedArticle.date}</span>
              </div>

              <h3 className="font-display font-extrabold text-2xl text-forest-900 mb-4 leading-tight">
                {selectedArticle.title}
              </h3>

              <div className="text-sm text-forest-850 leading-relaxed whitespace-pre-line space-y-4">
                {selectedArticle.fullText}
              </div>

              <div className="border-t border-forest-100 mt-8 pt-4 flex justify-between items-center">
                <span className="text-xs italic text-sage-600">Happy reading, ecology companion!</span>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-4 py-2 bg-forest-900 hover:bg-forest-950 text-cream-50 text-xs font-bold rounded-xl"
                >
                  Close Gazette Article
                </button>
              </div>
            </div>
          ) : (
            /* Grid layout of news list */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {articles.map((art) => (
                <div
                  key={art.id}
                  className="flex flex-col justify-between rounded-[32px] border-2 border-forest-900/10 bg-cream-50 overflow-hidden shadow-2xs hover:shadow-xs hover:scale-[1.01] transition-all group"
                >
                  <div>
                    <div className="h-40 w-full overflow-hidden bg-forest-100">
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
                      />
                    </div>

                    <div className="p-5 sm:p-6">
                      <div className="flex items-center space-x-2 text-[10px] text-sage-600 font-mono mb-2">
                        <span className="px-2 py-0.5 rounded-sm bg-sage-500/10 text-sage-600 font-bold uppercase">
                          {art.badge}
                        </span>
                        <span>• {art.date}</span>
                      </div>

                      <h4 className="font-display font-bold text-sm sm:text-base text-forest-900 leading-snug group-hover:text-forest-950 transition-colors">
                        {art.title}
                      </h4>

                      <p className="text-[11px] sm:text-xs text-forest-750 mt-2 line-clamp-3 leading-relaxed">
                        {art.summary}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 border-t border-forest-50 flex justify-between items-center">
                    <span className="text-[10px] text-sage-500 font-mono">{art.source}</span>
                    <button
                      onClick={() => setSelectedArticle(art)}
                      className="text-xs font-bold text-forest-900 group-hover:text-forest-950 flex items-center space-x-0.5 hover:underline cursor-pointer"
                    >
                      <span>Read Full</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trivia of the Day Widget (Col span 1) */}
        <div className="lg:col-span-1 flex flex-col space-y-6">
          <div className="rounded-[32px] border-2 border-forest-900/15 bg-amber-500/5 p-6 shadow-xs">
            <div className="flex items-center space-x-2 border-b border-gold-400 pb-3 mb-4">
              <Award className="h-5 w-5 text-gold-500 animate-spin-slow" />
              <h3 className="font-display font-extrabold text-forest-900 text-base">Botany Trivia</h3>
            </div>

            <p className="text-xs text-forest-800 font-semibold mb-4 leading-relaxed">
              {triviaQuestion.text}
            </p>

            {/* Hint Box */}
            <div className="bg-cream-100/70 border border-gold-400/20 rounded-lg p-2.5 mb-4 text-[10px] text-sage-700">
              <span className="font-bold">🕵️ Clue:</span> {triviaQuestion.hint}
            </div>

            {/* Answer Pills */}
            <div className="flex flex-col space-y-2">
              {triviaQuestion.options.map((opt) => (
                <button
                  key={opt.id}
                  disabled={claimedTriviaReward}
                  onClick={() => handleSelectAnswer(opt.id, opt.correct)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                    selectedAnswer === opt.id
                      ? opt.correct
                        ? "bg-emerald-500/15 border-emerald-500 text-emerald-800 font-bold"
                        : "bg-red-500/15 border-red-400 text-red-800"
                      : "bg-cream-50 border-forest-100 hover:border-sage-400 hover:bg-cream-100/50"
                  }`}
                >
                  <span className="inline-block font-bold mr-1.5">{opt.id}.</span> {opt.label}
                </button>
              ))}
            </div>

            {/* Solved Results */}
            {triviaSolved === true && (
              <div className="mt-5 rounded-xl border border-emerald-400 bg-emerald-50 p-3 text-center text-xs text-emerald-800 animate-fadeIn">
                <CheckCircle2 className="mx-auto h-5 w-5 text-emerald-500 mb-1" />
                <span className="font-bold block">Riwaash! Correct Answer!</span>
                Earned <span className="font-mono font-bold">+{triviaQuestion.rewardPts} GUL points</span> loaded directly to your coin balance.
              </div>
            )}

            {triviaSolved === false && (
              <div className="mt-5 rounded-xl border border-red-300 bg-red-50 p-3 text-center text-xs text-red-800 animate-fadeIn">
                <span className="font-bold block">🌱 Not quite it!</span>
                Think about which gaseous hormone stimulates fruit cells to divide rapidly, or check the hint. Try another option!
              </div>
            )}

            {claimedTriviaReward && (
              <div className="mt-4 text-center text-[10px] font-mono text-sage-600">
                ✔️ You have claimed today's botanical reward balance.
              </div>
            )}
          </div>

          {/* Plant Facts fun block */}
          <div className="rounded-xl border border-forest-100 bg-cream-50 p-4">
            <h4 className="font-display text-xs font-bold text-forest-900 uppercase tracking-widest">
              🌿 Global Canopy Fact
            </h4>
            <div className="text-xs text-forest-700 leading-relaxed mt-2.5">
              "Bamboo is the fastest-growing woody plant in the biodiversity index. Some species of bamboo can grow up to 35 inches/day, meaning you could almost watch it scale in real time!"
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

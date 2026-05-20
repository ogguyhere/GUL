import React, { useState } from "react";
import { MessageSquare, Heart, Share2, Plus, Sparkles, UserCheck, Search, Tag, Users, ShieldAlert } from "lucide-react";
import { CommunityPost, UserProfile, Comment } from "../types";

interface CommunityProps {
  communities: CommunityPost[];
  setCommunities: React.Dispatch<React.SetStateAction<CommunityPost[]>>;
  profile: UserProfile;
  onAddPoints: (amount: number) => void;
  onChallengeProgress: (type: "clipping" | "sharing" | "diagnosing" | "planting" | "purchasing", amount: number) => void;
}

export default function Community({ communities, setCommunities, profile, onAddPoints, onChallengeProgress }: CommunityProps) {
  const [activeChannel, setActiveChannel] = useState<"customer" | "seller">("customer");
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  
  // Post Creator modal state
  const [showCreator, setShowCreator] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCat, setNewCat] = useState<CommunityPost["category"]>("customer-lounge");
  const [newTag, setNewTag] = useState("Balcony");

  // Comment draft states
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState("");

  const tags = ["All", "Yellowing Leaves", "Seed Swap", "Seller Secrets", "Repotting", "Organics"];

  // Filter posts
  const filteredPosts = communities.filter((post) => {
    // Determine channel mapping
    const isSellerCategory = post.category === "seller-hub";
    const postChannel: "customer" | "seller" = isSellerCategory ? "seller" : "customer";
    
    const matchesChannel = postChannel === activeChannel;
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) ||
                          post.content.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag === "All" || post.tag === selectedTag;

    return matchesChannel && matchesSearch && matchesTag;
  });

  const handleLike = (id: string) => {
    setCommunities((prev) =>
      prev.map((post) => {
        if (post.id === id) {
          const hasLiked = !post.hasLiked;
          return {
            ...post,
            hasLiked,
            likesCount: hasLiked ? post.likesCount + 1 : post.likesCount - 1,
          };
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      authorName: profile.name,
      authorRole: profile.role === "both" ? "customer" : profile.role,
      content: commentInput,
      date: new Date().toISOString().split('T')[0],
    };

    setCommunities((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );

    setCommentInput("");
    setActiveCommentPostId(null);

    // Reward points for actively offering community feedback!
    onAddPoints(5);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    const addedPost: CommunityPost = {
      id: `post-${Date.now()}`,
      title: newTitle,
      content: newContent,
      category: newCat,
      authorName: profile.name,
      authorBadge: profile.role === "seller" ? "Certified Grower" : "Budding Gardener",
      authorRole: profile.role === "seller" ? "seller" : "customer",
      likesCount: 0,
      comments: [],
      date: new Date().toISOString().split('T')[0],
      tag: newTag,
    };

    setCommunities((prev) => [addedPost, ...prev]);

    // Verify if seedswap and log progress towards "Eco Seed Swapper" challenge goal!
    if (newCat === "seed-swap") {
      onChallengeProgress("sharing", 1);
    }

    // Reward 15 points for contribution
    onAddPoints(15);

    // Reset Form
    setNewTitle("");
    setNewContent("");
    setShowCreator(false);
  };

  return (
    <div className="mx-auto max-w-5xl py-6 px-4 sm:px-6">
      
      {/* Upper sub-header split */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-forest-100 pb-5 mb-6 gap-4">
        <div>
          <h2 className="font-display text-3xl font-extrabold text-forest-900 tracking-tight">GUL Seed & Soil Guild</h2>
          <p className="text-xs sm:text-sm text-sage-700 mt-1">
            Exchange plant saplings, request diagnostic community feedback, or read nurseries logistics in our double hub.
          </p>
        </div>

        <button
          onClick={() => setShowCreator(true)}
          className="px-4 py-2.5 cursor-pointer bg-forest-900 hover:bg-forest-950 text-cream-50 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1"
        >
          <Plus className="h-4 w-4 text-gold-500" />
          <span>New Discussion</span>
        </button>
      </div>

      {/* Main dual sub-community channels selector tabs */}
      <div className="grid grid-cols-2 gap-3 mb-6 bg-cream-50 border border-forest-100 p-1.5 rounded-2xl max-w-md">
        <button
          onClick={() => {
            setActiveChannel("customer");
            setSelectedTag("All");
          }}
          className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold text-center transition-all cursor-pointer flex items-center justify-center space-x-2 ${
            activeChannel === "customer"
              ? "bg-forest-900 text-cream-50 shadow-xs"
              : "text-forest-800 hover:bg-forest-100"
          }`}
        >
          <Users className="h-4 w-4 text-sage-400" />
          <span>Customer Lounge</span>
        </button>

        <button
          onClick={() => {
            setActiveChannel("seller");
            setSelectedTag("All");
          }}
          className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold text-center transition-all cursor-pointer flex items-center justify-center space-x-2 ${
            activeChannel === "seller"
              ? "bg-forest-900 text-cream-50 shadow-xs"
              : "text-forest-800 hover:bg-forest-100"
          }`}
        >
          <UserCheck className="h-4 w-4 text-gold-500 animate-pulse" />
          <span>Seller Nursery Hub</span>
        </button>
      </div>

      {/* Tag filters and search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-cream-50/50 p-5 border-2 border-forest-900/10 rounded-[32px] shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-sage-400" />
          <input
            type="text"
            placeholder="Search discussion threads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-forest-100 bg-cream-100/30 pl-9 pr-4 py-2 text-xs text-forest-950 placeholder-sage-400 focus:outline-hidden"
          />
        </div>

        <div className="flex overflow-x-auto whitespace-nowrap scrollbar-none space-x-1.5">
          <span className="text-xs text-forest-600 self-center font-bold flex items-center mr-1">
            <Tag className="h-3.5 w-3.5 text-sage-500 mr-1" /> Filters:
          </span>
          {tags.map((tg) => (
            <button
              key={tg}
              onClick={() => setSelectedTag(tg)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors cursor-pointer ${
                selectedTag === tg
                  ? "bg-sage-500 text-cream-50 font-bold"
                  : "bg-cream-100 border border-forest-100/30 text-forest-800 hover:bg-forest-100"
              }`}
            >
              {tg}
            </button>
          ))}
        </div>
      </div>

      {/* DISCUSSION MODAL CREATOR */}
      {showCreator && (
        <div className="mb-8 rounded-2xl border border-gold-400 bg-cream-50 p-5 sm:p-6 shadow-md animate-fadeIn">
          <h3 className="font-display font-bold text-forest-900 text-base mb-4 flex items-center space-x-1">
            <Sparkles className="h-4 w-4 text-gold-500" />
            <span>Create a Botanical Thread</span>
          </h3>

          <form onSubmit={handleCreatePost} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-forest-900 uppercase">Discussion Topic</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Make it clear, e.g. 'Looking to trade 1 Lemon plant for Jasmine vine'"
                className="mt-1 w-full rounded-lg border border-forest-100 bg-white px-3 py-2 text-xs sm:text-sm text-forest-950"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-forest-900 uppercase">Hub Section</label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value as CommunityPost["category"])}
                  className="mt-1 w-full rounded-lg border border-forest-100 bg-white px-2 py-2 text-xs text-forest-950"
                >
                  <option value="customer-lounge">Customer Lounge (Tips & Chat)</option>
                  <option value="disease-help">Disease Troubleshooting HELP</option>
                  <option value="seed-swap">Seed Swap (Barter Trade)</option>
                  <option value="seller-hub">Seller Nursery Guild (Sellers Only)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-forest-900 uppercase">Select Tag</label>
                <select
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-forest-100 bg-white px-2 py-2 text-xs text-forest-950"
                >
                  <option value="Yellowing Leaves">Yellowing Leaves</option>
                  <option value="Seed Swap">Seed Swap</option>
                  <option value="Seller Secrets">Seller Secrets</option>
                  <option value="Repotting">Repotting</option>
                  <option value="Organics">Organics</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-forest-900 uppercase">Message Body</label>
              <textarea
                required
                rows={4}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Mention environmental variables: watering frequencies, container sizes, natural daylight..."
                className="mt-1 w-full rounded-lg border border-forest-100 bg-white px-3 py-2 text-xs sm:text-sm text-forest-950"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowCreator(false)}
                className="px-3 py-1.5 text-xs font-semibold text-forest-800 hover:bg-forest-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-forest-900 hover:bg-forest-950 text-cream-50 text-xs font-bold rounded-lg"
              >
                Publish Thread (+15 XP)
              </button>
            </div>
          </form>
        </div>
      )}

      {/* POSTS LIST */}
      <div className="space-y-5">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-cream-50 rounded-[32px] border-2 border-forest-900/10 p-8 max-w-sm mx-auto shadow-xs">
            <MessageSquare className="mx-auto h-12 w-12 text-sage-300" />
            <h4 className="mt-4 text-sm font-bold text-forest-900">No threads active currently</h4>
            <p className="text-xs text-forest-700 mt-1">Be the first to plant a discussion topic in GUL Communities!</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="rounded-[32px] border-2 border-forest-900/10 bg-cream-50 p-6 shadow-2xs hover:shadow-xs transition-shadow"
            >
              {/* Post top header details */}
              <div className="flex items-center justify-between mb-3 text-[10px] sm:text-xs">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-forest-900 text-gold-500 font-bold flex items-center justify-center">
                    {post.authorName.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-forest-950 leading-none">{post.authorName}</h5>
                    <span className="text-[10px] text-sage-500">{post.authorBadge}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-sm bg-cream-200 text-forest-800 text-[10px] font-semibold uppercase font-mono">
                    {post.category}
                  </span>
                  <span className="text-gray-400 font-mono text-[10px]">{post.date}</span>
                </div>
              </div>

              {/* Title and Content */}
              <h4 className="font-display font-extrabold text-base sm:text-lg text-forest-900 mb-2 leading-snug">
                {post.title}
              </h4>
              <p className="text-xs sm:text-sm text-forest-850 leading-relaxed whitespace-pre-line mb-4">
                {post.content}
              </p>

              {/* Action drawer (Like, Comments button, tag) */}
              <div className="flex items-center justify-between border-t border-forest-100/50 pt-3 mb-1">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                      post.hasLiked ? "text-red-500" : "text-forest-700 hover:text-red-400"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${post.hasLiked ? "fill-current text-red-500" : ""}`} />
                    <span>{post.likesCount} Likes</span>
                  </button>

                  <button
                    onClick={() => {
                      if (activeCommentPostId === post.id) {
                        setActiveCommentPostId(null);
                      } else {
                        setActiveCommentPostId(post.id);
                      }
                    }}
                    className="flex items-center space-x-1.5 text-xs font-semibold text-forest-700 hover:text-forest-950 cursor-pointer"
                  >
                    <MessageSquare className="h-4 w-4 text-sage-500" />
                    <span>{post.comments.length} Comments</span>
                  </button>
                </div>

                <span className="inline-flex items-center text-[10px] font-bold text-sage-600 bg-sage-50 px-2 py-1 rounded-sm border border-sage-200">
                  #{post.tag}
                </span>
              </div>

              {/* Comments expander drawer */}
              {activeCommentPostId === post.id && (
                <div className="mt-4 border-t border-forest-100/40 pt-4 space-y-4 bg-cream-100/30 -mx-5 -mb-5 p-5 rounded-b-2xl">
                  {/* List of comments */}
                  {post.comments.map((com) => (
                    <div key={com.id} className="text-xs border-b border-forest-50 pb-2 last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between font-bold text-forest-900 mb-1">
                        <span className="flex items-center space-x-1">
                          <span>{com.authorName}</span>
                          <span className="text-[9px] uppercase tracking-wider px-1 py-0.2 rounded bg-sage-500/10 text-sage-600 font-mono">
                            {com.authorRole}
                          </span>
                        </span>
                        <span className="font-normal text-gray-400 font-mono">{com.date}</span>
                      </div>
                      <p className="text-forest-800 leading-relaxed font-normal">{com.content}</p>
                    </div>
                  ))}

                  {/* Comment Input Box */}
                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="text"
                      placeholder="Offer your botanical feedback or supportive tips..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      className="flex-1 rounded-lg border border-forest-100 bg-white px-3 py-2 text-xs text-forest-950 focus:outline-hidden"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="px-3 py-2 bg-forest-900 hover:bg-forest-950 text-cream-50 text-[11px] font-bold rounded-lg cursor-pointer transition-colors"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              )}

            </div>
          ))
        )}
      </div>

    </div>
  );
}

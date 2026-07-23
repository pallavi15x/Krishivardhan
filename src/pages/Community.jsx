import React, { useState, useEffect } from "react";
import { Avatar } from "../components/Helpers";
import { slist, sget, sset } from "../utils/storage";

const TOPICS = ["All", "General Farming", "Pest Control", "Market Prices", "Weather", "Technology", "Success Stories", "Water Management"];

export function Community({ session }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("General Farming");
  const [filter, setFilter] = useState("All");
  const [submitting, setSubmitting] = useState(false);

  async function loadPosts() {
    const keys = await slist("post:");
    const list = [];
    for (const k of keys) {
      const p = await sget(k);
      if (p) list.push(p);
    }
    list.sort((a, b) => b.createdAt - a.createdAt);
    setPosts(list);
    setLoading(false);
  }

  useEffect(() => {
    // Seed initial community posts
    (async () => {
      const existing = await slist("post:");
      if (existing.length === 0) {
        const seedPosts = [
          { id: "post:seed1", title: "Tomato yield doubled after switching to drip irrigation!", content: "Namaste fellow farmers! Last year I was struggling with water stress in my tomato crop during peak summer. My KVK advisor suggested switching from flood to drip irrigation. Result: 40% less water usage, 90% less disease, and yield doubled from 8 to 16 tonnes per acre. Happy to share more details!", author: "Ramesh Patel", phone: "9876543210", topic: "Water Management", likes: 34, createdAt: Date.now() - 864000000 },
          { id: "post:seed2", title: "PM-KISAN payment delayed? Here's what to do", content: "Many farmers in Punjab are facing delays in PM-KISAN installments due to Aadhar-bank linking issues. Here's the step-by-step process: 1) Visit pmkisan.gov.in 2) Click 'Beneficiary Status' 3) Check if your Aadhar is properly linked. If not, visit your nearest bank branch with Aadhar card. Payment usually reflects within 72 hours after linking.", author: "Gurpreet Singh", phone: "9876543211", topic: "General Farming", likes: 28, createdAt: Date.now() - 432000000 },
          { id: "post:seed3", title: "Organic Nashik onion got 30% premium in Pune market", content: "Converting 2 acres to organic onion cultivation last season was the best decision. Followed all protocols — no synthetic pesticides, used neem-based sprays, FYM application. Got certified through organic certification agency. Received ₹28/kg vs ₹21/kg for conventional onions in Pune APMC. ROI was excellent!", author: "Savita Patil", phone: "9876543212", topic: "Market Prices", likes: 42, createdAt: Date.now() - 216000000 },
        ];
        for (const post of seedPosts) await sset(post.id, post);
      }
      loadPosts();
    })();
  }, []);

  async function submitPost() {
    if (!session) return;
    if (!title.trim() || !content.trim()) return;
    setSubmitting(true);
    const id = "post:" + Date.now().toString(36);
    await sset(id, {
      id, title, content, topic,
      author: session.name,
      phone: session.phone,
      likes: 0,
      createdAt: Date.now(),
    });
    setSubmitting(false);
    setShowForm(false);
    setTitle("");
    setContent("");
    loadPosts();
  }

  async function like(post) {
    await sset(post.id, { ...post, likes: (post.likes || 0) + 1 });
    loadPosts();
  }

  const filtered = filter === "All" ? posts : posts.filter((p) => p.topic === filter);

  const TOPIC_COLORS = {
    "General Farming": "bg-green-100 text-green-800",
    "Pest Control": "bg-red-100 text-red-800",
    "Market Prices": "bg-amber-100 text-amber-800",
    "Weather": "bg-blue-100 text-blue-800",
    "Technology": "bg-purple-100 text-purple-800",
    "Success Stories": "bg-teal-100 text-teal-800",
    "Water Management": "bg-sky-100 text-sky-800",
  };

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold text-green-950">🧑🌾 Farmer Community</h2>
          <p className="text-green-900/60 text-sm mt-1">Share experiences, ask questions, and learn from fellow farmers across India.</p>
        </div>
        {session && (
          <button onClick={() => setShowForm(!showForm)} className="btn-press bg-green-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-800 transition-colors shadow-sm">
            ✍️ Share Your Story
          </button>
        )}
      </div>

      {/* Post Form */}
      {showForm && session && (
        <div className="bg-white border border-green-950/10 rounded-2xl p-6 mb-7 shadow-md" style={{ animation: "fadeUp 0.2s ease" }}>
          <h3 className="font-serif font-bold text-lg text-green-950 mb-4">Share with the Community</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-green-900/70 mb-1.5">Topic</label>
              <select value={topic} onChange={(e) => setTopic(e.target.value)} className="input">
                {TOPICS.filter((t) => t !== "All").map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-green-900/70 mb-1.5">Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="input" placeholder="Share your tip, experience, or question…" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-green-900/70 mb-1.5">Details</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} className="input resize-none" placeholder="Share your full experience, advice, or story. The more detail, the more helpful it is to other farmers!" />
            </div>
            <div className="flex gap-3">
              <button onClick={submitPost} disabled={submitting || !title.trim() || !content.trim()} className="btn-press bg-green-900 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-800 transition-colors">
                {submitting ? "Posting…" : "Post to Community"}
              </button>
              <button onClick={() => setShowForm(false)} className="text-sm text-green-900/60 hover:text-green-900 px-4 py-2.5 rounded-xl hover:bg-stone-100 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Topic Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {TOPICS.map((t) => (
          <button key={t} onClick={() => setFilter(t)} className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold border-2 transition-all ${filter === t ? "border-green-800 bg-green-900 text-white" : "border-stone-200 bg-white text-green-900/70 hover:border-green-700"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Posts */}
      {loading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="animate-pulse bg-stone-200 rounded-2xl h-36" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
          <div className="text-5xl mb-3">🧑🌾</div>
          <div className="font-serif font-bold text-green-950 mb-2">No posts yet in this topic</div>
          <p className="text-sm text-green-900/60">Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map((post, i) => (
            <div key={post.id} className="bg-white border border-green-950/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow" style={{ animation: `fadeUp 0.2s ${i * 0.05}s ease both` }}>
              <div className="flex items-start gap-3 mb-3">
                <Avatar name={post.author} size={40} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-serif font-bold text-base text-green-950 leading-snug">{post.title}</h4>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${TOPIC_COLORS[post.topic] || "bg-stone-100 text-stone-600"}`}>{post.topic}</span>
                  </div>
                  <div className="text-xs text-green-900/60 mt-0.5 font-medium">{post.author} · {new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                </div>
              </div>
              <p className="text-sm text-green-900/80 leading-relaxed mb-4 whitespace-pre-line">{post.content}</p>
              <div className="flex items-center gap-4 border-t border-stone-100 pt-3">
                <button onClick={() => like(post)} className="btn-press flex items-center gap-1.5 text-xs font-semibold text-green-900/60 hover:text-green-900 transition-colors">
                  <span>👍</span>
                  <span>{post.likes || 0} helpful</span>
                </button>
                <span className="text-xs text-green-900/40">|</span>
                <span className="text-xs text-green-900/50">Share your experience to help others</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Avatar } from "../components/Helpers";
import { slist, sget, sset } from "../utils/storage";

const CATEGORIES = ["General", "Pest & Disease", "Market Prices", "Government Schemes", "Equipment", "Soil & Fertilizers", "Water & Irrigation"];

export function Queries({ session }) {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("General");
  const [submitting, setSubmitting] = useState(false);

  async function loadQueries() {
    const keys = await slist("query:");
    const list = [];
    for (const k of keys) {
      const q = await sget(k);
      if (q) list.push(q);
    }
    list.sort((a, b) => b.createdAt - a.createdAt);
    setQueries(list);
    setLoading(false);
  }

  useEffect(() => { loadQueries(); }, []);

  async function submit() {
    if (!subject.trim() || !body.trim()) return;
    setSubmitting(true);
    const id = "query:" + Date.now().toString(36);
    const q = {
      id, subject, body, category,
      author: session?.name || "Anonymous",
      phone: session?.phone || "—",
      status: "open",
      reply: "Thank you for your query! Our agri-expert team will respond within 24 hours. For urgent assistance, call the Kisan Helpline: 1800-180-1551.",
      createdAt: Date.now(),
    };
    await sset(id, q);
    setSubmitting(false);
    setShowForm(false);
    setSubject("");
    setBody("");
    loadQueries();
  }

  const STATUS_COLORS = { open: "bg-amber-100 text-amber-800", answered: "bg-green-100 text-green-800", closed: "bg-stone-100 text-stone-600" };

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold text-green-950">💬 Support Queries</h2>
          <p className="text-green-900/60 text-sm mt-1">Get expert answers on farming, pests, government schemes, and market prices.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-press bg-green-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-800 transition-colors shadow-sm">
          + Ask a Question
        </button>
      </div>

      {/* Submit Form */}
      {showForm && (
        <div className="bg-white border border-green-950/10 rounded-2xl p-6 mb-7 shadow-md" style={{ animation: "fadeUp 0.2s ease" }}>
          <h3 className="font-serif font-bold text-lg text-green-950 mb-4">Submit Your Query</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-green-900/70 mb-1.5">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-green-900/70 mb-1.5">Subject</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} className="input" placeholder="Briefly describe your problem" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-green-900/70 mb-1.5">Describe your query in detail</label>
              <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} className="input resize-none" placeholder="Include crop name, location, symptoms, what you've already tried…" />
            </div>
            <div className="flex gap-3">
              <button onClick={submit} disabled={submitting || !subject.trim() || !body.trim()} className="btn-press bg-green-900 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-800 transition-colors">
                {submitting ? "Submitting…" : "Submit Query"}
              </button>
              <button onClick={() => setShowForm(false)} className="text-sm text-green-900/60 hover:text-green-900 px-4 py-2.5 rounded-xl hover:bg-stone-100 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Query List */}
      {loading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="animate-pulse bg-stone-200 rounded-2xl h-28" />)}</div>
      ) : queries.length === 0 ? (
        <div className="text-center py-16 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
          <div className="text-5xl mb-3">💬</div>
          <div className="font-serif font-bold text-green-950 mb-2">No queries yet</div>
          <p className="text-sm text-green-900/60">Be the first to ask a farming question!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {queries.map((q, i) => (
            <div key={q.id} className="bg-white border border-green-950/10 rounded-2xl p-5 shadow-sm" style={{ animation: `fadeUp 0.2s ${i * 0.05}s ease both` }}>
              <div className="flex items-start gap-3 mb-3">
                <Avatar name={q.author} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm text-green-950 flex-1">{q.subject}</h4>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${STATUS_COLORS[q.status] || "bg-stone-100 text-stone-600"}`}>{q.status}</span>
                  </div>
                  <div className="text-xs text-green-900/60 mt-0.5">{q.author} · {q.category} · {new Date(q.createdAt).toLocaleDateString("en-IN")}</div>
                </div>
              </div>
              <p className="text-sm text-green-900/80 leading-relaxed mb-3">{q.body}</p>
              {q.reply && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4" style={{ animation: "fadeUp 0.2s ease" }}>
                  <div className="text-xs font-bold text-green-900 mb-1.5">✅ Expert Reply</div>
                  <p className="text-sm text-green-800 leading-relaxed">{q.reply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

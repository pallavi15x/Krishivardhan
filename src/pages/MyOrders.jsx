import React, { useState, useEffect } from "react";
import { StarInput } from "../components/Helpers";
import { slist, sget, sset } from "../utils/storage";

const STATUS_COLORS = {
  placed: "bg-amber-100 text-amber-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export function MyOrders({ session, go, showToast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewMap, setReviewMap] = useState({});
  const [reviewForm, setReviewForm] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    if (!session) return;
    (async () => {
      const keys = await slist("order:");
      const list = [];
      for (const k of keys) {
        const o = await sget(k);
        if (o && o.customerPhone === session.phone) list.push(o);
      }
      list.sort((a, b) => b.createdAt - a.createdAt);
      setOrders(list);
      setLoading(false);
    })();
  }, [session]);

  async function submitReview(order) {
    if (!rating) { showToast("Please select a star rating."); return; }
    const reviewId = "review:" + Date.now();
    const farmerPhones = [...new Set(order.items.map((i) => i.farmerPhone))];
    for (const fp of farmerPhones) {
      await sset(reviewId + "-" + fp, {
        id: reviewId,
        farmerPhone: fp,
        customerName: session.name,
        customerPhone: session.phone,
        orderId: order.id,
        rating,
        text: reviewText,
        createdAt: Date.now(),
      });
    }
    setReviewMap((m) => ({ ...m, [order.id]: true }));
    setReviewForm(null);
    setRating(0);
    setReviewText("");
    showToast("Review submitted! Thank you 🙏");
  }

  if (!session) return <div className="max-w-2xl mx-auto px-5 py-16 text-center text-green-900/60">Please log in to view orders.</div>;

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <h2 className="text-3xl font-serif font-bold text-green-950 mb-1">My Orders</h2>
      <p className="text-green-900/60 text-sm mb-8">Track all your purchases from our farmers.</p>

      {loading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="animate-pulse bg-stone-200 rounded-2xl h-36" />)}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
          <div className="text-6xl mb-4">🛒</div>
          <div className="text-lg font-serif font-bold text-green-950 mb-2">No orders yet</div>
          <p className="text-green-900/60 text-sm mb-6">Start shopping from our farmers' fresh produce!</p>
          <button onClick={() => go("marketplace")} className="btn-press bg-green-900 text-white px-7 py-3 rounded-xl font-semibold text-sm hover:bg-green-800 transition-colors">
            Browse Marketplace
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-green-950/10 rounded-2xl p-6 shadow-sm" style={{ animation: "fadeUp 0.2s ease" }}>
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <div className="font-mono text-sm font-bold text-green-950">{order.id}</div>
                  <div className="text-xs text-green-900/60 mt-0.5 font-medium">{new Date(order.createdAt).toLocaleString("en-IN")}</div>
                </div>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide ${STATUS_COLORS[order.status] || "bg-stone-100 text-stone-600"}`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm text-green-900/80">
                    <span>{item.name} ×{item.qty} <span className="text-green-900/50">from {item.farmerName}</span></span>
                    <span className="font-mono font-semibold">₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-100 pt-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-green-900/60">Total: </span>
                  <span className="font-mono font-bold text-green-950">₹{order.total.toLocaleString("en-IN")}</span>
                  <span className="text-xs text-green-900/60 ml-3">📍 {order.address}</span>
                </div>
                {order.status === "delivered" && !reviewMap[order.id] && (
                  <button
                    onClick={() => setReviewForm(order.id)}
                    className="btn-press text-xs bg-amber-500 text-green-950 px-4 py-2 rounded-lg font-bold hover:bg-amber-400 transition-colors"
                  >
                    ⭐ Leave Review
                  </button>
                )}
                {reviewMap[order.id] && <span className="text-xs text-green-700 font-semibold">✅ Review submitted</span>}
              </div>

              {reviewForm === order.id && (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4" style={{ animation: "fadeUp 0.2s ease" }}>
                  <h4 className="font-serif font-bold text-sm text-green-950 mb-3">Rate your experience</h4>
                  <StarInput value={rating} onChange={setRating} />
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={2}
                    className="input mt-3 resize-none text-sm"
                    placeholder="Share your experience with this farmer (optional)..."
                  />
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => submitReview(order)} className="btn-press bg-green-900 text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-green-800">Submit Review</button>
                    <button onClick={() => setReviewForm(null)} className="text-xs text-green-900/60 hover:text-green-900 px-3 py-2 rounded-lg">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

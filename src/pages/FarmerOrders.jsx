import React, { useState, useEffect } from "react";
import { slist, sget, sset } from "../utils/storage";

const STATUS_FLOW = { placed: "processing", processing: "shipped", shipped: "delivered" };
const STATUS_COLORS = {
  placed: "bg-amber-100 text-amber-800 border-amber-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
};

export function FarmerOrders({ session, go, showToast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  async function loadOrders() {
    if (!session) return;
    const keys = await slist("order:");
    const list = [];
    for (const k of keys) {
      const o = await sget(k);
      if (!o) continue;
      const mine = o.items.some((it) => it.farmerPhone === session.phone);
      if (mine) list.push(o);
    }
    list.sort((a, b) => b.createdAt - a.createdAt);
    setOrders(list);
    setLoading(false);
  }

  useEffect(() => { loadOrders(); }, [session]);

  async function advanceStatus(order) {
    const next = STATUS_FLOW[order.status];
    if (!next) return;
    const updated = { ...order, status: next };
    await sset("order:" + order.id, updated);
    showToast(`Order ${order.id} marked as ${next} ✅`);
    loadOrders();
  }

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  if (!session) return <div className="max-w-4xl mx-auto px-5 py-16 text-center text-green-900/60">Please log in as a farmer.</div>;

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <h2 className="text-3xl font-serif font-bold text-green-950 mb-1">Incoming Orders</h2>
      <p className="text-green-900/60 text-sm mb-7">Manage and fulfill orders from your customers.</p>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 bg-stone-100 p-1 rounded-xl w-fit">
        {["all", "placed", "processing", "shipped", "delivered"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
              filter === s ? "bg-white text-green-950 shadow" : "text-green-900/60 hover:text-green-900"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="animate-pulse bg-stone-200 rounded-2xl h-36" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
          <div className="text-5xl mb-3">📦</div>
          <div className="font-serif font-bold text-green-950 mb-2">No {filter !== "all" ? filter : ""} orders found</div>
          <p className="text-sm text-green-900/60">List your crops to start receiving orders!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => {
            const myItems = order.items.filter((it) => it.farmerPhone === session.phone);
            const myTotal = myItems.reduce((s, it) => s + it.price * it.qty, 0);
            return (
              <div key={order.id} className="bg-white border border-green-950/10 rounded-2xl p-6 shadow-sm" style={{ animation: "fadeUp 0.2s ease" }}>
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="font-mono text-sm font-bold text-green-950">{order.id}</div>
                    <div className="text-xs text-green-900/60 mt-0.5 font-medium">{new Date(order.createdAt).toLocaleString("en-IN")}</div>
                    <div className="text-xs text-green-900/70 mt-1">👤 {order.customerName} · 📍 {order.address}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide border ${STATUS_COLORS[order.status] || "bg-stone-100 text-stone-600 border-stone-200"}`}>
                      {order.status}
                    </span>
                    {STATUS_FLOW[order.status] && (
                      <button
                        onClick={() => advanceStatus(order)}
                        className="btn-press text-xs bg-green-900 text-white px-4 py-1.5 rounded-lg font-bold hover:bg-green-800 transition-colors"
                      >
                        Mark as {STATUS_FLOW[order.status]} →
                      </button>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5 border-t border-stone-100 pt-3">
                  {myItems.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm text-green-900/80">
                      <span>{item.name} ×{item.qty} {item.unit}</span>
                      <span className="font-mono font-semibold">₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-green-950 pt-2 border-t border-stone-100 text-base">
                    <span>Your Earnings</span>
                    <span className="font-mono text-green-700">₹{myTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

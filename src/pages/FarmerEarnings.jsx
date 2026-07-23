import React, { useState, useEffect } from "react";
import { slist, sget } from "../utils/storage";

export function FarmerEarnings({ session, go }) {
  const [data, setData] = useState({ total: 0, byMonth: {}, byProduct: {}, orderCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    (async () => {
      const keys = await slist("order:");
      let total = 0, orderCount = 0;
      const byMonth = {}, byProduct = {};
      for (const k of keys) {
        const o = await sget(k);
        if (!o) continue;
        const myItems = o.items.filter((it) => it.farmerPhone === session.phone);
        if (!myItems.length) continue;
        orderCount++;
        const month = new Date(o.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
        for (const item of myItems) {
          const earned = item.price * item.qty;
          total += earned;
          byMonth[month] = (byMonth[month] || 0) + earned;
          byProduct[item.name] = (byProduct[item.name] || 0) + earned;
        }
      }
      setData({ total, byMonth, byProduct, orderCount });
      setLoading(false);
    })();
  }, [session]);

  const sortedProducts = Object.entries(data.byProduct).sort(([, a], [, b]) => b - a).slice(0, 8);
  const sortedMonths = Object.entries(data.byMonth).sort(([a], [b]) => new Date(a) - new Date(b));
  const maxMonthVal = Math.max(...sortedMonths.map(([, v]) => v), 1);

  if (!session) return <div className="max-w-4xl mx-auto px-5 py-16 text-center text-green-900/60">Please log in as a farmer.</div>;

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <h2 className="text-3xl font-serif font-bold text-green-950 mb-1">Earnings Dashboard</h2>
      <p className="text-green-900/60 text-sm mb-8">A complete view of your farm income.</p>

      {loading ? (
        <div className="grid sm:grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="animate-pulse bg-stone-200 rounded-2xl h-28" />)}</div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid sm:grid-cols-3 gap-5 mb-10">
            {[
              { label: "Total Earnings", value: "₹" + data.total.toLocaleString("en-IN"), icon: "💰", color: "from-amber-500 to-amber-600" },
              { label: "Total Orders", value: data.orderCount, icon: "📦", color: "from-green-800 to-green-900" },
              { label: "Avg per Order", value: data.orderCount ? "₹" + Math.round(data.total / data.orderCount).toLocaleString("en-IN") : "₹0", icon: "📊", color: "from-blue-700 to-blue-800" },
            ].map((card) => (
              <div key={card.label} className={`bg-gradient-to-br ${card.color} text-white rounded-2xl p-6 shadow-md`} style={{ animation: "popIn 0.3s ease" }}>
                <div className="text-3xl mb-2">{card.icon}</div>
                <div className="font-mono font-bold text-2xl">{card.value}</div>
                <div className="text-white/70 text-xs font-medium mt-1">{card.label}</div>
              </div>
            ))}
          </div>

          {/* Monthly Revenue Chart */}
          {sortedMonths.length > 0 && (
            <div className="bg-white border border-green-950/10 rounded-2xl p-6 mb-6 shadow-sm">
              <h3 className="font-serif font-bold text-lg text-green-950 mb-5">Monthly Revenue</h3>
              <div className="flex items-end gap-3 overflow-x-auto pb-2" style={{ minHeight: 120 }}>
                {sortedMonths.map(([month, val]) => (
                  <div key={month} className="flex flex-col items-center gap-1 shrink-0 min-w-[50px]">
                    <div className="text-xs font-mono font-semibold text-green-900 mb-1">₹{(val / 1000).toFixed(0)}K</div>
                    <div
                      className="w-10 bg-gradient-to-t from-green-800 to-green-600 rounded-t-lg transition-all"
                      style={{ height: Math.max(10, (val / maxMonthVal) * 100) + "px" }}
                    />
                    <div className="text-[10px] text-green-900/60 font-medium">{month}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Products */}
          {sortedProducts.length > 0 && (
            <div className="bg-white border border-green-950/10 rounded-2xl p-6 shadow-sm">
              <h3 className="font-serif font-bold text-lg text-green-950 mb-5">Top Earning Products</h3>
              <div className="space-y-3">
                {sortedProducts.map(([name, val], i) => (
                  <div key={name} className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-green-900 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-green-950 truncate">{name}</span>
                        <span className="font-mono font-bold text-green-800 ml-3 shrink-0">₹{val.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-green-800 rounded-full"
                          style={{ width: `${(val / sortedProducts[0][1]) * 100}%`, transition: "width 0.6s ease" }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.total === 0 && (
            <div className="text-center py-16 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
              <div className="text-5xl mb-3">💰</div>
              <div className="font-serif font-bold text-green-950 mb-2">No earnings yet</div>
              <p className="text-sm text-green-900/60">Start listing your crops to receive orders and earn income!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

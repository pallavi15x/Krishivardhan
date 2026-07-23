import React, { useState, useEffect } from "react";
import { Avatar, FadeIn, useCountUp, getFarmerRating } from "../components/Helpers";
import { slist, sget } from "../utils/storage";
import { 
  Sprout, 
  Package, 
  Coins, 
  Bot, 
  ScanLine, 
  CloudSun, 
  Star, 
  MapPin 
} from "lucide-react";

export function FarmerDashboard({ session, go }) {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, rating: 0, ratingCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    (async () => {
      const prodKeys = await slist("product:");
      let products = 0;
      for (const k of prodKeys) {
        const p = await sget(k);
        if (p && p.farmerPhone === session.phone && p.status === "available") products++;
      }

      const orderKeys = await slist("order:");
      let orders = 0, revenue = 0;
      for (const k of orderKeys) {
        const o = await sget(k);
        if (!o) continue;
        const mine = o.items.some((it) => it.farmerPhone === session.phone);
        if (mine) {
          orders++;
          const myRevenue = o.items.filter((it) => it.farmerPhone === session.phone).reduce((s, it) => s + it.price * it.qty, 0);
          revenue += myRevenue;
        }
      }

      const { avg, count } = await getFarmerRating(session.phone);
      setStats({ products, orders, revenue, rating: avg, ratingCount: count });
      setLoading(false);
    })();
  }, [session]);

  if (!session) return <div className="max-w-4xl mx-auto px-5 py-16 text-center text-green-900/60">Please log in as a farmer.</div>;

  const quickActions = [
    { icon: Sprout, label: "My Listings", desc: "Add & manage crop listings", action: "farmer-crops", color: "#1F4D36" },
    { icon: Package, label: "Orders", desc: "View & fulfill incoming orders", action: "farmer-orders", color: "#3D6E8E" },
    { icon: Coins, label: "Earnings", desc: "See your income analytics", action: "farmer-earnings", color: "#C6952E" },
    { icon: Bot, label: "AI Assistant", desc: "Get farming tips & advice", action: "assistant", color: "#8358B0" },
    { icon: ScanLine, label: "Disease Check", desc: "Diagnose crop diseases fast", action: "disease", color: "#B23A2E" },
    { icon: CloudSun, label: "Weather", desc: "Live forecast & spray advice", action: "weather", color: "#4A5A4C" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      {/* Welcome header */}
      <div className="bg-gradient-to-r from-green-900 to-green-800 text-white rounded-2xl p-7 mb-8 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-1/3 w-28 h-28 rounded-full bg-amber-500/10 -mb-10" />
        <div className="relative flex flex-wrap items-center gap-5">
          <Avatar name={session.name} size={64} />
          <div>
            <div className="text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">Farmer Dashboard</div>
            <h2 className="text-2xl font-serif font-bold">Welcome back, {session.name.split(" ")[0]}!</h2>
            <p className="text-white/70 text-sm mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span>{[session.village, session.district, session.state].filter(Boolean).join(", ")}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="animate-pulse bg-stone-200 rounded-2xl h-24" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Active Listings" value={stats.products} icon={<Sprout className="w-6 h-6 text-green-700" />} color="text-green-700" />
          <StatCard label="Total Orders" value={stats.orders} icon={<Package className="w-6 h-6 text-blue-700" />} color="text-blue-700" />
          <StatCard label="Total Revenue" value={"₹" + stats.revenue.toLocaleString("en-IN")} icon={<Coins className="w-6 h-6 text-amber-600" />} color="text-amber-600" isText />
          <StatCard label={`Rating (${stats.ratingCount} reviews)`} value={stats.ratingCount ? stats.rating.toFixed(1) : "N/A"} icon={<Star className="w-6 h-6 text-amber-500 fill-amber-500" />} color="text-amber-500" isText />
        </div>
      )}

      {/* Quick Actions Grid */}
      <h3 className="text-lg font-serif font-bold text-green-950 mb-4">Quick Actions</h3>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {quickActions.map((qa, i) => {
          const IconComponent = qa.icon;
          return (
            <FadeIn key={qa.label} delay={i * 60}>
              <button
                onClick={() => go(qa.action)}
                className="hover-lift w-full text-left bg-white border border-green-950/10 rounded-2xl p-5 shadow-sm group"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3" style={{ background: qa.color + "1A", color: qa.color }}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="font-serif font-bold text-green-950 text-base group-hover:text-green-800 transition-colors">{qa.label}</div>
                <div className="text-xs text-green-900/60 mt-0.5">{qa.desc}</div>
              </button>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, isText }) {
  const displayVal = value;

  return (
    <div className="bg-white border border-green-950/10 rounded-2xl p-5 shadow-sm flex flex-col justify-between" style={{ animation: "fadeUp 0.3s ease" }}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs text-green-900/60 font-medium">{label}</span>
        <div>{icon}</div>
      </div>
      <div className={`font-mono font-bold text-xl md:text-2xl ${color}`}>{displayVal}</div>
    </div>
  );
}

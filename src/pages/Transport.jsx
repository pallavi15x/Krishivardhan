import React, { useState } from "react";
import { sset } from "../utils/storage";

const ROUTES = [
  { id: "tr1", from: "Anand, Gujarat", to: "Ahmedabad, Gujarat", distance: 72, truck: "Tata 407 (3 Ton)", available: 3, departure: "06:00 AM", price: 2200, capacity: 3000 },
  { id: "tr2", from: "Ludhiana, Punjab", to: "Delhi, NCR", distance: 280, truck: "Eicher Pro (5 Ton)", available: 2, departure: "04:30 AM", price: 5500, capacity: 5000 },
  { id: "tr3", from: "Nashik, Maharashtra", to: "Mumbai, Maharashtra", distance: 165, truck: "Mahindra Supro (2 Ton)", available: 4, departure: "07:00 AM", price: 3800, capacity: 2000 },
  { id: "tr4", from: "Karnal, Haryana", to: "Delhi, NCR", distance: 125, truck: "Tata Ace (1 Ton)", available: 5, departure: "05:00 AM", price: 1800, capacity: 1000 },
  { id: "tr5", from: "Nagpur, Maharashtra", to: "Pune, Maharashtra", distance: 230, truck: "Eicher Pro (7 Ton)", available: 1, departure: "08:00 AM", price: 7200, capacity: 7000 },
];

export function Transport({ session, go, showToast }) {
  const [selected, setSelected] = useState(null);
  const [load, setLoad] = useState(100);
  const [cropType, setCropType] = useState("");
  const [booking, setBooking] = useState(false);

  async function book() {
    if (!session) { go("auth"); return; }
    if (!cropType.trim()) { showToast("Please enter the produce type."); return; }
    setBooking(true);
    const id = "TR-" + Date.now().toString(36).toUpperCase();
    const costShare = Math.round((load / selected.capacity) * selected.price);
    await sset("transport:" + id, {
      id, routeId: selected.id, from: selected.from, to: selected.to,
      farmerPhone: session.phone, farmerName: session.name,
      cropType, load, costShare, status: "booked", createdAt: Date.now(),
    });
    setBooking(false);
    setSelected(null);
    showToast(`Transport booked! Booking ID: ${id} 🚚`);
  }

  const costShare = selected ? Math.round((load / selected.capacity) * selected.price) : 0;

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">🚚</div>
        <h2 className="text-3xl font-serif font-bold text-green-950">Shared Transport Logistics</h2>
        <p className="text-green-900/60 text-sm mt-1">Pool truck space with nearby farmers to drastically cut your delivery costs. Pay only for what you use.</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-7 text-sm text-amber-800 flex gap-3 items-start">
        <span className="text-xl shrink-0">💡</span>
        <span><strong>How it works:</strong> Select a route, specify your load (in kg), and share the truck cost proportionally with other farmers on the same route. You only pay your share — not the full truck!</span>
      </div>

      {/* Route Cards */}
      <div className="space-y-4 mb-8">
        {ROUTES.map((route, i) => (
          <div
            key={route.id}
            onClick={() => { setSelected(route.id === selected?.id ? null : route); setLoad(100); }}
            className={`cursor-pointer bg-white border-2 rounded-2xl p-5 transition-all shadow-sm hover:shadow-md ${
              selected?.id === route.id ? "border-green-800 bg-green-50" : "border-green-950/10"
            }`}
            style={{ animation: `fadeUp 0.2s ${i * 0.06}s ease both` }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-3 text-green-950">
                  <span className="font-bold text-base">📍 {route.from}</span>
                  <span className="text-green-900/40">→</span>
                  <span className="font-bold text-base">🏁 {route.to}</span>
                </div>
                <div className="text-xs text-green-900/60 mt-1.5 flex flex-wrap gap-3">
                  <span>🚛 {route.truck}</span>
                  <span>📏 {route.distance} km</span>
                  <span>⏰ Departs {route.departure}</span>
                  <span>📦 {route.available} slots left</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold text-lg text-amber-600">₹{route.price.toLocaleString("en-IN")}</div>
                <div className="text-xs text-green-900/60">full truck cost</div>
              </div>
            </div>
            {selected?.id === route.id && <div className="mt-2 text-xs text-green-800 font-semibold">✅ Selected — fill your load details below</div>}
          </div>
        ))}
      </div>

      {/* Booking Form */}
      {selected && (
        <div className="bg-white border border-green-950/10 rounded-2xl p-7 shadow-md" style={{ animation: "popIn 0.25s ease" }}>
          <h3 className="font-serif font-bold text-lg text-green-950 mb-5">Book Slot: {selected.from} → {selected.to}</h3>
          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-xs font-semibold text-green-900/70 mb-1.5">Crop / Produce Type</label>
              <input value={cropType} onChange={(e) => setCropType(e.target.value)} className="input" placeholder="e.g. Tomatoes, Onions" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-green-900/70">Your Load (kg)</label>
                <span className="font-mono font-bold text-green-900">{load} kg</span>
              </div>
              <input type="range" min="50" max={selected.capacity} step="50" value={load} onChange={(e) => setLoad(parseInt(e.target.value))} className="w-full accent-green-800" />
              <div className="text-xs text-green-900/60 mt-1">Max capacity: {selected.capacity} kg (shared among farmers)</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-900 to-green-800 text-white rounded-xl p-5 mb-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-white/70 mb-1">Your Cost Share</div>
              <div className="font-mono font-bold text-3xl">₹{costShare.toLocaleString("en-IN")}</div>
              <div className="text-xs text-white/60 mt-1">{load}kg / {selected.capacity}kg of truck · {((load / selected.capacity) * 100).toFixed(0)}% share</div>
            </div>
            <div className="text-5xl opacity-20">🚚</div>
          </div>

          <button onClick={book} disabled={booking} className="btn-press bg-green-900 text-white px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-green-800 transition-colors shadow-md">
            {booking ? "Booking…" : "🚚 Confirm Transport Slot"}
          </button>
        </div>
      )}
    </div>
  );
}

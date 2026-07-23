import React, { useState } from "react";
import { sset } from "../utils/storage";

const FACILITIES = [
  { id: "cs1", name: "AgroFreeze Cold Storage, Anand", location: "Anand, Gujarat", capacity: 500, available: 220, temp: "-18°C to +4°C", price: 45, types: ["Fruits", "Vegetables", "Dairy"], rating: 4.6 },
  { id: "cs2", name: "Punjab CoolChain Hub, Ludhiana", location: "Ludhiana, Punjab", capacity: 800, available: 350, temp: "-25°C to +2°C", price: 38, types: ["Grains", "Pulses", "Potatoes"], rating: 4.4 },
  { id: "cs3", name: "NashikAgro Freeze Centre", location: "Nashik, Maharashtra", capacity: 400, available: 180, temp: "-15°C to +6°C", price: 52, types: ["Grapes", "Onions", "Tomatoes"], rating: 4.7 },
  { id: "cs4", name: "Haryana Farmers Cold Chain", location: "Karnal, Haryana", capacity: 600, available: 290, temp: "-20°C to +4°C", price: 40, types: ["Wheat", "Vegetables", "Fruits"], rating: 4.3 },
];

export function ColdStorage({ session, go, showToast }) {
  const [selected, setSelected] = useState(null);
  const [quantity, setQuantity] = useState(10);
  const [duration, setDuration] = useState(30);
  const [cropType, setCropType] = useState("");
  const [booking, setBooking] = useState(false);

  async function book() {
    if (!session) { go("auth"); return; }
    if (!cropType.trim()) { showToast("Please enter the crop/produce type."); return; }
    setBooking(true);
    const bookingId = "CS-" + Date.now().toString(36).toUpperCase();
    const cost = quantity * selected.price * Math.ceil(duration / 30);
    await sset("coldstorage:" + bookingId, {
      id: bookingId,
      facilityId: selected.id,
      facilityName: selected.name,
      farmerPhone: session.phone,
      farmerName: session.name,
      cropType,
      quantity,
      duration,
      cost,
      status: "confirmed",
      createdAt: Date.now(),
    });
    setBooking(false);
    setSelected(null);
    showToast(`Cold storage booked! Booking ID: ${bookingId} ❄️`);
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">❄️</div>
        <h2 className="text-3xl font-serif font-bold text-green-950">Cold Storage Booking</h2>
        <p className="text-green-900/60 text-sm mt-1">Reserve nearby cold storage space to cut post-harvest losses and preserve crop quality.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-8">
        {FACILITIES.map((f, i) => (
          <div
            key={f.id}
            onClick={() => setSelected(f.id === selected?.id ? null : f)}
            className={`cursor-pointer bg-white border-2 rounded-2xl p-5 transition-all shadow-sm hover:shadow-md ${
              selected?.id === f.id ? "border-green-800 bg-green-50" : "border-green-950/10"
            }`}
            style={{ animation: `fadeUp 0.2s ${i * 0.07}s ease both` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-serif font-bold text-green-950">{f.name}</h3>
                <p className="text-xs text-green-900/60 mt-0.5">📍 {f.location}</p>
              </div>
              <div className="text-amber-500 font-bold text-sm">⭐ {f.rating}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-green-900/80">
              <div className="bg-stone-50 rounded-lg p-2 border border-stone-200">
                <div className="font-semibold text-green-950 mb-0.5">🌡️ Temperature</div>
                <div>{f.temp}</div>
              </div>
              <div className="bg-stone-50 rounded-lg p-2 border border-stone-200">
                <div className="font-semibold text-green-950 mb-0.5">📦 Available</div>
                <div>{f.available} of {f.capacity} MT</div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {f.types.map((t) => <span key={t} className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-semibold">{t}</span>)}
            </div>
            <div className="mt-3 font-mono font-bold text-amber-600">₹{f.price}/MT/month</div>
            {selected?.id === f.id && <div className="mt-2 text-xs text-green-800 font-semibold">✅ Selected — fill booking details below</div>}
          </div>
        ))}
      </div>

      {/* Booking Form */}
      {selected && (
        <div className="bg-white border border-green-950/10 rounded-2xl p-7 shadow-md" style={{ animation: "popIn 0.25s ease" }}>
          <h3 className="font-serif font-bold text-lg text-green-950 mb-5">Book: {selected.name}</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs font-semibold text-green-900/70 mb-1.5">Crop / Produce Type</label>
              <input value={cropType} onChange={(e) => setCropType(e.target.value)} className="input" placeholder="e.g. Tomatoes, Onions, Potatoes" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-green-900/70">Quantity (Metric Tonnes)</label>
                <span className="font-mono font-bold text-green-900">{quantity} MT</span>
              </div>
              <input type="range" min="1" max={selected.available} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} className="w-full accent-green-800" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-green-900/70">Duration (Days)</label>
                <span className="font-mono font-bold text-green-900">{duration} days</span>
              </div>
              <input type="range" min="7" max="180" step="7" value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} className="w-full accent-green-800" />
            </div>
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-green-900 to-green-800 text-white rounded-xl p-4 w-full text-center">
                <div className="text-xs text-white/70 mb-1">Estimated Cost</div>
                <div className="font-mono font-bold text-2xl">₹{(quantity * selected.price * Math.ceil(duration / 30)).toLocaleString("en-IN")}</div>
                <div className="text-xs text-white/60 mt-1">{quantity} MT × ₹{selected.price}/MT × {Math.ceil(duration / 30)} month(s)</div>
              </div>
            </div>
          </div>
          <button onClick={book} disabled={booking} className="btn-press bg-green-900 text-white px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-green-800 transition-colors shadow-md">
            {booking ? "Booking…" : "❄️ Confirm Booking"}
          </button>
        </div>
      )}
    </div>
  );
}

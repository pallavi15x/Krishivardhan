import React from "react";

export function Footer() {
  return (
    <footer className="bg-green-950 text-white border-t border-white/10 pt-12 pb-8">
      <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 font-bold text-xl font-serif mb-3">
            <span>🌾</span> KrishiVardhan
          </div>
          <p className="text-xs text-stone-300 leading-relaxed mb-4">
            Empowering Indian agriculture through direct farm-to-plate commerce, live weather AI, disease diagnostics, shared cold storage, and community logistics.
          </p>
          <div className="text-xs text-amber-400 font-semibold">📍 Serving 50,000+ Farmers Across India</div>
        </div>

        <div>
          <h4 className="font-serif text-sm font-semibold mb-3 text-amber-300 uppercase tracking-wide">Quick Navigation</h4>
          <ul className="space-y-2 text-xs text-stone-300">
            <li>Direct Produce Marketplace</li>
            <li>Live Weather & Spray Advisory</li>
            <li>AI Crop Disease Detection</li>
            <li>Government Schemes Portal</li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-sm font-semibold mb-3 text-amber-300 uppercase tracking-wide">Farmer Services</h4>
          <ul className="space-y-2 text-xs text-stone-300">
            <li>AI Crop Selection Wizard</li>
            <li>Cold Storage Reservation</li>
            <li>Shared Truck Transport Logistics</li>
            <li>Community Discussion Forum</li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-sm font-semibold mb-3 text-amber-300 uppercase tracking-wide">Support & Helpline</h4>
          <p className="text-xs text-stone-300 leading-relaxed mb-2">
            Farmer Kisan Helpline: <span className="font-mono text-amber-300 font-bold">1800-180-1551</span>
          </p>
          <p className="text-xs text-stone-300 leading-relaxed mb-3">
            Support Email: <span className="font-mono text-amber-300">support@krishivardhan.in</span>
          </p>
          <div className="inline-block bg-white/10 px-3 py-1.5 rounded-lg text-[11px] text-amber-200">
            🇮🇳 Digital India Agriculture Mission Initiative
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 border-t border-white/10 pt-6 text-center text-xs text-stone-400">
        © {new Date().getFullYear()} KrishiVardhan. All rights reserved. Designed for Indian Farmers & Conscious Consumers.
      </div>
    </footer>
  );
}

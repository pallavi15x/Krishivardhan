import React, { useState } from "react";

const CROP_RECOMMENDATIONS = {
  Kharif: {
    Sandy: { Low: ["Sesame", "Bajra", "Groundnut"], Medium: ["Cotton", "Soybean", "Maize"], High: ["Sugarcane", "Paddy", "Cotton"] },
    Loamy: { Low: ["Bajra", "Sorghum", "Cowpea"], Medium: ["Maize", "Soybean", "Groundnut"], High: ["Paddy", "Sugarcane", "Cotton"] },
    Clay: { Low: ["Sorghum", "Cowpea"], Medium: ["Paddy", "Jute", "Cotton"], High: ["Paddy", "Sugarcane", "Jute"] },
  },
  Rabi: {
    Sandy: { Low: ["Mustard", "Gram", "Lentil"], Medium: ["Wheat", "Mustard", "Sunflower"], High: ["Wheat", "Barley", "Mustard"] },
    Loamy: { Low: ["Gram", "Mustard", "Lentil"], Medium: ["Wheat", "Barley", "Mustard"], High: ["Wheat", "Potato", "Mustard"] },
    Clay: { Low: ["Gram", "Lentil"], Medium: ["Wheat", "Gram", "Barley"], High: ["Wheat", "Mustard", "Barley"] },
  },
  Zaid: {
    Sandy: { Low: ["Watermelon", "Musk Melon"], Medium: ["Cucumber", "Bitter Gourd"], High: ["Fodder crops", "Okra"] },
    Loamy: { Low: ["Moong", "Sunflower"], Medium: ["Maize", "Vegetables", "Moong"], High: ["Vegetables", "Maize", "Fodder"] },
    Clay: { Low: ["Moong", "Urad"], Medium: ["Vegetables", "Tinda"], High: ["Paddy", "Vegetables"] },
  },
};

const CROP_DETAILS = {
  Paddy: { profit: "High", duration: "120-150 days", tips: "Requires 1500-2000 mm water. Transplant 25-30 day seedlings.", icon: "🌾" },
  Wheat: { profit: "Medium-High", duration: "110-130 days", tips: "Best in cool, dry climate. Sow Oct-Nov. Requires 5-6 irrigations.", icon: "🌾" },
  Cotton: { profit: "High", duration: "150-180 days", tips: "Deep black soil ideal. Monitor for bollworm. High MSP value.", icon: "🪴" },
  Tomato: { profit: "Very High", duration: "60-70 days", tips: "Stake plants. Drip irrigation ideal. High market value in off-season.", icon: "🍅" },
  Potato: { profit: "High", duration: "70-100 days", tips: "Cold climate needed. Store in cold storage for better returns.", icon: "🥔" },
  Maize: { profit: "Medium", duration: "90-110 days", tips: "Drought tolerant. Multi-use: food, feed, industrial. Easy cultivation.", icon: "🌽" },
  Mustard: { profit: "Medium", duration: "100-120 days", tips: "Low water requirement. MSP guaranteed. Good oil seed value.", icon: "🌱" },
  Soybean: { profit: "Medium-High", duration: "90-100 days", tips: "Nitrogen fixer. Grows well in black soil. Export demand high.", icon: "🫘" },
};

export function CropPlanner({ session }) {
  const [season, setSeason] = useState("Kharif");
  const [soil, setSoil] = useState("Loamy");
  const [water, setWater] = useState("Medium");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function plan() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const crops = CROP_RECOMMENDATIONS[season]?.[soil]?.[water] || ["Wheat", "Mustard"];
    setResult(crops);
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">🌱</div>
        <h2 className="text-3xl font-serif font-bold text-green-950">AI Crop Planner</h2>
        <p className="text-green-900/60 text-sm mt-1">Tell us your season, soil type, and water availability — get personalised crop recommendations.</p>
      </div>

      <div className="bg-white border border-green-950/10 rounded-2xl p-7 mb-7 shadow-sm">
        <h3 className="font-serif font-bold text-lg text-green-950 mb-5">Tell us about your farm</h3>

        {/* Season */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-green-900/70 mb-2.5">🌞 Season</label>
          <div className="flex gap-3">
            {["Kharif", "Rabi", "Zaid"].map((s) => (
              <button
                key={s}
                onClick={() => { setSeason(s); setResult(null); }}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-all ${
                  season === s ? "border-green-800 bg-green-50 text-green-900" : "border-stone-200 text-green-900/60 hover:border-green-800/40"
                }`}
              >
                {s === "Kharif" ? "☔ Kharif" : s === "Rabi" ? "❄️ Rabi" : "☀️ Zaid"}
              </button>
            ))}
          </div>
        </div>

        {/* Soil */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-green-900/70 mb-2.5">🌍 Soil Type</label>
          <div className="flex gap-3">
            {[["Sandy", "Light, drains fast"], ["Loamy", "Best fertility"], ["Clay", "Heavy, retains water"]].map(([s, desc]) => (
              <button
                key={s}
                onClick={() => { setSoil(s); setResult(null); }}
                className={`flex-1 py-3 px-2 rounded-xl font-semibold text-sm border-2 transition-all text-center ${
                  soil === s ? "border-green-800 bg-green-50 text-green-900" : "border-stone-200 text-green-900/60 hover:border-green-800/40"
                }`}
              >
                <div>{s}</div>
                <div className="text-[10px] font-normal mt-0.5 opacity-70">{desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Water */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-green-900/70 mb-2.5">💧 Water Availability</label>
          <div className="flex gap-3">
            {[["Low", "Rain-fed only"], ["Medium", "Canal or borewell"], ["High", "Canal + borewell"]].map(([w, desc]) => (
              <button
                key={w}
                onClick={() => { setWater(w); setResult(null); }}
                className={`flex-1 py-3 px-2 rounded-xl font-semibold text-sm border-2 transition-all text-center ${
                  water === w ? "border-green-800 bg-green-50 text-green-900" : "border-stone-200 text-green-900/60 hover:border-green-800/40"
                }`}
              >
                <div>{w}</div>
                <div className="text-[10px] font-normal mt-0.5 opacity-70">{desc}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={plan}
          disabled={loading}
          className="btn-press w-full bg-green-900 text-white rounded-xl py-3.5 font-semibold text-sm hover:bg-green-800 transition-colors shadow-md"
        >
          {loading ? "🤖 Analysing your farm conditions…" : "🌱 Get Crop Recommendations"}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div style={{ animation: "popIn 0.3s ease" }}>
          <h3 className="font-serif font-bold text-xl text-green-950 mb-5">
            Recommended Crops for {season} · {soil} Soil · {water} Water
          </h3>
          <div className="grid sm:grid-cols-3 gap-5">
            {result.map((crop, i) => {
              const details = CROP_DETAILS[crop];
              return (
                <div
                  key={crop}
                  className="bg-white border border-green-950/10 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                  style={{ animation: `fadeUp 0.3s ${i * 0.1}s ease both` }}
                >
                  <div className="text-4xl mb-3">{details?.icon || "🌿"}</div>
                  <h4 className="font-serif font-bold text-lg text-green-950">{crop}</h4>
                  {details ? (
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-green-900/60 font-medium">Profit Potential</span>
                        <span className="font-bold text-green-800">{details.profit}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-green-900/60 font-medium">Crop Duration</span>
                        <span className="font-bold text-green-800">{details.duration}</span>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-2.5 mt-2 text-xs text-amber-800 border border-amber-200 leading-relaxed">
                        💡 {details.tips}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-green-900/60 mt-2">Good choice for your conditions. Consult local KVK for variety selection.</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

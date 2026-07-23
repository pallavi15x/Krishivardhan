import React, { useState } from "react";

const CROPS = {
  Wheat: { cost: 18000, yieldVal: 90000 },
  Tomato: { cost: 35000, yieldVal: 180000 },
  Potato: { cost: 28000, yieldVal: 110000 },
  Cotton: { cost: 40000, yieldVal: 150000 },
  Mustard: { cost: 15000, yieldVal: 70000 },
};

export function ProfitCalculator() {
  const [crop, setCrop] = useState("Wheat");
  const [acres, setAcres] = useState(2);
  const { cost, yieldVal } = CROPS[crop];
  const investment = cost * acres;
  const revenue = yieldVal * acres;
  const profit = revenue - investment;
  const pct = Math.min(100, Math.round((profit / revenue) * 100));

  return (
    <div className="bg-white border border-green-950/10 rounded-2xl p-6 shadow-xl relative z-10">
      <h3 className="text-[13px] uppercase tracking-wider text-amber-600 font-bold mb-1">Interactive Profit Calculator</h3>
      <div className="font-serif text-lg text-green-950 font-bold mb-4">Estimate your season's earnings — live</div>
      
      <div className="mb-4">
        <label className="block text-xs font-semibold text-green-900/70 mb-1.5">Select Crop</label>
        <select value={crop} onChange={(e) => setCrop(e.target.value)} className="input font-medium">
          {Object.keys(CROPS).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-xs font-semibold text-green-900/70">Land Size</label>
          <span className="font-mono text-sm font-bold text-green-900">{acres} acre(s)</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="10"
          step="0.5"
          value={acres}
          onChange={(e) => setAcres(parseFloat(e.target.value))}
          className="w-full accent-green-800 cursor-pointer"
        />
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <ResultBox label="Investment" value={investment} />
        <ResultBox label="Revenue" value={revenue} />
        <ResultBox label="Est. Profit" value={profit} highlight />
      </div>

      <div className="h-2.5 bg-stone-200 rounded-full overflow-hidden mt-4">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-green-800 rounded-full"
          style={{ width: `${pct}%`, transition: "width 0.5s ease" }}
        />
      </div>
      <p className="text-[11px] text-green-900/60 mt-2.5 text-center">
        Estimated return margin: <strong className="text-green-800">{pct}%</strong> based on regional averages.
      </p>
    </div>
  );
}

function ResultBox({ label, value, highlight }) {
  return (
    <div className="bg-stone-100 rounded-xl p-3 text-center border border-stone-200">
      <div
        key={value}
        className={`font-mono font-bold text-base md:text-lg ${highlight ? "text-green-700" : "text-green-950"}`}
        style={{ animation: "fadeUp 0.3s ease" }}
      >
        ₹{Math.round(value).toLocaleString("en-IN")}
      </div>
      <div className="text-[10px] text-green-900/60 uppercase tracking-wide font-semibold mt-0.5">{label}</div>
    </div>
  );
}

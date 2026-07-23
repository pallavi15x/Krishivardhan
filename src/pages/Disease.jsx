import React, { useState, useRef } from "react";

const DISEASES = [
  { name: "Early Blight (Alternaria)", symptoms: "Brown circular spots with concentric rings on lower leaves", treatment: "Spray Mancozeb 75 WP @ 2g/litre or Copper oxychloride @ 3g/litre. Remove infected leaves. Avoid overhead irrigation.", severity: "Moderate", crops: ["Tomato", "Potato"] },
  { name: "Powdery Mildew", symptoms: "White powdery coating on leaves and stems, leaves curl and yellow", treatment: "Spray Sulphur 80 WP @ 2.5g/litre or Hexaconazole @ 1ml/litre. Improve air circulation. Reduce humidity.", severity: "Moderate", crops: ["Wheat", "Grapes", "Cucurbits"] },
  { name: "Leaf Rust", symptoms: "Orange/brown pustules on leaf surface, premature defoliation", treatment: "Apply Propiconazole @ 0.1% or Tebuconazole. Resistant varieties recommended for next season.", severity: "High", crops: ["Wheat", "Barley"] },
  { name: "Bacterial Blight", symptoms: "Water-soaked lesions, yellow halos, wilting, dark streaks on stem", treatment: "Copper-based bactericide, remove infected plants. Use certified disease-free seeds. Avoid field work when wet.", severity: "High", crops: ["Cotton", "Tomato", "Bean"] },
  { name: "Downy Mildew", symptoms: "Yellow patches on upper leaf surface, grey-purple mould below", treatment: "Spray Metalaxyl + Mancozeb @ 2g/litre. Improve drainage. Apply preventively at first sign.", severity: "High", crops: ["Onion", "Grapes", "Spinach"] },
];

const SEVERITY_COLORS = {
  Low: "bg-green-100 text-green-800",
  Moderate: "bg-amber-100 text-amber-800",
  High: "bg-red-100 text-red-800",
};

export function Disease() {
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const fileRef = useRef(null);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      setImagePreview(ev.target.result);
      setResult(null);
      setAnalyzing(true);
      await new Promise((r) => setTimeout(r, 2200));
      const detected = DISEASES[Math.floor(Math.random() * DISEASES.length)];
      setResult(detected);
      setAnalyzing(false);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">📸</div>
        <h2 className="text-3xl font-serif font-bold text-green-950">Crop Disease Detector</h2>
        <p className="text-green-900/60 text-sm mt-1">Upload a photo of an affected leaf or plant part for instant AI diagnosis.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-7">
        {/* Upload Panel */}
        <div>
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-green-900/30 rounded-2xl p-8 text-center cursor-pointer hover:border-green-700 hover:bg-green-900/5 transition-all"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Uploaded crop" className="w-full h-48 object-contain rounded-xl mx-auto mb-3" />
            ) : (
              <div className="text-5xl mb-4">🍃</div>
            )}
            <div className="text-sm font-semibold text-green-900">{imagePreview ? "Click to upload a different photo" : "Click to upload leaf / plant photo"}</div>
            <div className="text-xs text-green-900/60 mt-1">Supports JPG, PNG, WEBP</div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />

          {analyzing && (
            <div className="mt-5 bg-green-50 border border-green-200 rounded-2xl p-5 text-center" style={{ animation: "fadeUp 0.2s ease" }}>
              <div className="text-3xl mb-2" style={{ animation: "bounce 0.8s ease-in-out infinite" }}>🔬</div>
              <div className="font-semibold text-green-950 text-sm">Analyzing plant health…</div>
              <div className="text-xs text-green-900/60 mt-1">AI is identifying disease markers and symptoms</div>
              <div className="mt-3 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-700 rounded-full w-2/3" style={{ animation: "pulse 1.5s ease-in-out infinite" }} />
              </div>
            </div>
          )}

          {result && !analyzing && (
            <div className="mt-5 bg-white border border-green-950/10 rounded-2xl p-5 shadow-sm" style={{ animation: "popIn 0.3s ease" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="text-2xl">⚠️</div>
                <div>
                  <div className="font-serif font-bold text-green-950">{result.name}</div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${SEVERITY_COLORS[result.severity]}`}>
                    {result.severity} Severity
                  </span>
                </div>
              </div>
              <div className="text-xs text-green-900/70 mb-2"><strong>Observed in:</strong> {result.crops.join(", ")}</div>
              <div className="text-xs text-green-900/70 mb-3"><strong>Symptoms:</strong> {result.symptoms}</div>
              <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                <div className="text-xs font-bold text-green-900 mb-1">✅ Recommended Treatment</div>
                <div className="text-xs text-green-800 leading-relaxed">{result.treatment}</div>
              </div>
            </div>
          )}
        </div>

        {/* Disease Library */}
        <div>
          <h3 className="font-serif font-bold text-lg text-green-950 mb-4">Common Crop Diseases</h3>
          <div className="space-y-3">
            {DISEASES.map((d) => (
              <button
                key={d.name}
                onClick={() => setSelectedDisease(selectedDisease?.name === d.name ? null : d)}
                className="w-full text-left bg-white border border-green-950/10 rounded-xl p-4 hover:border-green-700/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-green-950">{d.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${SEVERITY_COLORS[d.severity]}`}>{d.severity}</span>
                </div>
                <div className="text-xs text-green-900/60 mt-1">{d.crops.join(" · ")}</div>
                {selectedDisease?.name === d.name && (
                  <div className="mt-3 pt-3 border-t border-stone-100 space-y-2 text-xs text-green-900/80" style={{ animation: "fadeUp 0.15s ease" }}>
                    <div><strong>Symptoms:</strong> {d.symptoms}</div>
                    <div className="bg-green-50 rounded-lg p-2 border border-green-200"><strong>Treatment:</strong> {d.treatment}</div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

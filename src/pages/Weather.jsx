import React, { useState, useEffect } from "react";

const LOCATIONS = [
  { city: "Anand, Gujarat", temp: 32, humidity: 68, wind: 14, rain: 0, condition: "Sunny", forecast: ["Partly Cloudy", "Sunny", "Light Rain", "Sunny", "Sunny", "Thunderstorms", "Cloudy"] },
  { city: "Ludhiana, Punjab", temp: 28, humidity: 74, wind: 8, rain: 0, condition: "Partly Cloudy", forecast: ["Cloudy", "Light Rain", "Cloudy", "Sunny", "Sunny", "Partly Cloudy", "Sunny"] },
  { city: "Nashik, Maharashtra", temp: 25, humidity: 82, wind: 18, rain: 5, condition: "Light Rain", forecast: ["Heavy Rain", "Cloudy", "Partly Cloudy", "Sunny", "Partly Cloudy", "Light Rain", "Sunny"] },
  { city: "Karnal, Haryana", temp: 30, humidity: 65, wind: 12, rain: 0, condition: "Sunny", forecast: ["Sunny", "Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Sunny", "Sunny"] },
  { city: "Nagpur, Maharashtra", temp: 35, humidity: 55, wind: 22, rain: 0, condition: "Hot & Sunny", forecast: ["Sunny", "Sunny", "Sunny", "Partly Cloudy", "Cloudy", "Thunderstorms", "Sunny"] },
];

const CONDITION_ICONS = {
  "Sunny": "☀️",
  "Partly Cloudy": "⛅",
  "Cloudy": "☁️",
  "Light Rain": "🌦️",
  "Heavy Rain": "🌧️",
  "Thunderstorms": "⛈️",
  "Hot & Sunny": "🌞",
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function Weather() {
  const [selectedLoc, setSelectedLoc] = useState(LOCATIONS[0]);
  const [advice, setAdvice] = useState([]);

  useEffect(() => {
    const adviceList = [];
    if (selectedLoc.rain > 0) {
      adviceList.push({ icon: "🚫", type: "warning", text: "Do not spray pesticides or fertilizers today. Rain will wash away chemicals before absorption." });
      adviceList.push({ icon: "💧", type: "info", text: "Good natural irrigation day. Skip scheduled irrigation to save water and prevent waterlogging." });
    } else if (selectedLoc.humidity > 75) {
      adviceList.push({ icon: "🍄", type: "warning", text: "High humidity increases risk of fungal diseases. Inspect crops for early blight or mildew symptoms." });
      adviceList.push({ icon: "💨", type: "tip", text: "Ensure good field ventilation. Thin dense canopies to improve air circulation between plants." });
    } else {
      adviceList.push({ icon: "✅", type: "success", text: "Excellent conditions for spraying! Early morning (6-9 AM) is the optimal window for pesticide and fertilizer application." });
    }
    if (selectedLoc.wind > 20) {
      adviceList.push({ icon: "🌬️", type: "warning", text: "High wind alert. Avoid spraying — chemical drift can damage neighbouring crops and reduce efficacy." });
    }
    if (selectedLoc.temp > 33) {
      adviceList.push({ icon: "🌡️", type: "tip", text: "Heat stress risk. Irrigate during early morning or late evening. Mulch soil to conserve moisture." });
    }
    adviceList.push({ icon: "📅", type: "info", text: "Check the 7-day forecast before planning harvesting or field operations to avoid weather disruptions." });
    setAdvice(adviceList);
  }, [selectedLoc]);

  const ADVICE_STYLES = {
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    tip: "bg-blue-50 border-blue-200 text-blue-800",
    info: "bg-stone-50 border-stone-200 text-stone-700",
    success: "bg-green-50 border-green-200 text-green-800",
  };

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">🌧️</div>
        <h2 className="text-3xl font-serif font-bold text-green-950">Weather Intelligence</h2>
        <p className="text-green-900/60 text-sm mt-1">Live forecasts and personalised spray, irrigation & harvest advisory.</p>
      </div>

      {/* Location Selector */}
      <div className="flex gap-2 flex-wrap mb-7 justify-center">
        {LOCATIONS.map((loc) => (
          <button
            key={loc.city}
            onClick={() => setSelectedLoc(loc)}
            className={`text-xs px-4 py-2 rounded-xl font-semibold border-2 transition-all ${
              selectedLoc.city === loc.city ? "border-green-800 bg-green-900 text-white" : "border-stone-200 bg-white text-green-900 hover:border-green-700"
            }`}
          >
            📍 {loc.city}
          </button>
        ))}
      </div>

      {/* Current Weather Card */}
      <div className="bg-gradient-to-br from-green-900 to-green-800 text-white rounded-2xl p-7 mb-7 shadow-lg relative overflow-hidden" style={{ animation: "popIn 0.3s ease" }}>
        <div className="absolute top-0 right-0 text-9xl opacity-10 -mt-6 -mr-6 select-none">
          {CONDITION_ICONS[selectedLoc.condition] || "☀️"}
        </div>
        <div className="relative">
          <div className="text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">📍 {selectedLoc.city}</div>
          <div className="text-6xl font-bold font-mono">{selectedLoc.temp}°C</div>
          <div className="text-xl mt-2 flex items-center gap-2">
            <span>{CONDITION_ICONS[selectedLoc.condition]}</span>
            <span>{selectedLoc.condition}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-5 text-sm text-white/80">
            <div><div className="text-white/60 text-xs mb-0.5">💧 Humidity</div>{selectedLoc.humidity}%</div>
            <div><div className="text-white/60 text-xs mb-0.5">💨 Wind</div>{selectedLoc.wind} km/h</div>
            <div><div className="text-white/60 text-xs mb-0.5">🌧️ Rainfall</div>{selectedLoc.rain} mm</div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="bg-white border border-green-950/10 rounded-2xl p-5 mb-7 shadow-sm">
        <h3 className="font-serif font-bold text-lg text-green-950 mb-4">7-Day Forecast</h3>
        <div className="grid grid-cols-7 gap-2">
          {selectedLoc.forecast.map((condition, i) => {
            const forecastTemp = selectedLoc.temp + (Math.round((Math.random() - 0.5) * 6));
            return (
              <div key={i} className="text-center bg-stone-50 rounded-xl p-2.5 border border-stone-200">
                <div className="text-[10px] font-bold text-green-900/60 mb-1">{DAYS[i]}</div>
                <div className="text-xl">{CONDITION_ICONS[condition] || "🌤"}</div>
                <div className="text-xs font-mono font-bold text-green-950 mt-1">{forecastTemp}°</div>
                <div className="text-[9px] text-green-900/50 mt-0.5 leading-tight">{condition}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Farm Advisory */}
      <div>
        <h3 className="font-serif font-bold text-lg text-green-950 mb-4">📋 Personalised Farm Advisory</h3>
        <div className="space-y-3">
          {advice.map((a, i) => (
            <div key={i} className={`flex gap-3 items-start border rounded-xl p-4 text-sm ${ADVICE_STYLES[a.type]}`} style={{ animation: `fadeUp 0.2s ${i * 0.07}s ease both` }}>
              <span className="text-xl shrink-0">{a.icon}</span>
              <span className="leading-relaxed">{a.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

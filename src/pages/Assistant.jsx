import React, { useState, useRef, useEffect } from "react";

const SAMPLE_QA = [
  { q: ["tomato", "disease", "leaf"], a: "Brown spots on tomato leaves are often early blight (Alternaria). Spray copper fungicide or mancozeb every 7-10 days. Remove affected leaves immediately and avoid overhead irrigation." },
  { q: ["wheat", "water", "irrigation"], a: "Wheat needs irrigation at crown root initiation (21 DAS), tillering (45 DAS), jointing (65 DAS), flowering (75 DAS) and grain filling (90 DAS). Avoid waterlogging." },
  { q: ["soil", "test", "fertility"], a: "Test your soil every 2-3 years for pH, NPK, organic carbon and micronutrients. Ideal pH for most crops is 6.5-7.5. Soil health cards are available free from Krishi Kendras." },
  { q: ["pesticide", "spray", "time"], a: "Best spray time is early morning (6–9 AM) or evening (4–7 PM) to avoid evaporation, minimize bee harm, and ensure better absorption. Avoid spraying before rain." },
  { q: ["fertilizer", "urea", "nitrogen"], a: "Apply urea in 2-3 splits rather than one dose. For wheat: 1/3 at sowing, 1/3 at first irrigation, 1/3 at second irrigation. Excess nitrogen causes lodging and reduces grain quality." },
  { q: ["organic", "compost", "manure"], a: "Apply 10-15 tonnes of farmyard manure (FYM) per acre before sowing. Vermicompost gives quicker results. Composting crop residues reduces input costs and improves soil health over 2-3 seasons." },
  { q: ["msp", "price", "selling"], a: "Check the latest MSP (Minimum Support Price) at the NAFED or Agmarknet portal. APMC mandis and FPO markets often offer better prices. KrishiVardhan's direct marketplace lets you sell above MSP." },
  { q: ["weather", "rain", "forecast"], a: "Use our Weather Intelligence page for hyperlocal forecasts tailored to your area. Always check the 10-day forecast before major field operations like sowing, spraying or harvesting." },
];

function getAnswer(query) {
  const q = query.toLowerCase();
  for (const { q: keywords, a } of SAMPLE_QA) {
    if (keywords.some((k) => q.includes(k))) return a;
  }
  return `That's a great farming question! For "${query}", I recommend consulting with your local Krishi Vigyan Kendra (KVK) or calling the Kisan Call Centre at 1800-180-1551. You can also check the ICAR website for crop-specific research-based advice. Would you like me to answer a different farming question?`;
}

export function Assistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "🌾 Namaste! I'm your KrishiVardhan AI Farming Assistant. Ask me anything about crop cultivation, pest control, fertilizers, soil health, irrigation, or market prices. I'm here to help you grow smarter!"
    }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  async function send() {
    const q = input.trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setTyping(true);
    await new Promise((r) => setTimeout(r, 900 + Math.random() * 700));
    setTyping(false);
    setMessages((m) => [...m, { role: "assistant", text: getAnswer(q) }]);
  }

  const QUICK_QUESTIONS = ["When to irrigate wheat?", "Organic compost tips", "How to deal with aphids?", "Best fertilizer for tomatoes", "MSP rates 2024"];

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <div className="text-center mb-7">
        <div className="text-4xl mb-2">🤖</div>
        <h2 className="text-3xl font-serif font-bold text-green-950">AI Farming Assistant</h2>
        <p className="text-green-900/60 text-sm mt-1">Ask anything about crops, pests, soil, weather, or market prices.</p>
      </div>

      <div className="bg-white border border-green-950/10 rounded-2xl shadow-sm overflow-hidden">
        {/* Messages */}
        <div className="h-[420px] overflow-y-auto p-5 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`} style={{ animation: "fadeUp 0.2s ease" }}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-green-900 text-white flex items-center justify-center text-sm shrink-0 mt-0.5">🤖</div>
              )}
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-green-900 text-white rounded-br-sm"
                  : "bg-stone-100 text-green-950 rounded-bl-sm"
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-3 justify-start" style={{ animation: "fadeUp 0.2s ease" }}>
              <div className="w-8 h-8 rounded-full bg-green-900 text-white flex items-center justify-center text-sm shrink-0">🤖</div>
              <div className="bg-stone-100 rounded-2xl rounded-bl-sm px-5 py-3.5 flex gap-1.5 items-center">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2 h-2 bg-green-600 rounded-full" style={{ animation: `bounce 0.9s ${i * 0.2}s ease-in-out infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick questions */}
        <div className="px-5 pb-3 flex gap-2 flex-wrap">
          {QUICK_QUESTIONS.map((qq) => (
            <button key={qq} onClick={() => setInput(qq)} className="text-xs bg-stone-100 hover:bg-stone-200 text-green-900 px-3 py-1.5 rounded-full font-medium transition-colors border border-stone-200">
              {qq}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-stone-200 p-4 flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Ask about irrigation, pests, fertilizers, MSP prices…"
            className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20 transition-all"
          />
          <button
            onClick={send}
            disabled={!input.trim() || typing}
            className="btn-press bg-green-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-800 transition-colors disabled:opacity-50"
          >
            Send →
          </button>
        </div>
      </div>
    </div>
  );
}

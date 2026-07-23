import React, { useState } from "react";

const SCHEMES = [
  { name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)", amount: "₹6,000/year in 3 installments", eligibility: "All landholding farmers with cultivable land. Excludes income taxpayers and government employees.", category: "Income Support", link: "https://pmkisan.gov.in" },
  { name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)", amount: "Subsidised crop insurance — 2% premium for Kharif, 1.5% for Rabi", eligibility: "All farmers growing notified crops. Loanee farmers mandatorily enrolled.", category: "Crop Insurance", link: "https://pmfby.gov.in" },
  { name: "Kisan Credit Card (KCC)", amount: "Revolving credit up to ₹3 lakhs at 4% interest rate", eligibility: "All farmers, sharecroppers, tenant farmers, and SHG members.", category: "Credit & Finance", link: "https://agricoop.nic.in" },
  { name: "PM Kisan Maandhan (Pension Scheme)", amount: "₹3,000/month pension after age 60", eligibility: "Small & marginal farmers aged 18-40 with land ≤ 2 hectares.", category: "Pension", link: "https://pmkmy.gov.in" },
  { name: "National Agriculture Market (e-NAM)", amount: "Access to 1,000+ APMC mandis digitally. Better prices, transparent auction.", eligibility: "Any farmer with APMC licence or through FPO membership.", category: "Market Access", link: "https://enam.gov.in" },
  { name: "Soil Health Card Scheme", amount: "Free soil testing & personalised fertilizer recommendations", eligibility: "All farmers. Cards issued every 2 years. Visit local Krishi Kendra.", category: "Farm Advisory", link: "https://soilhealth.dac.gov.in" },
  { name: "PM Kusum (Solar Pump Scheme)", amount: "90% subsidy on solar-powered water pumps for irrigation", eligibility: "Small & marginal farmers for standalone solar pumps.", category: "Solar Energy", link: "https://mnre.gov.in" },
  { name: "Agricultural Infrastructure Fund (AIF)", amount: "₹1 lakh crore fund — loans for cold storage, processing units at 3% interest subsidy", eligibility: "FPOs, farmer cooperatives, agri-entrepreneurs, individual farmers.", category: "Infrastructure", link: "https://agriinfra.dac.gov.in" },
];

const CATEGORIES = ["All", "Income Support", "Crop Insurance", "Credit & Finance", "Pension", "Market Access", "Farm Advisory", "Solar Energy", "Infrastructure"];

export function Schemes() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [expanded, setExpanded] = useState(null);

  const filtered = SCHEMES.filter((s) => {
    const matchSearch = !search || (s.name + s.eligibility + s.category).toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || s.category === category;
    return matchSearch && matchCat;
  });

  const CATEGORY_COLORS = {
    "Income Support": "bg-green-100 text-green-800",
    "Crop Insurance": "bg-blue-100 text-blue-800",
    "Credit & Finance": "bg-amber-100 text-amber-800",
    "Pension": "bg-purple-100 text-purple-800",
    "Market Access": "bg-teal-100 text-teal-800",
    "Farm Advisory": "bg-orange-100 text-orange-800",
    "Solar Energy": "bg-yellow-100 text-yellow-800",
    "Infrastructure": "bg-stone-100 text-stone-700",
  };

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">🏦</div>
        <h2 className="text-3xl font-serif font-bold text-green-950">Government Schemes</h2>
        <p className="text-green-900/60 text-sm mt-1">All major Central Government farming schemes — eligibility, benefits and application links.</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-green-950/10 rounded-2xl p-5 mb-7 shadow-sm">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-green-900/70 mb-1.5">🔍 Search</label>
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="input" placeholder="Search scheme name or keyword…" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-green-900/70 mb-1.5">📂 Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="text-xs text-green-900/60 font-medium">{filtered.length} scheme{filtered.length !== 1 ? "s" : ""} found</div>
      </div>

      {/* Scheme Cards */}
      <div className="space-y-4">
        {filtered.map((scheme, i) => (
          <div
            key={scheme.name}
            className="bg-white border border-green-950/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            style={{ animation: `fadeUp 0.2s ${i * 0.05}s ease both` }}
          >
            <button
              onClick={() => setExpanded(expanded === scheme.name ? null : scheme.name)}
              className="w-full text-left p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="font-serif font-bold text-base text-green-950 leading-snug">{scheme.name}</h3>
                  <div className="mt-2 flex flex-wrap gap-2 items-center">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[scheme.category] || "bg-stone-100 text-stone-600"}`}>
                      {scheme.category}
                    </span>
                    <span className="text-xs font-semibold text-amber-600">{scheme.amount}</span>
                  </div>
                </div>
                <span className="text-green-900/60 text-xl">{expanded === scheme.name ? "▲" : "▼"}</span>
              </div>
            </button>

            {expanded === scheme.name && (
              <div className="px-6 pb-6 border-t border-stone-100 pt-4 space-y-4" style={{ animation: "fadeUp 0.15s ease" }}>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="text-xs font-bold text-green-900 mb-1.5">✅ Eligibility Criteria</div>
                  <p className="text-sm text-green-800 leading-relaxed">{scheme.eligibility}</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="text-xs font-bold text-amber-800 mb-1.5">💰 Benefit Amount</div>
                  <p className="text-sm text-amber-800 font-semibold">{scheme.amount}</p>
                </div>
                <a href={scheme.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-green-900 text-white text-sm px-5 py-2.5 rounded-xl font-semibold hover:bg-green-800 transition-colors shadow-sm">
                  Apply / Learn More →
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

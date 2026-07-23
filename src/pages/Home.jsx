import React, { useState, useEffect } from "react";
import { FadeIn, useCountUp, Avatar, StarRating, Blob } from "../components/Helpers";
import { ProfitCalculator } from "../components/ProfitCalculator";
import { slist, sget, getFarmerRating } from "../utils/storage";
import { 
  Sprout, 
  ShoppingCart, 
  Bot, 
  ScanLine, 
  CloudSun, 
  Snowflake, 
  Truck, 
  Users, 
  Sparkles,
  Search
} from "lucide-react";

export function Home({ go, setAuthRole, viewFarmer }) {
  const [farmers, setFarmers] = useState([]);
  const [loadingFarmers, setLoadingFarmers] = useState(true);

  useEffect(() => {
    (async () => {
      const keys = await slist("account:");
      const list = [];
      for (const k of keys) {
        const a = await sget(k);
        if (a && a.role === "farmer") list.push(a);
      }
      const withRatings = await Promise.all(
        list.slice(0, 4).map(async (f) => ({ ...f, rating: await getFarmerRating(f.phone) }))
      );
      setFarmers(withRatings);
      setLoadingFarmers(false);
    })();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* HERO SECTION WITH ANIMATED DESIGNER PATTERN BACKGROUND */}
      <section className="relative bg-gradient-animated border-b border-green-950/10 pt-16 pb-24 overflow-hidden">
        {/* Animated Grid & Hex Pattern Layers */}
        <div className="absolute inset-0 bg-animated-grid opacity-60 pointer-events-none" />
        <div className="absolute inset-0 bg-hex-pattern opacity-40 pointer-events-none" />

        {/* Animated Glowing Color Orbs */}
        <Blob className="w-[520px] h-[520px] -top-24 -right-24 glow-orb-animated" color="rgba(198, 149, 46, 0.35)" />
        <Blob className="w-[460px] h-[460px] top-32 -left-28 glow-orb-animated-reverse" color="rgba(31, 77, 54, 0.28)" />
        <Blob className="w-[380px] h-[380px] -bottom-24 right-1/4 glow-orb-animated" color="rgba(61, 110, 142, 0.25)" />
        <Blob className="w-[320px] h-[320px] top-10 left-1/3 glow-orb-animated-reverse" color="rgba(34, 197, 94, 0.2)" />

        {/* Animated Geometric Pattern Decorative Ring */}
        <div className="absolute -right-16 top-1/2 -translate-y-1/2 w-96 h-96 border border-green-900/10 rounded-full spin-pattern-ring pointer-events-none flex items-center justify-center">
          <div className="w-72 h-72 border border-amber-600/15 rounded-full border-dashed" />
        </div>

        <div className="relative max-w-6xl mx-auto px-5 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <FadeIn>
              <div className="inline-flex items-center gap-1.5 bg-green-900 text-amber-200 px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold mb-4 shadow-sm">
                <Sprout className="w-3.5 h-3.5 text-amber-300" />
                <span>Farm to Plate, Digitally</span>
              </div>
            </FadeIn>
            <FadeIn delay={100}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.15] font-semibold mb-4 font-serif text-green-950">
                Grow smarter.<br />
                Sell direct.<br />
                <em className="italic text-green-800 font-serif">Earn more.</em>
              </h1>
            </FadeIn>
            <FadeIn delay={200}>
              <p className="text-base md:text-lg text-green-900/70 max-w-lg mb-8 leading-relaxed">
                KrishiVardhan connects farmers straight to consumers — with AI crop advice, live weather intelligence, disease detection, shared logistics, and cold storage. No middlemen. Fair prices for everyone.
              </p>
            </FadeIn>
            <FadeIn delay={300}>
              <div className="flex flex-wrap gap-3.5">
                <button
                  className="btn-press px-6 py-3.5 rounded-xl bg-green-900 text-white font-semibold text-sm hover:bg-green-800 transition-colors shadow-md flex items-center gap-2"
                  onClick={() => {
                    setAuthRole("farmer");
                    go("auth");
                  }}
                >
                  <Sprout className="w-4 h-4" />
                  <span>I'm a Farmer</span>
                </button>
                <button
                  className="btn-press px-6 py-3.5 rounded-xl bg-amber-500 text-green-950 font-semibold text-sm hover:bg-amber-400 transition-colors shadow-md flex items-center gap-2"
                  onClick={() => {
                    setAuthRole("customer");
                    go("auth");
                  }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>I'm a Customer</span>
                </button>
                <button
                  className="btn-press px-6 py-3.5 rounded-xl border-2 border-green-900 text-green-900 font-semibold text-sm hover:bg-green-900/5 transition-colors flex items-center gap-2"
                  onClick={() => go("marketplace")}
                >
                  <Search className="w-4 h-4" />
                  <span>Browse Marketplace</span>
                </button>
              </div>
            </FadeIn>
          </div>

          <div className="relative">
            <ProfitCalculator />
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="py-10 border-b border-green-950/10 bg-white">
        <div className="max-w-6xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <Stat value={50000} suffix="+" label="Registered Farmers" />
          <Stat value={10000} suffix="+" label="Daily Orders" />
          <Stat value={500} suffix="+" label="Cities Connected" />
          <Stat value={5} prefix="₹" suffix=" Cr+" label="Farmer Income Generated" />
        </div>
      </section>

      {/* THE JOURNEY */}
      <section className="relative py-24 overflow-hidden border-b border-green-950/10">
        <div className="absolute inset-0 bg-hex-pattern opacity-30 pointer-events-none" />
        <Blob className="w-80 h-80 top-10 right-10 glow-orb-animated" color="rgba(198, 149, 46, 0.2)" />
        <Blob className="w-80 h-80 bottom-10 left-10 glow-orb-animated-reverse" color="rgba(31, 77, 54, 0.2)" />

        <div className="relative max-w-6xl mx-auto px-5">
          <div className="max-w-xl mb-14 mx-auto text-center">
            <div className="text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">The Journey</div>
            <h2 className="text-3xl md:text-4xl font-serif text-green-950 font-bold">How KrishiVardhan works</h2>
          </div>
        <div className="relative grid sm:grid-cols-4 gap-6">
          <div className="hidden sm:block absolute top-7 left-[12%] right-[12%] h-[2px] bg-green-900/15" />
          {[
            [Sprout, "List Your Crop", "Farmer adds produce with photos, price and quantity in minutes."],
            [Bot, "Get AI Guidance", "Weather, disease detection and crop advice — right from the app."],
            [ShoppingCart, "Customer Buys Direct", "No middlemen. Customers browse, order and pay securely."],
            [Truck, "Deliver & Get Paid", "Shared transport delivers the order — farmer gets paid fairly."],
          ].map(([IconComponent, title, desc], i) => (
            <FadeIn key={title} delay={i * 100}>
              <div className="text-center relative">
                <div
                  className="w-14 h-14 rounded-full bg-white border-2 border-green-900 flex items-center justify-center mx-auto mb-3 shadow-md relative z-10 text-green-800"
                  style={{ animation: `floaty 3s ${i * 0.3}s ease-in-out infinite` }}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-base mb-1 font-serif text-green-950">{title}</h3>
                <p className="text-xs text-green-900/70 leading-relaxed">{desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        </div>
      </section>

      {/* FEATURED FARMERS */}
      <section className="bg-white border-y border-green-950/10 py-20">
        <div className="max-w-6xl mx-auto px-5">
          <div className="max-w-xl mb-10">
            <div className="text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">Meet the growers</div>
            <h2 className="text-3xl font-serif text-green-950 font-bold">Featured Verified Farmers</h2>
          </div>
          {loadingFarmers ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-stone-100 rounded-2xl h-40" />
              ))}
            </div>
          ) : farmers.length === 0 ? (
            <div className="text-center py-10 text-green-900/60 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
              No farmers registered yet — be the first!{" "}
              <button onClick={() => go("auth")} className="text-green-800 font-semibold underline ml-1">
                Join as a farmer
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
              {farmers.map((f, i) => (
                <FadeIn key={f.phone} delay={i * 80}>
                  <div
                    onClick={() => viewFarmer(f.phone)}
                    className="hover-lift cursor-pointer bg-stone-50 border border-green-950/10 rounded-2xl p-5 text-center"
                  >
                    <div className="flex justify-center mb-3">
                      <Avatar name={f.name} size={60} />
                    </div>
                    <h4 className="font-semibold text-base font-serif text-green-950">{f.name}</h4>
                    <p className="text-xs text-green-900/60 mb-2">
                      {f.village || "—"}{f.district ? `, ${f.district}` : ""}
                    </p>
                    <StarRating value={f.rating.avg} count={f.rating.count} size={13} />
                  </div>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ECOSYSTEM FEATURES */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <div className="max-w-xl mb-12">
          <div className="text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">What's inside</div>
          <h2 className="text-3xl font-serif text-green-950 font-bold mb-2">One ecosystem, every stage of harvest</h2>
          <p className="text-green-900/70 text-sm">From seed selection to buyer delivery — KrishiVardhan supports every step.</p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {[
            [Bot, "#1F4D36", "AI Farming Assistant", "Ask farming questions in plain language and get instant, practical advice."],
            [ScanLine, "#B23A2E", "Crop Disease Detection", "Upload a leaf photo and get a diagnosis with treatment suggestions."],
            [CloudSun, "#3D6E8E", "Weather Intelligence", "Live forecasts plus spray/irrigate/harvest advice for your location."],
            [Sprout, "#C6952E", "AI Crop Planner", "Tell us your season, soil and water — get optimal crop recommendations."],
            [Snowflake, "#8358B0", "Cold Storage Booking", "Reserve nearby storage space and drastically reduce post-harvest losses."],
            [Truck, "#4A5A4C", "Shared Transport Logistics", "Pool truck deliveries with nearby farmers to save costs."],
          ].map(([IconComponent, color, title, desc], i) => (
            <FadeIn key={title} delay={i * 70}>
              <div className="hover-lift bg-white border border-green-950/10 rounded-2xl p-6 shadow-sm">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: color + "1A", color }}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold mb-1.5 font-serif text-green-950">{title}</h3>
                <p className="text-xs text-green-900/70 leading-relaxed">{desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-green-950 text-white py-20">
        <div className="max-w-6xl mx-auto px-5">
          <div className="max-w-xl mb-12">
            <div className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">Impact Stories</div>
            <h2 className="text-3xl font-serif font-bold text-white">What growers &amp; buyers say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              ["Selling straight to customers meant I finally got a fair price for my tomatoes without commission cuts.", "Ramesh Patel, Farmer (Gujarat)"],
              ["The weather alerts told me exactly when to spray — saved my entire wheat crop this season.", "Gurpreet Singh, Farmer (Punjab)"],
              ["I love knowing exactly which village and farmer my vegetables came from. Unmatched fresh quality!", "Priya Sharma, Customer (Ahmedabad)"],
            ].map(([quote, who], i) => (
              <FadeIn key={who} delay={i * 90}>
                <div className="glass bg-white/10 rounded-2xl p-6 border border-white/15">
                  <p className="text-sm text-stone-100 leading-relaxed mb-4 font-serif">&ldquo;{quote}&rdquo;</p>
                  <p className="text-xs text-amber-300 font-semibold">— {who}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ value, prefix = "", suffix = "", label }) {
  const val = useCountUp(value, 1300);
  return (
    <div>
      <div className="font-serif text-3xl md:text-4xl font-bold text-green-800">
        {prefix}{val.toLocaleString("en-IN")}{suffix}
      </div>
      <div className="text-xs text-green-900/60 mt-1 font-medium">{label}</div>
    </div>
  );
}

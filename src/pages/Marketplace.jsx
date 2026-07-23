import React, { useState, useEffect, useCallback } from "react";
import { FadeIn } from "../components/Helpers";
import { ProductCard } from "../components/ProductCard";
import { slist, sget, getFarmerRating } from "../utils/storage";

export function Marketplace({ session, addToCart, go, wishlist, toggleWishlist, viewFarmer }) {
  const [products, setProducts] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [organicOnly, setOrganicOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  const load = useCallback(async () => {
    setLoading(true);
    const keys = await slist("product:");
    const items = [];
    for (const k of keys) {
      const p = await sget(k);
      if (p && p.status === "available") items.push(p);
    }
    setProducts(items);
    const uniqueFarmers = [...new Set(items.map((p) => p.farmerPhone))];
    const r = {};
    for (const phone of uniqueFarmers) r[phone] = await getFarmerRating(phone);
    setRatings(r);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = products
    .filter((p) => {
      const matchSearch = !search || (p.name + p.farmerName + (p.village || "")).toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || p.category === category;
      const matchOrganic = !organicOnly || p.organic;
      return matchSearch && matchCat && matchOrganic;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return b.createdAt - a.createdAt;
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });

  function handleAdd(p) {
    if (!session || session.role !== "customer") {
      go("auth");
      return;
    }
    addToCart(p);
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-green-950 mb-1">Marketplace</h2>
        <p className="text-green-900/60 text-sm">Fresh produce, straight from the farm. No middlemen. No markups.</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-green-950/10 rounded-2xl p-6 mb-7 shadow-sm">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-green-900/70 mb-1.5">🔍 Search</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tomato, wheat, organic..."
              className="input"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-green-900/70 mb-1.5">📦 Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
              {["All", "Vegetables", "Fruits", "Grains", "Pulses", "Spices", "Dairy"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-green-900/70 mb-1.5">↕ Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input">
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
        <label className="flex items-center gap-2.5 mt-4 text-sm font-medium text-green-950 cursor-pointer">
          <input
            type="checkbox"
            checked={organicOnly}
            onChange={(e) => setOrganicOnly(e.target.checked)}
            className="accent-green-800 w-4 h-4"
          />
          🌱 Show Organic Only
        </label>
      </div>

      <div className="text-sm text-green-900/60 mb-4 font-medium">
        {loading ? "Loading produce…" : `Showing ${filtered.length} product${filtered.length !== 1 ? "s" : ""}`}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-stone-200 rounded-2xl h-72" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-green-900/60">
          <div className="text-6xl mb-4">🌾</div>
          <div className="text-lg font-serif font-semibold mb-2">No products found</div>
          <div className="text-sm">Try adjusting your search or filters.</div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
          {filtered.map((p, i) => (
            <FadeIn key={p.id} delay={i * 40}>
              <ProductCard
                product={p}
                onAdd={handleAdd}
                rating={ratings[p.farmerPhone]}
                isWishlisted={wishlist?.includes(p.id)}
                onToggleWishlist={() => toggleWishlist(p)}
                onViewFarmer={() => viewFarmer(p.farmerPhone)}
              />
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}

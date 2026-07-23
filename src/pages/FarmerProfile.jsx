import React, { useState, useEffect } from "react";
import { Avatar, StarRating } from "../components/Helpers";
import { ProductCard } from "../components/ProductCard";
import { slist, sget, getFarmerRating } from "../utils/storage";

export function FarmerProfile({ phone, addToCart, session, go, wishlist, toggleWishlist }) {
  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [rating, setRating] = useState({ avg: 0, count: 0, reviews: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!phone) return;
    (async () => {
      const acc = await sget("account:" + phone);
      setFarmer(acc);
      const keys = await slist("product:");
      const mine = [];
      for (const k of keys) {
        const p = await sget(k);
        if (p && p.farmerPhone === phone && p.status === "available") mine.push(p);
      }
      setProducts(mine);
      setRating(await getFarmerRating(phone));
      setLoading(false);
    })();
  }, [phone]);

  function handleAdd(p) {
    if (!session || session.role !== "customer") { go("auth"); return; }
    addToCart(p);
  }

  if (loading) return <div className="max-w-4xl mx-auto px-5 py-16 text-center text-green-900/60 text-lg">Loading farmer profile…</div>;
  if (!farmer) return <div className="max-w-4xl mx-auto px-5 py-16 text-center text-green-900/60 text-lg">Farmer not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      {/* Profile Header */}
      <div className="bg-white border border-green-950/10 rounded-2xl p-7 mb-8 shadow-sm" style={{ animation: "fadeUp 0.3s ease" }}>
        <div className="flex flex-wrap items-center gap-6">
          <Avatar name={farmer.name} size={80} />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h2 className="text-2xl font-serif font-bold text-green-950">{farmer.name}</h2>
              <span className="text-[11px] bg-green-900 text-white px-2.5 py-1 rounded-full font-bold">✔ Verified Farmer</span>
            </div>
            <p className="text-green-900/70 text-sm">
              📍 {[farmer.village, farmer.district, farmer.state].filter(Boolean).join(", ")}
            </p>
            <div className="mt-2">
              <StarRating value={rating.avg} count={rating.count} size={15} />
            </div>
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-green-900/60 font-medium">
              {farmer.experience && <span>🌾 {farmer.experience} years farming experience</span>}
              {farmer.language && <span>🗣 {farmer.language}</span>}
              {farmer.joinedAt && <span>📅 Member since {new Date(farmer.joinedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long" })}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <h3 className="text-xl font-serif font-bold text-green-950 mb-4">Available Produce ({products.length})</h3>
      {products.length === 0 ? (
        <div className="text-center py-10 text-green-900/60 mb-8 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
          No active listings from this farmer right now.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 mb-12">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAdd={handleAdd}
              isWishlisted={wishlist?.includes(p.id)}
              onToggleWishlist={() => toggleWishlist(p)}
            />
          ))}
        </div>
      )}

      {/* Reviews */}
      <h3 className="text-xl font-serif font-bold text-green-950 mb-4">Customer Reviews ({rating.reviews.length})</h3>
      {rating.reviews.length === 0 ? (
        <div className="text-center py-10 text-green-900/60 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
          No reviews yet — be the first to buy and review!
        </div>
      ) : (
        <div className="space-y-4">
          {rating.reviews.slice(0, 8).map((r, i) => (
            <div key={i} className="bg-white border border-green-950/10 rounded-xl p-5 shadow-sm" style={{ animation: "fadeUp 0.2s ease" }}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <strong className="text-sm font-semibold text-green-950">{r.customerName}</strong>
                  <div className="text-xs text-green-900/50 font-medium">{new Date(r.createdAt).toLocaleDateString("en-IN")}</div>
                </div>
                <StarRating value={r.rating} showValue={false} size={14} />
              </div>
              {r.text && <p className="text-sm text-green-900/80 leading-relaxed">&ldquo;{r.text}&rdquo;</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

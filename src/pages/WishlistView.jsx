import React, { useState, useEffect } from "react";
import { FadeIn } from "../components/Helpers";
import { ProductCard } from "../components/ProductCard";
import { sget } from "../utils/storage";

export function WishlistView({ wishlist, toggleWishlist, addToCart, go, viewFarmer }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const items = [];
      for (const id of wishlist) {
        const p = await sget("product:" + id);
        if (p) items.push(p);
      }
      setProducts(items);
      setLoading(false);
    })();
  }, [wishlist]);

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <h2 className="text-3xl font-serif font-bold text-green-950 mb-1">My Wishlist</h2>
      <p className="text-green-900/60 text-sm mb-8">Products you've saved for later. {products.length > 0 && `${products.length} saved item${products.length !== 1 ? "s" : ""}.`}</p>

      {loading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="animate-pulse bg-stone-200 rounded-2xl h-72" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
          <div className="text-6xl mb-4">🤍</div>
          <div className="text-lg font-serif font-bold text-green-950 mb-2">No saved items yet</div>
          <p className="text-green-900/60 text-sm mb-6">Browse the marketplace and save your favourite produce!</p>
          <button onClick={() => go("marketplace")} className="btn-press bg-green-900 text-white px-7 py-3 rounded-xl font-semibold text-sm hover:bg-green-800 transition-colors shadow-md">
            Browse Marketplace
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((p, i) => (
            <FadeIn key={p.id} delay={i * 40}>
              <ProductCard
                product={p}
                onAdd={addToCart}
                isWishlisted={true}
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

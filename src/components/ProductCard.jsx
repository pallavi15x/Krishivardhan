import React, { useState } from "react";
import { StarRating } from "./Helpers";

export function ProductCard({ product, onAdd, onRemove, rating, isWishlisted, onToggleWishlist, onViewFarmer }) {
  const [showTrace, setShowTrace] = useState(false);

  return (
    <div className="hover-lift bg-white border border-green-950/10 rounded-2xl overflow-hidden relative flex flex-col justify-between">
      <div>
        <div className="h-32 bg-stone-100 flex items-center justify-center text-6xl relative select-none">
          {product.image || "🥬"}
          {onToggleWishlist && (
            <button
              onClick={onToggleWishlist}
              className="btn-press absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-sm shadow hover:scale-110 transition-transform"
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              {isWishlisted ? "❤️" : "🤍"}
            </button>
          )}
          {product.organic && (
            <span className="absolute bottom-2.5 left-2.5 text-[10px] bg-amber-500 text-green-950 px-2 py-0.5 rounded-full font-bold shadow-sm">
              🌱 Organic
            </span>
          )}
        </div>

        <div className="p-4">
          <h4 className="text-base font-semibold font-serif text-green-950 leading-snug">{product.name}</h4>
          
          <button
            onClick={onViewFarmer}
            className="text-xs text-green-800/80 hover:text-green-950 hover:underline text-left font-medium block mt-1"
          >
            by {product.farmerName} · {product.village || "Local Farm"}
          </button>

          {rating && rating.count > 0 && (
            <div className="mt-1">
              <StarRating value={rating.avg} count={rating.count} size={11} />
            </div>
          )}

          <button
            onClick={() => setShowTrace((v) => !v)}
            className="text-[11px] text-green-800/80 hover:text-green-950 font-semibold underline mt-2.5 block"
          >
            {showTrace ? "Hide traceability" : "🚚 Track origin & harvest"}
          </button>

          {showTrace && (
            <div className="text-[11px] bg-stone-50 rounded-xl p-2.5 mt-2 border border-stone-200 text-green-900/80 space-y-1" style={{ animation: "fadeUp 0.2s ease" }}>
              <div><strong>Farmer:</strong> {product.farmerName}</div>
              <div><strong>Village:</strong> {product.village || "Anand"}</div>
              <div><strong>Harvested / Listed:</strong> {new Date(product.createdAt).toLocaleDateString("en-IN")}</div>
              <div><strong>Batch ID:</strong> KV-FARM-{product.id.toUpperCase()}</div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 pt-0">
        <div className="flex items-center justify-between border-t border-stone-100 pt-3">
          <div>
            <span className="font-mono font-bold text-green-950 text-base">₹{product.price}</span>
            <span className="text-green-900/60 text-xs font-normal">/{product.unit}</span>
          </div>

          {onAdd && (
            <button
              onClick={() => onAdd(product)}
              className="btn-press bg-green-900 text-white text-xs px-3.5 py-2 rounded-xl font-semibold hover:bg-green-800 transition-colors shadow-sm"
            >
              Add to Cart
            </button>
          )}

          {onRemove && (
            <button
              onClick={() => onRemove(product.id)}
              className="btn-press bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

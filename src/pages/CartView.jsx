import React, { useState } from "react";
import { sset } from "../utils/storage";

export function CartView({ cart, setCart, session, go, showToast }) {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [payMode, setPayMode] = useState("cod");

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  function updateQty(productId, delta) {
    setCart((prev) =>
      prev
        .map((c) => (c.productId === productId ? { ...c, qty: Math.max(0, c.qty + delta) } : c))
        .filter((c) => c.qty > 0)
    );
  }

  function removeItem(productId) {
    setCart((prev) => prev.filter((c) => c.productId !== productId));
  }

  async function placeOrder() {
    if (!session) { go("auth"); return; }
    if (!address.trim()) { showToast("Please enter a delivery address."); return; }
    setLoading(true);
    const orderId = "ORD-" + Date.now().toString(36).toUpperCase();
    const order = {
      id: orderId,
      customerPhone: session.phone,
      customerName: session.name,
      items: cart.map((c) => ({
        productId: c.productId,
        name: c.name,
        price: c.price,
        unit: c.unit,
        qty: c.qty,
        farmerName: c.farmerName,
        farmerPhone: c.farmerPhone,
      })),
      total,
      address,
      payMode,
      status: "placed",
      createdAt: Date.now(),
    };
    await sset("order:" + orderId, order);
    setCart([]);
    setLoading(false);
    showToast(`Order ${orderId} placed successfully! 🎉`);
    go("my-orders");
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-20 text-center">
        <div className="text-7xl mb-5">🛒</div>
        <h2 className="text-2xl font-serif font-bold text-green-950 mb-2">Your cart is empty</h2>
        <p className="text-green-900/60 text-sm mb-8">Browse fresh produce from our farmers and fill your cart!</p>
        <button onClick={() => go("marketplace")} className="btn-press bg-green-900 text-white px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-green-800 transition-colors shadow-md">
          Browse Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <h2 className="text-3xl font-serif font-bold text-green-950 mb-1">Your Cart</h2>
      <p className="text-green-900/60 text-sm mb-8">{itemCount} item{itemCount !== 1 ? "s" : ""} · ₹{total.toLocaleString("en-IN")} total</p>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.productId} className="bg-white border border-green-950/10 rounded-2xl p-5 flex items-center gap-5 shadow-sm" style={{ animation: "fadeUp 0.2s ease" }}>
              <div className="text-4xl w-14 h-14 bg-stone-100 rounded-xl flex items-center justify-center shrink-0">
                {item.image || "🥬"}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm font-serif text-green-950">{item.name}</h4>
                <p className="text-xs text-green-900/60 mt-0.5">by {item.farmerName}</p>
                <p className="font-mono font-bold text-green-900 text-sm mt-1">₹{item.price}/{item.unit}</p>
              </div>
              <div className="flex items-center gap-2.5">
                <button onClick={() => updateQty(item.productId, -1)} className="btn-press w-8 h-8 rounded-lg bg-stone-200 flex items-center justify-center font-bold text-lg hover:bg-stone-300 transition-colors">−</button>
                <span className="font-mono font-bold text-base w-6 text-center">{item.qty}</span>
                <button onClick={() => updateQty(item.productId, 1)} className="btn-press w-8 h-8 rounded-lg bg-green-900 text-white flex items-center justify-center font-bold text-lg hover:bg-green-800 transition-colors">+</button>
              </div>
              <div className="text-right min-w-[70px]">
                <div className="font-mono font-bold text-green-950">₹{(item.price * item.qty).toLocaleString("en-IN")}</div>
                <button onClick={() => removeItem(item.productId)} className="text-xs text-red-500 hover:text-red-700 mt-1 font-medium">Remove</button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <div className="bg-white border border-green-950/10 rounded-2xl p-6 shadow-sm">
            <h3 className="font-serif font-bold text-lg text-green-950 mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4 text-sm">
              {cart.map((item) => (
                <div key={item.productId} className="flex justify-between text-green-900/80">
                  <span className="truncate mr-2">{item.name} ×{item.qty}</span>
                  <span className="font-mono font-semibold shrink-0">₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
                </div>
              ))}
              <div className="border-t border-stone-200 pt-3 flex justify-between font-bold text-green-950">
                <span>Total</span>
                <span className="font-mono text-lg">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-green-900/70 mb-1.5">📍 Delivery Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="input resize-none"
                placeholder="Enter your full delivery address..."
              />
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold text-green-900/70 mb-2">💳 Payment Method</label>
              <div className="flex gap-2">
                {[["cod", "💵 Cash on Delivery"], ["upi", "📱 UPI"]].map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setPayMode(val)}
                    className={`flex-1 text-xs py-2 rounded-lg font-semibold border-2 transition-colors ${
                      payMode === val ? "border-green-800 bg-green-50 text-green-900" : "border-stone-200 text-green-900/60 hover:border-green-800/30"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={placeOrder}
              disabled={loading}
              className="btn-press w-full bg-green-900 text-white rounded-xl py-3.5 font-semibold text-sm hover:bg-green-800 transition-colors shadow-md"
            >
              {loading ? "Placing Order…" : "✅ Place Order"}
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
            <strong>🌾 Direct from farm!</strong> Your order goes straight to the farmer — no middlemen, fresh & fair-priced.
          </div>
        </div>
      </div>
    </div>
  );
}

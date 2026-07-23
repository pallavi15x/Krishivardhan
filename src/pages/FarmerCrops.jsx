import React, { useState, useEffect } from "react";
import { slist, sget, sset, sdelete } from "../utils/storage";

const CATEGORIES = ["Vegetables", "Fruits", "Grains", "Pulses", "Spices", "Dairy"];
const UNITS = ["kg", "quintal", "ton", "piece", "dozen", "litre"];
const IMAGES = ["🍅", "🌾", "🥔", "🧅", "🌽", "🥦", "🫑", "🍆", "🥕", "🍋", "🍌", "🍇", "🫘", "🌿", "🧈", "🥛"];

export function FarmerCrops({ session, go, showToast }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Vegetables");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("kg");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState("🥬");
  const [organic, setOrganic] = useState(false);
  const [saving, setSaving] = useState(false);

  async function loadProducts() {
    if (!session) return;
    const keys = await slist("product:");
    const list = [];
    for (const k of keys) {
      const p = await sget(k);
      if (p && p.farmerPhone === session.phone) list.push(p);
    }
    list.sort((a, b) => b.createdAt - a.createdAt);
    setProducts(list);
    setLoading(false);
  }

  useEffect(() => { loadProducts(); }, [session]);

  function openNew() {
    setEditProduct(null);
    setName(""); setCategory("Vegetables"); setPrice(""); setUnit("kg");
    setQuantity(""); setImage("🥬"); setOrganic(false);
    setShowForm(true);
  }

  function openEdit(p) {
    setEditProduct(p);
    setName(p.name); setCategory(p.category); setPrice(p.price); setUnit(p.unit);
    setQuantity(p.quantity); setImage(p.image || "🥬"); setOrganic(p.organic || false);
    setShowForm(true);
  }

  async function save() {
    if (!name.trim() || !price || !quantity) { showToast("Please fill in all required fields."); return; }
    setSaving(true);
    const id = editProduct ? editProduct.id : "p" + Date.now().toString(36);
    const product = {
      id, name, category, price: parseFloat(price), unit, quantity: parseFloat(quantity), image, organic,
      farmerName: session.name, farmerPhone: session.phone, village: session.village,
      status: "available", createdAt: editProduct ? editProduct.createdAt : Date.now(), updatedAt: Date.now(),
    };
    await sset("product:" + id, product);
    setSaving(false);
    setShowForm(false);
    showToast(editProduct ? "Listing updated!" : "New listing created! 🌾");
    loadProducts();
  }

  async function toggleStatus(p) {
    const updated = { ...p, status: p.status === "available" ? "sold" : "available" };
    await sset("product:" + p.id, updated);
    showToast(`Listing marked as ${updated.status}`);
    loadProducts();
  }

  async function deleteProduct(p) {
    await sdelete("product:" + p.id);
    showToast("Listing removed.");
    loadProducts();
  }

  if (!session) return <div className="max-w-4xl mx-auto px-5 py-16 text-center text-green-900/60">Please log in as a farmer.</div>;

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-green-950">My Crop Listings</h2>
          <p className="text-green-900/60 text-sm mt-1">Manage your produce available for customers to buy.</p>
        </div>
        <button onClick={openNew} className="btn-press bg-green-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-800 transition-colors shadow-sm flex items-center gap-2">
          <span>+</span> Add New Listing
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-green-950/10 rounded-2xl p-7 mb-7 shadow-md" style={{ animation: "fadeUp 0.25s ease" }}>
          <h3 className="font-serif font-bold text-lg text-green-950 mb-5">{editProduct ? "Edit Listing" : "New Crop Listing"}</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-green-900/70 mb-1.5">Crop Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="e.g. Organic Red Tomatoes" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-green-900/70 mb-1.5">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-green-900/70 mb-1.5">Price (₹) *</label>
              <input type="number" min="1" value={price} onChange={(e) => setPrice(e.target.value)} className="input" placeholder="Price per unit" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-green-900/70 mb-1.5">Unit</label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)} className="input">
                {UNITS.map((u) => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-green-900/70 mb-1.5">Available Quantity *</label>
              <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="input" placeholder="How much is available?" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-green-900/70 mb-1.5">Emoji Icon</label>
              <div className="flex flex-wrap gap-2 p-3 bg-stone-50 border border-stone-200 rounded-xl max-h-28 overflow-y-auto">
                {IMAGES.map((img) => (
                  <button key={img} onClick={() => setImage(img)} className={`text-2xl p-1.5 rounded-lg transition-colors ${image === img ? "bg-green-100 ring-2 ring-green-700" : "hover:bg-stone-200"}`}>
                    {img}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <label className="flex items-center gap-2.5 mb-5 cursor-pointer text-sm font-medium">
            <input type="checkbox" checked={organic} onChange={(e) => setOrganic(e.target.checked)} className="accent-green-800 w-4 h-4" />
            🌱 This is an Organic product
          </label>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="btn-press bg-green-900 text-white px-7 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-800 transition-colors">
              {saving ? "Saving…" : editProduct ? "Update Listing" : "Create Listing"}
            </button>
            <button onClick={() => setShowForm(false)} className="text-sm text-green-900/60 hover:text-green-900 px-4 py-2.5 rounded-xl hover:bg-stone-100 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Products */}
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="animate-pulse bg-stone-200 rounded-xl h-20" />)}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
          <div className="text-5xl mb-3">🌾</div>
          <div className="font-serif font-bold text-green-950 mb-2">No listings yet</div>
          <p className="text-sm text-green-900/60">Add your first crop to start selling direct to customers!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p.id} className="bg-white border border-green-950/10 rounded-2xl p-5 flex items-center gap-5 shadow-sm" style={{ animation: "fadeUp 0.2s ease" }}>
              <div className="text-4xl w-14 h-14 bg-stone-100 rounded-xl flex items-center justify-center shrink-0">{p.image || "🥬"}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-serif font-semibold text-green-950">{p.name}</h4>
                  {p.organic && <span className="text-[10px] bg-amber-500 text-green-950 px-2 py-0.5 rounded-full font-bold">Organic</span>}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${p.status === "available" ? "bg-green-100 text-green-800" : "bg-stone-200 text-stone-600"}`}>
                    {p.status}
                  </span>
                </div>
                <div className="text-xs text-green-900/60 mt-0.5">
                  {p.category} · ₹{p.price}/{p.unit} · Qty: {p.quantity} {p.unit}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(p)} className="text-xs px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 font-semibold transition-colors">Edit</button>
                <button onClick={() => toggleStatus(p)} className="text-xs px-3 py-1.5 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 font-semibold transition-colors">
                  {p.status === "available" ? "Mark Sold" : "Relist"}
                </button>
                <button onClick={() => deleteProduct(p)} className="text-xs px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 font-semibold transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

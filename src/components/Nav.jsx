import React, { useState } from "react";
import { NotificationBell } from "./NotificationBell";
import { 
  Sprout, 
  Heart, 
  ShoppingCart, 
  User, 
  Snowflake, 
  Truck, 
  Users, 
  MessageSquare, 
  Landmark,
  ChevronDown
} from "lucide-react";

export function Nav({ view, go, session, logout, cart, wishlist }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const primary = [
    ["marketplace", "Marketplace"],
    ["weather", "Weather Intelligence"],
    ["assistant", "AI Assistant"],
    ["disease", "Disease Check"],
  ];
  const more = [
    ["crop-planner", "AI Crop Planner", Sprout],
    ["cold-storage", "Cold Storage", Snowflake],
    ["transport", "Shared Transport", Truck],
    ["community", "Community Forum", Users],
    ["queries", "Support Queries", MessageSquare],
    ["schemes", "Govt Schemes", Landmark],
  ];

  return (
    <nav className="sticky top-0 z-40 bg-stone-50/90 backdrop-blur border-b border-green-950/10">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-3">
        <button onClick={() => go("home")} className="flex items-center gap-2 font-bold text-lg font-serif group">
          <Sprout className="w-6 h-6 text-green-700 group-hover:scale-110 transition-transform" />
          <span className="text-green-950 tracking-tight">KrishiVardhan</span>
        </button>

        <div className="hidden md:flex items-center gap-1 text-sm relative">
          {primary.map(([id, label]) => (
            <button
              key={id}
              onClick={() => go(id)}
              className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                view === id ? "bg-green-900 text-white shadow-sm" : "text-green-800/80 hover:bg-stone-200"
              }`}
            >
              {label}
            </button>
          ))}
          <div className="relative">
            <button
              onClick={() => setMoreOpen((v) => !v)}
              className={`px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                more.some(([id]) => id === view) ? "bg-green-900 text-white shadow-sm" : "text-green-800/80 hover:bg-stone-200"
              }`}
            >
              <span>More</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {moreOpen && (
              <div
                className="absolute top-11 left-0 bg-white border border-green-950/10 rounded-xl shadow-xl py-2 w-56 z-50"
                style={{ animation: "fadeUp 0.15s ease" }}
                onMouseLeave={() => setMoreOpen(false)}
              >
                {more.map(([id, label, IconComponent]) => (
                  <button
                    key={id}
                    onClick={() => {
                      go(id);
                      setMoreOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-stone-100 text-green-950 font-medium transition-colors flex items-center gap-2.5"
                  >
                    <IconComponent className="w-4 h-4 text-green-800" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {session?.role === "customer" && (
            <button
              onClick={() => go("wishlist")}
              className="relative p-2.5 rounded-lg hover:bg-stone-200 text-sm transition-colors flex items-center justify-center"
              title="Wishlist"
            >
              <Heart className="w-5 h-5 text-red-600 fill-red-600" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-green-950 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow">
                  {wishlist.length}
                </span>
              )}
            </button>
          )}

          {session?.role === "customer" && (
            <button
              onClick={() => go("cart")}
              className="relative p-2.5 rounded-lg hover:bg-stone-200 text-sm transition-colors flex items-center justify-center"
              title="Cart"
            >
              <ShoppingCart className="w-5 h-5 text-green-900" />
              {cart.length > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-amber-500 text-green-950 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow"
                  style={{ animation: "popIn 0.2s ease" }}
                >
                  {cart.length}
                </span>
              )}
            </button>
          )}

          <NotificationBell session={session} />

          {session ? (
            <div className="flex items-center gap-1 pl-2 border-l border-green-950/10">
              <button
                onClick={() => go(session.role === "farmer" ? "farmer-dashboard" : "my-orders")}
                className="text-sm font-semibold px-3 py-2 rounded-lg hover:bg-stone-200 text-green-900 flex items-center gap-1.5"
              >
                <User className="w-4 h-4 text-green-800" />
                <span>{session.role === "farmer" ? "My Farm" : "My Orders"}</span>
              </button>
              <button
                onClick={logout}
                className="text-xs font-semibold px-3 py-2 rounded-lg hover:bg-stone-200 text-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => go("auth")}
              className="btn-press text-xs px-4 py-2.5 rounded-lg bg-green-900 text-white font-semibold hover:bg-green-800 transition-colors shadow-sm"
            >
              Login / Sign Up
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

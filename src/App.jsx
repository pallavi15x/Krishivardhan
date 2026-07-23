import React, { useState, useEffect } from "react";
import { PageWrap, Toast } from "./components/Helpers";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Auth } from "./pages/Auth";
import { Marketplace } from "./pages/Marketplace";
import { CartView } from "./pages/CartView";
import { MyOrders } from "./pages/MyOrders";
import { WishlistView } from "./pages/WishlistView";
import { FarmerProfile } from "./pages/FarmerProfile";
import { FarmerDashboard } from "./pages/FarmerDashboard";
import { FarmerCrops } from "./pages/FarmerCrops";
import { FarmerOrders } from "./pages/FarmerOrders";
import { FarmerEarnings } from "./pages/FarmerEarnings";
import { Assistant } from "./pages/Assistant";
import { Disease } from "./pages/Disease";
import { Weather } from "./pages/Weather";
import { Schemes } from "./pages/Schemes";
import { CropPlanner } from "./pages/CropPlanner";
import { ColdStorage } from "./pages/ColdStorage";
import { Transport } from "./pages/Transport";
import { Queries } from "./pages/Queries";
import { Community } from "./pages/Community";
import { sget, sset, initSeedData } from "./utils/storage";

export default function App() {
  const [view, setView] = useState("home");
  const [session, setSession] = useState(null);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [authRole, setAuthRole] = useState("farmer");
  const [authMode, setAuthMode] = useState("login");
  const [wishlist, setWishlist] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  // Boot: initialize storage polyfill + seed data
  useEffect(() => {
    initSeedData();
  }, []);

  const showToast = (msg) => setToast(msg);
  const go = (v) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const viewFarmer = (phone) => {
    setSelectedFarmer(phone);
    go("farmer-profile");
  };
  const logout = () => {
    setSession(null);
    setCart([]);
    setWishlist([]);
    showToast("Logged out successfully 👋");
    go("home");
  };

  useEffect(() => {
    if (session?.role === "customer") {
      sget("wishlist:" + session.phone).then((w) => setWishlist(w || []));
    }
  }, [session]);

  async function toggleWishlist(product) {
    if (!session || session.role !== "customer") {
      go("auth");
      return;
    }
    const exists = wishlist.includes(product.id);
    const next = exists ? wishlist.filter((id) => id !== product.id) : [...wishlist, product.id];
    setWishlist(next);
    await sset("wishlist:" + session.phone, next);
    showToast(exists ? "Removed from wishlist" : "Saved to wishlist ❤️");
  }

  const addToCart = (p) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === p.id);
      if (existing) {
        return prev.map((c) =>
          c.productId === p.id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [
        ...prev,
        {
          productId: p.id,
          name: p.name,
          price: p.price,
          unit: p.unit,
          image: p.image,
          farmerName: p.farmerName,
          farmerPhone: p.farmerPhone,
          qty: 1,
        },
      ];
    });
    showToast(p.name + " added to cart 🛒");
  };

  const sharedProps = { go, showToast, session };

  return (
    <div className="min-h-screen bg-stone-50 text-green-950 font-sans">
      <Nav
        view={view}
        go={go}
        session={session}
        logout={logout}
        cart={cart}
        wishlist={wishlist}
      />

      <PageWrap viewKey={view + (selectedFarmer || "")}>
        {view === "home" && <Home go={go} setAuthRole={setAuthRole} viewFarmer={viewFarmer} />}
        {view === "auth" && (
          <Auth
            authRole={authRole}
            setAuthRole={setAuthRole}
            authMode={authMode}
            setAuthMode={setAuthMode}
            setSession={setSession}
            go={go}
            showToast={showToast}
          />
        )}
        {view === "marketplace" && (
          <Marketplace
            session={session}
            addToCart={addToCart}
            go={go}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            viewFarmer={viewFarmer}
          />
        )}
        {view === "cart" && (
          <CartView cart={cart} setCart={setCart} session={session} go={go} showToast={showToast} />
        )}
        {view === "my-orders" && <MyOrders session={session} go={go} showToast={showToast} />}
        {view === "wishlist" && (
          <WishlistView
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            addToCart={addToCart}
            go={go}
            viewFarmer={viewFarmer}
          />
        )}
        {view === "farmer-profile" && (
          <FarmerProfile
            phone={selectedFarmer}
            addToCart={addToCart}
            session={session}
            go={go}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
          />
        )}
        {view === "farmer-dashboard" && <FarmerDashboard session={session} go={go} />}
        {view === "farmer-crops" && <FarmerCrops session={session} go={go} showToast={showToast} />}
        {view === "farmer-orders" && <FarmerOrders session={session} go={go} showToast={showToast} />}
        {view === "farmer-earnings" && <FarmerEarnings session={session} go={go} />}
        {view === "assistant" && <Assistant />}
        {view === "disease" && <Disease />}
        {view === "weather" && <Weather />}
        {view === "schemes" && <Schemes />}
        {view === "crop-planner" && <CropPlanner session={session} go={go} />}
        {view === "cold-storage" && <ColdStorage session={session} go={go} showToast={showToast} />}
        {view === "transport" && <Transport session={session} go={go} showToast={showToast} />}
        {view === "queries" && <Queries session={session} />}
        {view === "community" && <Community session={session} />}
      </PageWrap>

      <Footer />

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}

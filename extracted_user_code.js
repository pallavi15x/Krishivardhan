<USER_REQUEST>
create files and folders 
put this code in sequence and correctly
import React, { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

/* ---------------- STORAGE HELPERS ---------------- */
async function sset(key, value, shared = true) {
  try { return await window.storage.set(key, JSON.stringify(value), shared); }
  catch (e) { console.error("storage set failed", e); return null; }
}
async function sget(key, shared = true) {
  try { const r = await window.storage.get(key, shared); return r ? JSON.parse(r.value) : null; }
  catch (e) { return null; }
}
async function sdelete(key, shared = true) {
  try { return await window.storage.delete(key, shared); } catch (e) { return null; }
}
async function slist(prefix, shared = true) {
  try { const r = await window.storage.list(prefix, shared); return r ? r.keys : []; } catch (e) { return []; }
}

/* ---------------- ANIMATION HELPERS ---------------- */
function FadeIn({ children, delay = 0, className = "" }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div className={className} style={{ opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(14px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>
      {children}
    </div>
  );
}
function useCountUp(target, duration = 1200, active = true) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null, raf;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, active]);
  return val;
}
function PageWrap({ viewKey, children }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(false); const t = setTimeout(() => setVisible(true), 20); return () => clearTimeout(t); }, [viewKey]);
  return <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)", transition: "opacity 0.35s ease, transform 0.35s ease" }}>{children}</div>;
}
function Toast({ message, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2600); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="fixed bottom-6 right-6 bg-green-950 text-white px-5 py-3 rounded-xl shadow-2xl z-50 text-sm" style={{ animation: "slidein 0.25s ease" }}>
      {message}
      <style>{`@keyframes slidein{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );
}

/* ---------------- 3D HERO (raw three.js) ---------------- */
function Hero3D() {
  const mountRef = useRef(null);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const width = mount.clientWidth || 400, height = mount.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.5);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.65));
    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(3, 4, 5);
    scene.add(dir);
    const point = new THREE.PointLight(0xc6952e, 0.7);
    point.position.set(-4, -2, -3);
    scene.add(point);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.3, 1),
      new THREE.MeshStandardMaterial({ color: 0x1f4d36, metalness: 0.35, roughness: 0.4 })
    );
    scene.add(core);

    const wire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.3 * 1.18, 1),
      new THREE.MeshBasicMaterial({ color: 0xc6952e, wireframe: true, transparent: true, opacity: 0.5 })
    );
    scene.add(wire);

    const orbit1 = new THREE.Group(); scene.add(orbit1);
    const sat1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0xc6952e, emissive: 0xc6952e, emissiveIntensity: 0.35 })
    );
    sat1.position.set(2.4, 0.4, 0);
    orbit1.add(sat1);

    const orbit2 = new THREE.Group(); scene.add(orbit2);
    const sat2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0x3d6e8e, emissive: 0x3d6e8e, emissiveIntensity: 0.35 })
    );
    sat2.position.set(0, 0, 2.1);
    orbit2.add(sat2);

    const count = 70;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6.5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6.5;
    }
    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(particlesGeo, new THREE.PointsMaterial({ color: 0xe7c878, size: 0.045, transparent: true, opacity: 0.85 }));
    scene.add(particles);

    let raf;
    let floatT = 0;
    const animate = () => {
      floatT += 0.01;
      core.rotation.y += 0.004;
      core.position.y = Math.sin(floatT) * 0.1;
      wire.rotation.y -= 0.0025;
      wire.position.y = core.position.y;
      orbit1.rotation.y += 0.012;
      orbit2.rotation.x += 0.008;
      particles.rotation.y += 0.0007;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    function handleResize() {
      const w = mount.clientWidth || 400, h = mount.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);
  return <div ref={mountRef} style={{ width: "100%", height: "100%", minHeight: 320 }} />;
}

/* ---------------- VISUAL HELPERS ---------------- */
const AVATAR_GRADIENTS = [
  ["#1F4D36", "#3D8A5F"], ["#C6952E", "#E7C878"], ["#3D6E8E", "#6FA8C7"],
  ["#8358B0", "#B08FD6"], ["#B23A2E", "#D9695D"], ["#4A5A4C", "#7A8F7C"],
];
function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
function Avatar({ name, size = 44 }) {
  const initials = (name || "?").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const [c1, c2] = AVATAR_GRADIENTS[hashStr(name || "x") % AVATAR_GRADIENTS.length];
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg, ${c1}, ${c2})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: size * 0.38, flexShrink: 0 }}>
      {initials}
    </div>
  );
}
function StarRating({ value, size = 14, showValue = true, count }) {
  const full = Math.round(value);
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => <span key={i} style={{ fontSize: size, color: i <= full ? "#C6952E" : "#D8D2C4" }}>★</span>)}
      {showValue && value > 0 && <span className="text-xs text-green-900/60 ml-1">{value.toFixed(1)}{count != null ? ` (${count})` : ""}</span>}
    </span>
  );
}
function StarInput({ value, onChange }) {
  return (
    <span className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => <button key={i} type="button" onClick={() => onChange(i)} style={{ fontSize: 22, color: i <= value ? "#C6952E" : "#D8D2C4", lineHeight: 1 }} className="btn-press">★</button>)}
    </span>
  );
}
function Blob({ className, color }) {
  return <div className={`absolute rounded-full pointer-events-none ${className}`} style={{ background: color, filter: "blur(50px)", opacity: 0.35 }} />;
}
async function getFarmerRating(farmerPhone) {
  const keys = await slist("review:");
  let total = 0, count = 0;
  const list = [];
  for (const k of keys) { const r = await sget(k); if (r && r.farmerPhone === farmerPhone) { total += r.rating; count++; list.push(r); } }
  list.sort((a, b) => b.createdAt - a.createdAt);
  return { avg: count ? total / count : 0, count, reviews: list };
}

/* ---------------- NOTIFICATIONS ---------------- */
function NotificationBell({ session }) {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    async function load() {
      const keys = await slist("order:");
      const list = [];
      for (const k of keys) {
        const o = await sget(k); if (!o) continue;
        if (session.role === "farmer") {
          const mine = o.items.some((it) => it.farmerPhone === session.phone);
          if (mine && o.status === "placed") list.push({ id: o.id, text: `New order ${o.id} from ${o.customerName}`, time: o.createdAt });
        } else {
          if (o.customerPhone === session.phone && o.status !== "placed") list.push({ id: o.id, text: `Order ${o.id} is now ${o.status}`, time: o.createdAt });
        }
      }
      list.sort((a, b) => b.time - a.time);
      if (!cancelled) setNotifs(list.slice(0, 8));
    }
    load();
    const interval = setInterval(load, 15000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [session]);
  if (!session) return null;
  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className="relative p-2 rounded-lg hover:bg-stone-200 text-sm">
        🔔{notifs.length > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{notifs.length}</span>}
      </button>
      {open && (
        <div className="absolute right-0 top-11 w-72 bg-white border border-green-950/10 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto" onMouseLeave={() => setOpen(false)} style={{ animation: "fadeUp 0.15s ease" }}>
          <div className="p-3 border-b border-green-950/10 font-semibold text-sm">Notifications</div>
          {notifs.length === 0 ? <div className="p-4 text-xs text-green-900/60 text-center">Nothing new right now.</div> : notifs.map((n) => (
            <div key={n.id} className="p-3 border-b border-green-950/5 last:border-0 text-xs">
              <div>{n.text}</div>
              <div className="text-green-900/60 mt-1">{new Date(n.time).toLocaleString("en-IN")}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- MAIN APP ---------------- */
export default function App() {
  const [view, setView] = useState("home");
  const [session, setSession] = useState(null);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [authRole, setAuthRole] = useState("farmer");
  const [authMode, setAuthMode] = useState("login");
  const [wishlist, setWishlist] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  const showToast = (msg) => setToast(msg);
  const go = (v) => { setView(v); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const viewFarmer = (phone) => { setSelectedFarmer(phone); go("farmer-profile"); };
  const logout = () => { setSession(null); setCart([]); setWishlist([]); showToast("Logged out"); go("home"); };

  useEffect(() => {
    if (session?.role === "customer") sget("wishlist:" + session.phone).then((w) => setWishlist(w || []));
  }, [session]);

  async function toggleWishlist(product) {
    if (!session || session.role !== "customer") { go("auth"); return; }
    const exists = wishlist.includes(product.id);
    const next = exists ? wishlist.filter((id) => id !== product.id) : [...wishlist, product.id];
    setWishlist(next);
    await sset("wishlist:" + session.phone, next);
    showToast(exists ? "Removed from wishlist" : "Saved to wishlist ❤️");
  }

  const addToCart = (p) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === p.id);
      if (existing) return prev.map((c) => c.productId === p.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { productId: p.id, name: p.name, price: p.price, unit: p.unit, farmerName: p.farmerName, farmerPhone: p.farmerPhone, qty: 1 }];
    });
    showToast(p.name + " added to cart");
  };

  return (
    <div className="min-h-screen bg-stone-50 text-green-950 font-sans">
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px);} to {opacity:1; transform:translateY(0);} }
        @keyframes popIn { from { opacity:0; transform:scale(0.9);} to {opacity:1; transform:scale(1);} }
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        @keyframes floaty { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)} }
        .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 14px 30px rgba(20,40,20,0.12); }
        .btn-press:active { transform: scale(0.96); }
        .input{border:1px solid rgba(20,40,20,0.15);border-radius:10px;padding:10px 12px;font-size:14px;width:100%;background:white;}
        .glass { background: rgba(255,255,255,0.7); backdrop-filter: blur(10px); }
      `}</style>

      <Nav view={view} go={go} session={session} logout={logout} cart={cart} wishlist={wishlist} />

      <PageWrap viewKey={view + (selectedFarmer || "")}>
        {view === "home" && <Home go={go} setAuthRole={setAuthRole} viewFarmer={viewFarmer} />}
        {view === "auth" && <Auth authRole={authRole} setAuthRole={setAuthRole} authMode={authMode} setAuthMode={setAuthMode} setSession={setSession} go={go} showToast={showToast} />}
        {view === "marketplace" && <Marketplace session={session} addToCart={addToCart} go={go} wishlist={wishlist} toggleWishlist={toggleWishlist} viewFarmer={viewFarmer} />}
        {view === "cart" && <CartView cart={cart} setCart={setCart} session={session} go={go} showToast={showToast} />}
        {view === "my-orders" && <MyOrders session={session} go={go} showToast={showToast} />}
        {view === "wishlist" && <WishlistView wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} go={go} viewFarmer={viewFarmer} />}
        {view === "farmer-profile" && <FarmerProfile phone={selectedFarmer} addToCart={addToCart} session={session} go={go} wishlist={wishlist} toggleWishlist={toggleWishlist} />}
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

/* ---------------- NAV ---------------- */
function Nav({ view, go, session, logout, cart, wishlist }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const primary = [["marketplace", "Marketplace"], ["weather", "Weather"], ["assistant", "AI Assistant"], ["disease", "Disease Check"]];
  const more = [["crop-planner", "🌱 Crop Planner"], ["cold-storage", "❄️ Cold Storage"], ["transport", "🚚 Transport"], ["community", "🧑🌾 Community"], ["queries", "💬 Support Queries"], ["schemes", "🏦 Schemes"]];
  return (
    <nav className="sticky top-0 z-40 bg-stone-50/90 backdrop-blur border-b border-green-950/10">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-3">
        <button onClick={() => go("home")} className="flex items-center gap-2 font-bold text-lg font-serif">
          <span style={{ display: "inline-block", animation: "popIn 0.5s ease" }}>🌾</span> KrishiVardhan
        </button>
        <div className="hidden md:flex items-center gap-1 text-sm relative">
          {primary.map(([id, label]) => (
            <button key={id} onClick={() => go(id)} className={`px-3 py-2 rounded-lg font-medium transition-colors ${view === id ? "bg-green-900 text-white" : "text-green-800/70 hover:bg-stone-200"}`}>{label}</button>
          ))}
          <div className="relative">
            <button onClick={() => setMoreOpen((v) => !v)} className={`px-3 py-2 rounded-lg font-medium transition-colors ${more.some(([id]) => id === view) ? "bg-green-900 text-white" : "text-green-800/70 hover:bg-stone-200"}`}>More ▾</button>
            {moreOpen && (
              <div className="absolute top-11 left-0 bg-white border border-green-950/10 rounded-xl shadow-xl py-2 w-52 z-50" style={{ animation: "fadeUp 0.15s ease" }} onMouseLeave={() => setMoreOpen(false)}>
                {more.map(([id, label]) => <button key={id} onClick={() => { go(id); setMoreOpen(false); }} className="block w-full text-left px-4 py-2 text-sm hover:bg-stone-100">{label}</button>)}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {session?.role === "customer" && (
            <button onClick={() => go("wishlist")} className="relative px-2 py-2 rounded-lg hover:bg-stone-200 text-sm">
              ❤️{wishlist.length > 0 && <span className="absolute -top-1 -right-1 bg-amber-500 text-green-950 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{wishlist.length}</span>}
            </button>
          )}
          {session?.role === "customer" && (
            <button onClick={() => go("cart")} className="relative px-2 py-2 rounded-lg hover:bg-stone-200 text-sm">
              🛒{cart.length > 0 && <span className="absolute -top-1 -right-1 bg-amber-500 text-green-950 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center" style={{ animation: "popIn 0.2s ease" }}>{cart.length}</span>}
            </button>
          )}
          <NotificationBell session={session} />
          {session ? (
            <>
              <button onClick={() => go(session.role === "farmer" ? "farmer-dashboard" : "my-orders")} className="text-sm font-medium px-3 py-2 rounded-lg hover:bg-stone-200">{session.role === "farmer" ? "My Farm" : "My Orders"}</button>
              <button onClick={logout} className="text-sm font-medium px-3 py-2 rounded-lg hover:bg-stone-200 text-green-800/70">Logout</button>
            </>
          ) : (
            <button onClick={() => go("auth")} className="btn-press text-xs px-4 py-2 rounded-lg bg-green-900 text-white font-semibold">Login / Sign Up</button>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ---------------- HOME ---------------- */
function Home({ go, setAuthRole, viewFarmer }) {
  const [farmers, setFarmers] = useState([]);
  const [loadingFarmers, setLoadingFarmers] = useState(true);

  useEffect(() => {
    (async () => {
      const keys = await slist("account:");
      const list = [];
      for (const k of keys) { const a = await sget(k); if (a && a.role === "farmer") list.push(a); }
      const withRatings = await Promise.all(list.slice(0, 4).map(async (f) => ({ ...f, rating: await getFarmerRating(f.phone) })));
      setFarmers(withRatings);
      setLoadingFarmers(false);
    })();
  }, []);

  return (
    <div className="overflow-hidden">
      <section className="relative bg-gradient-to-b from-stone-50 to-stone-200 border-b border-green-950/10 pt-14 pb-8">
        <Blob className="w-80 h-80 -top-10 -right-20" color="#C6952E" />
        <Blob className="w-72 h-72 top-40 -left-24" color="#1F4D36" />
        <div className="relative max-w-6xl mx-auto px-5 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <FadeIn><div className="inline-flex items-center gap-2 bg-green-900 text-amber-200 px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wide font-semibold mb-4">🌱 Farm to Plate, Digitally</div></FadeIn>
            <FadeIn delay={100}><h1 className="text-4xl md:text-5xl leading-tight font-semibold mb-4 font-serif">Grow smarter.<br />Sell direct.<br /><em className="italic text-green-800">Earn more.</em></h1></FadeIn>
            <FadeIn delay={200}><p className="text-[17px] text-green-900/70 max-w-lg mb-6">KrishiVardhan connects farmers straight to consumers — with AI crop advice, live weather intelligence, disease detection, shared logistics, and cold storage. No middlemen. Fair prices for everyone.</p></FadeIn>
            <FadeIn delay={300}>
              <div className="flex flex-wrap gap-3">
                <button className="btn-press px-6 py-3 rounded-lg bg-green-900 text-white font-semibold text-sm" onClick={() => { setAuthRole("farmer"); go("auth"); }}>🧑🌾 I'm a Farmer</button>
                <button className="btn-press px-6 py-3 rounded-lg bg-amber-500 text-green-950 font-semibold text-sm" onClick={() => { setAuthRole("customer"); go("auth"); }}>🛒 I'm a Customer</button>
                <button className="btn-press px-6 py-3 rounded-lg border-2 border-green-900 text-green-900 font-semibold text-sm" onClick={() => go("marketplace")}>Browse Marketplace</button>
              </div>
            </FadeIn>
          </div>
          <div className="relative" style={{ minHeight: 340 }}>
            <div className="absolute inset-0"><Hero3D /></div>
            <FadeIn delay={150} className="relative"><ProfitCalculator /></FadeIn>
          </div>
        </div>
      </section>

      <section className="py-9 border-b border-green-950/10">
        <div className="max-w-6xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-5 text-center">
          <Stat value={50000} suffix="+" label="Registered Farmers" />
          <Stat value={10000} suffix="+" label="Daily Orders" />
          <Stat value={500} suffix="+" label="Cities Connected" />
          <Stat value={5} prefix="₹" suffix=" Cr+" label="Farmer Income Generated" />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-16">
        <div className="max-w-xl mb-10 mx-auto text-center">
          <div className="text-amber-600 font-bold text-xs uppercase tracking-wide">The Journey</div>
          <h2 className="text-3xl mt-1.5 font-serif">How KrishiVardhan works</h2>
        </div>
        <div className="relative grid sm:grid-cols-4 gap-6">
          <div className="hidden sm:block absolute top-7 left-[12%] right-[12%] h-[2px] bg-green-900/15" />
          {[
            ["🌱", "List Your Crop", "Farmer adds produce with photos, price and quantity in minutes."],
            ["🤖", "Get AI Guidance", "Weather, disease detection and crop advice — right from the app."],
            ["🛒", "Customer Buys Direct", "No middlemen. Customers browse, order and pay securely."],
            ["🚚", "Deliver & Get Paid", "Shared transport delivers the order — farmer gets paid fairly."],
          ].map(([icon, title, desc], i) => (
            <FadeIn key={title} delay={i * 100}>
              <div className="text-center relative">
                <div className="w-14 h-14 rounded-full bg-white border-2 border-green-900 text-2xl flex items-center justify-center mx-auto mb-3 relative z-10" style={{ animation: `floaty 3s ${i * 0.3}s ease-in-out infinite` }}>{icon}</div>
                <h3 className="font-semibold text-sm mb-1 font-serif">{title}</h3>
                <p className="text-xs text-green-900/60">{desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-green-950/10 py-16">
        <div className="max-w-6xl mx-auto px-5">
          <div className="max-w-xl mb-8">
            <div className="text-amber-600 font-bold text-xs uppercase tracking-wide">Meet the growers</div>
            <h2 className="text-3xl mt-1.5 font-serif">Featured Farmers</h2>
          </div>
          {loadingFarmers ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="animate-pulse bg-stone-100 rounded-2xl h-40" />)}</div>
          ) : farmers.length === 0 ? (
            <div className="text-center py-10 text-green-900/60 bg-stone-50 rounded-2xl">No farmers registered yet — be the first! <button onClick={() => go("auth")} className="text-green-800 font-semibold underline ml-1">Join as a farmer</button></div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {farmers.map((f, i) => (
                <FadeIn key={f.phone} delay={i * 80}>
                  <div onClick={() => viewFarmer(f.phone)} className="hover-lift cursor-pointer bg-stone-50 border border-green-950/10 rounded-2xl p-5 text-center">
                    <div className="flex justify-center mb-3"><Avatar name={f.name} size={56} /></div>
                    <h4 className="font-semibold text-sm font-serif">{f.name}</h4>
                    <p className="text-xs text-green-900/60 mb-2">{f.village || "—"}{f.district ? `, ${f.district}` : ""}</p>
                    <StarRating value={f.rating.avg} count={f.rating.count} size={12} />
                  </div>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-16">
        <div className="max-w-xl mb-8">
          <div className="text-amber-600 font-bold text-xs uppercase tracking-wide">What's inside</div>
          <h2 className="text-3xl mt-1.5 mb-2 font-serif">One ecosystem, every stage of the harvest</h2>
          <p className="text-green-900/70 text-[15px]">From the first seed to the customer's plate — KrishiVardhan supports every step.</p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            ["🤖", "#1F4D36", "AI Farming Assistant", "Ask farming questions in plain language and get instant, practical advice."],
            ["📸", "#B23A2E", "Crop Disease Detection", "Upload a leaf photo and get a diagnosis with treatment suggestions."],
            ["🌧️", "#3D6E8E", "Weather Intelligence", "Live forecasts plus spray/irrigate/harvest advice for your exact location."],
            ["🌱", "#C6952E", "AI Crop Planner", "Tell us your season, soil and water — get the best crop to plant."],
            ["❄️", "#8358B0", "Cold Storage Booking", "Reserve nearby storage space and cut post-harvest losses."],
            ["🚚", "#4A5A4C", "Shared Transport", "Pool deliveries with nearby farmers to cut logistics costs."],
          ].map(([icon, color, title, desc], i) => (
            <FadeIn key={title} delay={i * 70}>
              <div className="hover-lift bg-white border border-green-950/10 rounded-2xl p-5">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3" style={{ background: color + "1A", color }}>{icon}</div>
                <h3 className="text-base font-semibold mb-1 font-serif">{title}</h3>
                <p className="text-sm text-green-900/70">{desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="bg-green-950 text-white py-16">
        <div className="max-w-6xl mx-auto px-5">
          <div className="max-w-xl mb-8">
            <div className="text-amber-400 font-bold text-xs uppercase tracking-wide">Illustrative voices</div>
            <h2 className="text-3xl mt-1.5 font-serif">What growers &amp; buyers say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              ["Selling straight to customers meant I finally got a fair price for my tomatoes.", "A farmer, Gujarat"],
              ["The weather alerts told me exactly when to spray — saved my whole crop this season.", "A farmer, Punjab"],
              ["I love knowing exactly which village and farmer my vegetables came from.", "A customer, Ahmedabad"],
            ].map(([quote, who], i) => (
              <FadeIn key={who} delay={i * 90}>
                <div className="glass bg-white/10 rounded-2xl p-5 border border-white/10">
                  <p className="text-sm text-stone-100 mb-3">&ldquo;{quote}&rdquo;</p>
                  <p className="text-xs text-amber-300">— {who}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <p className="text-xs text-stone-400 mt-6">Illustrative composite quotes for demo purposes.</p>
        </div>
      </section>
    </div>
  );
}

function Stat({ value, prefix = "", suffix = "", label }) {
  const val = useCountUp(value, 1300);
  return <div><div className="font-serif text-3xl font-bold text-green-800">{prefix}{val.toLocaleString("en-IN")}{suffix}</div><div className="text-xs text-green-900/60 mt-1">{label}</div></div>;
}

const CROPS = { Wheat: { cost: 18000, yieldVal: 90000 }, Tomato: { cost: 35000, yieldVal: 180000 }, Potato: { cost: 28000, yieldVal: 110000 }, Cotton: { cost: 40000, yieldVal: 150000 }, Mustard: { cost: 15000, yieldVal: 70000 } };
function ProfitCalculator() {
  const [crop, setCrop] = useState("Wheat");
  const [acres, setAcres] = useState(2);
  const { cost, yieldVal } = CROPS[crop];
  const investment = cost * acres, revenue = yieldVal * acres, profit = revenue - investment;
  const pct = Math.min(100, Math.round((profit / revenue) * 100));
  return (
    <div className="bg-white border border-green-950/10 rounded-2xl p-6 shadow-xl relative z-10">
      <h3 className="text-[15px] uppercase tracking-wide text-green-900/60 font-bold">Profit Calculator</h3>
      <div className="font-serif text-[15px] text-green-950 mb-4">Estimate your season's earnings — live.</div>
      <div className="mb-4"><label className="block text-xs font-semibold text-green-900/60 mb-1.5">Crop</label><select value={crop} onChange={(e) => setCrop(e.target.value)} className="input">{Object.keys(CROPS).map((c) => <option key={c}>{c}</option>)}</select></div>
      <div className="mb-4"><label className="block text-xs font-semibold text-green-900/60 mb-1.5">Land Size: <span className="font-mono">{acres}</span> acre(s)</label><input type="range" min="0.5" max="10" step="0.5" value={acres} onChange={(e) => setAcres(parseFloat(e.target.value))} className="w-full accent-green-800" /></div>
      <div className="grid grid-cols-3 gap-2.5"><ResultBox label="Investment" value={investment} /><ResultBox label="Revenue" value={revenue} /><ResultBox label="Est. Profit" value={profit} highlight /></div>
      <div className="h-2 bg-stone-200 rounded-full overflow-hidden mt-4"><div className="h-full bg-gradient-to-r from-amber-500 to-green-800 rounded-full" style={{ width: `${pct}%`, transition: "width 0.5s ease" }} /></div>
      <p className="text-xs text-green-900/60 mt-2.5">Illustrative estimate based on average regional yields.</p>
    </div>
  );
}
function ResultBox({ label, value, highlight }) {
  return <div className="bg-stone-100 rounded-lg p-3 text-center"><div key={value} className={`font-mono font-bold text-lg ${highlight ? "text-green-700" : "text-green-950"}`} style={{ animation: "fadeUp 0.3s ease" }}>₹{Math.round(value).toLocaleString("en-IN")}</div><div className="text-[10.5px] text-green-900/60 uppercase tracking-wide mt-0.5">{label}</div></div>;
}

/* ---------------- AUTH ---------------- */
function Auth({ authRole, setAuthRole, authMode, setAuthMode, setSession, go, showToast }) {
  const [name, setName] = useState(""); const [phone, setPhone] = useState(""); const [pass, setPass] = useState("");
  const [village, setVillage] = useState(""); const [district, setDistrict] = useState(""); const [stateVal, setStateVal] = useState("");
  const [language, setLanguage] = useState("English"); const [exp, setExp] = useState(""); const [city, setCity] = useState("");
  const [err, setErr] = useState(""); const [loading, setLoading] = useState(false);

  async function doLogin() {
    setErr("");
    if (!/^\d{10}$/.test(phone) || !pass) { setErr("Enter a valid 10-digit mobile number and password."); return; }
    setLoading(true);
    const acc = await sget("account:" + phone);
    setLoading(false);
    if (!acc || acc.password !== pass || acc.role !== authRole) { setErr(`No matching ${authRole} account found.`); return; }
    setSession(acc); showToast("Welcome back, " + acc.name.split(" ")[0] + "!");
    go(authRole === "farmer" ? "farmer-dashboard" : "marketplace");
  }
  async function doRegister() {
    setErr("");
    if (!name.trim() || !/^\d{10}$/.test(phone) || !pass) { setErr("Please fill all fields with a valid 10-digit mobile number."); return; }
    setLoading(true);
    const existing = await sget("account:" + phone);
    if (existing) { setLoading(false); setErr("An account with this mobile number already exists."); return; }
    let acc = { phone, name, password: pass, role: authRole, joinedAt: Date.now() };
    if (authRole === "farmer") { acc.village = village; acc.district = district; acc.state = stateVal; acc.language = language; acc.experience = exp || 0; }
    else { acc.city = city; }
    await sset("account:" + phone, acc);
    setLoading(false);
    setSession(acc); showToast("Account created! Welcome, " + name.split(" ")[0] + ".");
    go(authRole === "farmer" ? "farmer-dashboard" : "marketplace");
  }

  return (
    <div className="max-w-lg mx-auto px-5 py-10">
      <h2 className="text-2xl mb-1 font-serif">Welcome to KrishiVardhan</h2>
      <p className="text-green-900/60 text-sm mb-6">Choose how you'll use the platform.</p>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {["farmer", "customer"].map((r) => (
          <button key={r} onClick={() => setAuthRole(r)} className={`hover-lift border-2 rounded-2xl p-4 text-center ${authRole === r ? "border-green-800 bg-green-50" : "border-green-950/10 bg-white"}`}>
            <div className="text-3xl">{r === "farmer" ? "🧑🌾" : "🛒"}</div>
            <strong className="capitalize">{r}</strong>
            <div className="text-xs text-green-900/60">{r === "farmer" ? "Sell produce, get AI advice" : "Buy fresh, direct from farms"}</div>
          </button>
        ))}
      </div>
      <div className="flex gap-1.5 bg-stone-200 p-1 rounded-xl w-fit mb-5">
        {["login", "register"].map((m) => <button key={m} onClick={() => setAuthMode(m)} className={`px-4 py-2 text-sm font-semibold rounded-lg ${authMode === m ? "bg-white shadow text-green-950" : "text-green-900/60"}`}>{m === "login" ? "Log In" : "Register"}</button>)}
      </div>
      <div className="bg-white border border-green-950/10 rounded-2xl p-6" style={{ animation: "fadeUp 0.25s ease" }}>
        {authMode === "login" ? (
          <div className="space-y-3.5">
            <Field label="Mobile Number"><input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={10} className="input" /></Field>
            <Field label="Password"><input type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="input" /></Field>
            {err && <p className="text-red-600 text-xs">{err}</p>}
            <button onClick={doLogin} disabled={loading} className="btn-press w-full justify-center bg-green-900 text-white rounded-lg py-3 font-semibold text-sm mt-1">{loading ? "Logging in…" : `Log In as ${authRole === "farmer" ? "Farmer" : "Customer"}`}</button>
          </div>
        ) : (
          <div className="space-y-3.5">
            <div className="grid sm:grid-cols-2 gap-3.5">
              <Field label="Full Name"><input value={name} onChange={(e) => setName(e.target.value)} className="input" /></Field>
              <Field label="Mobile Number"><input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={10} className="input" /></Field>
              <Field label="Password"><input type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="input" /></Field>
              {authRole === "farmer" ? (
                <>
                  <Field label="Village"><input value={village} onChange={(e) => setVillage(e.target.value)} className="input" /></Field>
                  <Field label="District"><input value={district} onChange={(e) => setDistrict(e.target.value)} className="input" /></Field>
                  <Field label="State"><input value={stateVal} onChange={(e) => setStateVal(e.target.value)} className="input" /></Field>
                  <Field label="Preferred Language"><select value={language} onChange={(e) => setLanguage(e.target.value)} className="input">{["English", "Hindi", "Gujarati", "Marathi", "Punjabi"].map((l) => <option key={l}>{l}</option>)}</select></Field>
                  <Field label="Farming Experience (years)"><input type="number" min="0" value={exp} onChange={(e) => setExp(e.target.value)} className="input" /></Field>
                </>
              ) : (
                <Field label="City"><input value={city} onChange={(e) => setCity(e.target.value)} className="input" /></Field>
              )}
            </div>
            {err && <p className="text-red-600 text-xs">{err}</p>}
            <button onClick={doRegister} disabled={loading} className={`btn-press w-full rounded-lg py-3 font-semibold text-sm mt-1 ${authRole === "farmer" ? "bg-green-900 text-white" : "bg-amber-500 text-green-950"}`}>{loading ? "Creating account…" : `Create ${authRole === "farmer" ? "Farmer" : "Customer"} Account`}</button>
          </div>
        )}
      </div>
    </div>
  );
}
function Field({ label, children }) { return <div><label className="block text-xs font-semibold text-green-900/60 mb-1.5">{label}</label>{children}</div>; }

/* ---------------- MARKETPLACE ---------------- */
function Marketplace({ session, addToCart, go, wishlist, toggleWishlist, viewFarmer }) {
  const [products, setProducts] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [organicOnly, setOrganicOnly] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const keys = await slist("product:");
    const items = [];
    for (const k of keys) { const p = await sget(k); if (p && p.status === "available") items.push(p); }
    setProducts(items);
    const uniqueFarmers = [...new Set(items.map((p) => p.farmerPhone))];
    const r = {};
    for (const phone of uniqueFarmers) r[phone] = await getFarmerRating(phone);
    setRatings(r);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = products.filter((p) => {
    const matchSearch = !search || (p.name + p.farmerName + (p.village || "")).toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || p.category === category;
    const matchOrganic = !organicOnly || p.organic;
    return matchSearch && matchCat && matchOrganic;
  });

  function handleAdd(p) { if (!session || session.role !== "customer") { go("auth"); return; } addToCart(p); }

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <h2 className="text-2xl mb-1 font-serif">Marketplace</h2>
      <p className="text-green-900/60 text-sm mb-6">Fresh produce, straight from the farm. No middlemen.</p>
      <div className="bg-white border border-green-950/10 rounded-2xl p-5 mb-6">
        <div className="grid sm:grid-cols-2 gap-3.5">
          <div><label className="block text-xs font-semibold text-green-900/60 mb-1.5">Search</label><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tomato, wheat, organic..." className="input" /></div>
          <div><label className="block text-xs font-semibold text-green-900/60 mb-1.5">Category</label><select value={category} onChange={(e) => setCategory(e.target.value)} className="input">{["All", "Vegetables", "Fruits", "Grains", "Pulses", "Spices", "Dairy"].map((c) => <option key={c}>{c}</option>)}</select></div>
        </div>
        <label className="flex items-center gap-2 mt-3 text-sm"><input type="checkbox" checked={organicOnly} onChange={(e) => setOrganicOnly(e.target.checked)} /> Organic only</label>
      </div>
      {loading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="animate-pulse bg-stone-200 rounded-2xl h-64" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-14 text-green-900/60"><div className="text-4xl mb-2">🌾</div>No products found yet.</div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {filtered.map((p, i) => (
            <FadeIn key={p.id} delay={i * 40}>
              <ProductCard product={p} onAdd={handleAdd} rating={ratings[p.farmerPhone]} isWishlisted={wishlist?.includes(p.id)} onToggleWishlist={() => toggleWishlist(p)} onViewFarmer={() => viewFarmer(p.farmerPhone)} />
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, onAdd, onRemove, rating, isWishlisted, onToggleWishlist, onViewFarmer }) {
  const [showTrace, setShowTrace] = useState(false);
  return (
    <div className="hover-lift bg-white border border-green-950/10 rounded-2xl overflow-hidden relative">
      <div className="h-28 bg-stone-100 flex items-center justify-center text-5xl relative">
        {product.image || "🥬"}
        {onToggleWishlist && <button onClick={onToggleWishlist} className="btn-press absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-sm shadow">{isWishlisted ? "❤️" : "🤍"}</button>}
      </div>
      <div className="p-4">
        <h4 className="text-sm font-semibold flex items-center gap-2 font-serif">{product.name}{product.organic && <span className="text-[10px] bg-amber-500 text-green-950 px-2 py-0.5 rounded-full font-bold">Organic</span>}</h4>
        <button onClick={onViewFarmer} className="text-xs text-green-900/60 mb-1 hover:underline text-left">by {product.farmerName} · {product.village || "—"}</button>
        {rating && rating.count > 0 && <div className="mb-1.5"><StarRating value={rating.avg} count={rating.count} size={11} /></div>}
        <button onClick={() => setShowTrace((v) => !v)} className="text-[11px] text-green-800/70 underline mb-2 block">{showTrace ? "Hide" : "🚚 Track this crop"}</button>
        {showTrace && <div className="text-[11px] bg-stone-50 rounded-lg p-2 mb-2 text-green-900/70" style={{ animation: "fadeUp 0.2s ease" }}><div><strong>Farm:</strong> {product.farmerName}</div><div><strong>Village:</strong> {product.village || "—"}</div><div><strong>Listed:</strong> {new Date(product.createdAt).toLocaleDateString("en-IN")}</div></div>}
        <div className="flex items-center justify-between mt-2">
          <div className="font-mono font-bold text-green-950 text-sm">₹{product.price}<span className="text-green-900/60 font-normal text-xs">/{product.unit}</span></div>
          {onAdd && <button onClick={() => onAdd(product)} className="btn-press bg-green-900 text-white text-xs px-3 py-1.5 rounded-lg font-semibold">Add to Cart</button>}
          {onRemove && <button onClick={() => onRemove(product.id)} className="btn-press bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg font-semibold">Remove</button>}
        </div>
      </div>
    </div>
  );
}

/* ---------------- WISHLIST ---------------- */
function WishlistView({ wishlist, toggleWishlist, addToCart, go, viewFarmer }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const items = [];
      for (const id of wishlist) { const p = await sget("product:" + id); if (p) items.push(p); }
      setProducts(items); setLoading(false);
    })();
  }, [wishlist]);

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <h2 className="text-2xl mb-1 font-serif">My Wishlist</h2>
      <p className="text-green-900/60 text-sm mb-6">Products you've saved for later.</p>
      {loading ? <p className="text-sm text-green-900/60">Loading…</p> : products.length === 0 ? (
        <div className="text-center py-14 text-green-900/60"><div className="text-4xl mb-2">🤍</div>No saved items yet.<div className="mt-3"><button onClick={() => go("marketplace")} className="btn-press bg-green-900 text-white px-5 py-2.5 rounded-lg font-semibold text-sm">Browse Marketplace</button></div></div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p, i) => <FadeIn key={p.id} delay={i * 40}><ProductCard product={p} onAdd={addToCart} isWishlisted={true} onToggleWishlist={() => toggleWishlist(p)} onViewFarmer={() => viewFarmer(p.farmerPhone)} /></FadeIn>)}
        </div>
      )}
    </div>
  );
}

/* ---------------- FARMER PROFILE ---------------- */
function FarmerProfile({ phone, addToCart, session, go, wishlist, toggleWishlist }) {
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
      for (const k of keys) { const p = await sget(k); if (p && p.farmerPhone === phone && p.status === "available") mine.push(p); }
      setProducts(mine);
      setRating(await getFarmerRating(phone));
      setLoading(false);
    })();
  }, [phone]);

  function handleAdd(p) { if (!session || session.role !== "customer") { go("auth"); return; } addToCart(p); }

  if (loading) return <div className="max-w-4xl mx-auto px-5 py-16 text-center text-green-900/60">Loading farmer profile…</div>;
  if (!farmer) return <div className="max-w-4xl mx-auto px-5 py-16 text-center text-green-900/60">Farmer not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <div className="bg-white border border-green-950/10 rounded-2xl p-6 mb-8 flex flex-wrap items-center gap-5">
        <Avatar name={farmer.name} size={72} />
        <div className="flex-1">
          <h2 className="text-2xl font-serif flex items-center gap-2">{farmer.name} <span className="text-[10px] bg-green-900 text-white px-2 py-0.5 rounded-full font-bold align-middle">✔ Verified</span></h2>
          <p className="text-green-900/60 text-sm">{farmer.village}, {farmer.district} {farmer.state}</p>
          <div className="mt-1.5"><StarRating value={rating.avg} count={rating.count} /></div>
          {farmer.experience ? <p className="text-xs text-green-900/60 mt-1">{farmer.experience} years of farming experience</p> : null}
        </div>
      </div>
      <h3 className="text-lg font-serif mb-3">Available Produce</h3>
      {products.length === 0 ? <div className="text-center py-10 text-green-900/60 mb-8">No active listings right now.</div> : (
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">{products.map((p) => <ProductCard key={p.id} product={p} onAdd={handleAdd} isWishlisted={wishlist?.includes(p.id)} onToggleWishlist={() => toggleWishlist(p)} />)}</div>
      )}
      <h3 className="text-lg font-serif mb-3">Customer Reviews</h3>
      {rating.reviews.length === 0 ? <div className="text-center py-8 text-green-900/60">No reviews yet.</div> : (
        <div className="space-y-3">{rating.reviews.slice(0, 6).map((r, i) => (
          <div key={i} className="bg-white border border-green-950/10 rounded-xl p-4">
            <div className="flex justify-between items-center mb-1"><strong className="text-sm">{r.customerName}</strong><StarRating value={r.rating} showValue={false} size={13} /></div>
            {r.text && <p className="text-sm text-green-900/70">{r.text}</p>}
          </div>
        ))}</div>
      )}
    </div>
  );
}

/* ----------
<truncated 57382 bytes>

NOTE: The output was truncated because it was too long. Use a more targeted query or a smaller range to get the information you need.
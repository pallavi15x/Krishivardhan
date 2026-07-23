import React, { useState } from "react";
import { sget, sset } from "../utils/storage";

export function Auth({ authRole, setAuthRole, authMode, setAuthMode, setSession, go, showToast }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [language, setLanguage] = useState("English");
  const [exp, setExp] = useState("");
  const [city, setCity] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function doLogin() {
    setErr("");
    if (!/^\d{10}$/.test(phone) || !pass) {
      setErr("Enter a valid 10-digit mobile number and password.");
      return;
    }
    setLoading(true);
    const acc = await sget("account:" + phone);
    setLoading(false);
    if (!acc || acc.password !== pass || acc.role !== authRole) {
      setErr(`No matching ${authRole} account found. Check credentials.`);
      return;
    }
    setSession(acc);
    showToast("Welcome back, " + acc.name.split(" ")[0] + "! 👋");
    go(authRole === "farmer" ? "farmer-dashboard" : "marketplace");
  }

  async function doRegister() {
    setErr("");
    if (!name.trim() || !/^\d{10}$/.test(phone) || !pass) {
      setErr("Please fill all required fields with a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    const existing = await sget("account:" + phone);
    if (existing) {
      setLoading(false);
      setErr("An account with this mobile number already exists.");
      return;
    }
    let acc = { phone, name, password: pass, role: authRole, joinedAt: Date.now() };
    if (authRole === "farmer") {
      acc.village = village;
      acc.district = district;
      acc.state = stateVal;
      acc.language = language;
      acc.experience = exp || 0;
    } else {
      acc.city = city;
    }
    await sset("account:" + phone, acc);
    setLoading(false);
    setSession(acc);
    showToast("Account created! Welcome, " + name.split(" ")[0] + " 🎉");
    go(authRole === "farmer" ? "farmer-dashboard" : "marketplace");
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-14 bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200">
      <div className="w-full max-w-lg" style={{ animation: "fadeUp 0.3s ease" }}>
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🌾</div>
          <h2 className="text-3xl font-serif font-bold text-green-950">Welcome to KrishiVardhan</h2>
          <p className="text-green-900/60 text-sm mt-2">Choose your role and join India's farming ecosystem.</p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {["farmer", "customer"].map((r) => (
            <button
              key={r}
              onClick={() => setAuthRole(r)}
              className={`hover-lift border-2 rounded-2xl p-5 text-center transition-all ${
                authRole === r
                  ? "border-green-800 bg-green-900/5 shadow-md"
                  : "border-green-950/10 bg-white hover:border-green-800/30"
              }`}
            >
              <div className="text-4xl mb-1">{r === "farmer" ? "🧑🌾" : "🛒"}</div>
              <strong className="capitalize text-green-950 block text-lg font-serif">{r}</strong>
              <div className="text-xs text-green-900/60 mt-1">
                {r === "farmer" ? "Sell produce, get AI advice" : "Buy fresh, direct from farms"}
              </div>
            </button>
          ))}
        </div>

        {/* Login / Register Toggle */}
        <div className="flex gap-1.5 bg-stone-200 p-1 rounded-xl w-fit mb-5 mx-auto">
          {["login", "register"].map((m) => (
            <button
              key={m}
              onClick={() => setAuthMode(m)}
              className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                authMode === m ? "bg-white shadow text-green-950" : "text-green-900/60 hover:text-green-900"
              }`}
            >
              {m === "login" ? "🔐 Log In" : "📝 Register"}
            </button>
          ))}
        </div>

        <div className="bg-white border border-green-950/10 rounded-2xl p-7 shadow-lg" key={authMode} style={{ animation: "fadeUp 0.25s ease" }}>
          {authMode === "login" ? (
            <div className="space-y-4">
              <Field label="📱 Mobile Number">
                <input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={10} className="input" placeholder="10-digit mobile number" />
              </Field>
              <Field label="🔒 Password">
                <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="input" placeholder="Enter your password" />
              </Field>
              <div className="text-xs text-green-900/50 bg-stone-50 rounded-xl p-3 border border-stone-200">
                <strong>Demo accounts:</strong> Farmer: 9876543210 / 123 &nbsp;|&nbsp; Customer: 9123456789 / 123
              </div>
              {err && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-100">{err}</p>}
              <button
                onClick={doLogin}
                disabled={loading}
                className="btn-press w-full bg-green-900 text-white rounded-xl py-3.5 font-semibold text-sm hover:bg-green-800 transition-colors shadow-sm"
              >
                {loading ? "Logging in…" : `Log In as ${authRole === "farmer" ? "Farmer 🧑🌾" : "Customer 🛒"}`}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full Name">
                  <input value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Your full name" />
                </Field>
                <Field label="Mobile Number">
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={10} className="input" placeholder="10-digit number" />
                </Field>
                <Field label="Password">
                  <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="input" placeholder="Create a password" />
                </Field>
                {authRole === "farmer" ? (
                  <>
                    <Field label="Village">
                      <input value={village} onChange={(e) => setVillage(e.target.value)} className="input" placeholder="Your village" />
                    </Field>
                    <Field label="District">
                      <input value={district} onChange={(e) => setDistrict(e.target.value)} className="input" placeholder="Your district" />
                    </Field>
                    <Field label="State">
                      <input value={stateVal} onChange={(e) => setStateVal(e.target.value)} className="input" placeholder="Your state" />
                    </Field>
                    <Field label="Preferred Language">
                      <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input">
                        {["English", "Hindi", "Gujarati", "Marathi", "Punjabi", "Bengali", "Telugu"].map((l) => (
                          <option key={l}>{l}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Farming Experience (years)">
                      <input type="number" min="0" value={exp} onChange={(e) => setExp(e.target.value)} className="input" placeholder="Years of experience" />
                    </Field>
                  </>
                ) : (
                  <Field label="City">
                    <input value={city} onChange={(e) => setCity(e.target.value)} className="input" placeholder="Your city" />
                  </Field>
                )}
              </div>
              {err && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-100">{err}</p>}
              <button
                onClick={doRegister}
                disabled={loading}
                className={`btn-press w-full rounded-xl py-3.5 font-semibold text-sm transition-colors shadow-sm ${
                  authRole === "farmer" ? "bg-green-900 text-white hover:bg-green-800" : "bg-amber-500 text-green-950 hover:bg-amber-400"
                }`}
              >
                {loading ? "Creating account…" : `Create ${authRole === "farmer" ? "Farmer" : "Customer"} Account`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-green-900/70 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

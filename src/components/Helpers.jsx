import React, { useState, useEffect } from "react";
import { slist, sget } from "../utils/storage";

/* ---------------- ANIMATION HELPERS ---------------- */
export function FadeIn({ children, delay = 0, className = "" }) {
  const [show, setShow] = useState(delay === 0);
  useEffect(() => {
    if (delay > 0) {
      const t = setTimeout(() => setShow(true), delay);
      return () => clearTimeout(t);
    }
  }, [delay]);
  return (
    <div
      className={className}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(10px)",
        transition: delay > 0 ? "opacity 0.4s ease, transform 0.4s ease" : "none"
      }}
    >
      {children}
    </div>
  );
}

export function useCountUp(target, duration = 1200, active = true) {
  const [val, setVal] = useState(target);
  const isFirst = React.useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
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

export function PageWrap({ viewKey, children }) {
  const [visible, setVisible] = useState(true);
  const firstRender = React.useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, [viewKey]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(6px)",
        transition: firstRender.current ? "none" : "opacity 0.25s ease, transform 0.25s ease"
      }}
    >
      {children}
    </div>
  );
}

export function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div
      className="fixed bottom-6 right-6 bg-green-950 text-white px-5 py-3 rounded-xl shadow-2xl z-50 text-sm border border-amber-500/30 flex items-center gap-2"
      style={{ animation: "slidein 0.25s ease" }}
    >
      <span>✨</span>
      <span>{message}</span>
    </div>
  );
}

/* ---------------- VISUAL HELPERS ---------------- */
const AVATAR_GRADIENTS = [
  ["#1F4D36", "#3D8A5F"],
  ["#C6952E", "#E7C878"],
  ["#3D6E8E", "#6FA8C7"],
  ["#8358B0", "#B08FD6"],
  ["#B23A2E", "#D9695D"],
  ["#4A5A4C", "#7A8F7C"],
];

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function Avatar({ name, size = 44 }) {
  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const [c1, c2] = AVATAR_GRADIENTS[hashStr(name || "x") % AVATAR_GRADIENTS.length];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${c1}, ${c2})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: 700,
        fontSize: size * 0.38,
        flexShrink: 0
      }}
    >
      {initials}
    </div>
  );
}

export function StarRating({ value, size = 14, showValue = true, count }) {
  const full = Math.round(value);
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ fontSize: size, color: i <= full ? "#C6952E" : "#D8D2C4" }}>
          ★
        </span>
      ))}
      {showValue && value > 0 && (
        <span className="text-xs text-green-900/60 ml-1 font-mono">
          {value.toFixed(1)}
          {count != null ? ` (${count})` : ""}
        </span>
      )}
    </span>
  );
}

export function StarInput({ value, onChange }) {
  return (
    <span className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          style={{ fontSize: 22, color: i <= value ? "#C6952E" : "#D8D2C4", lineHeight: 1 }}
          className="btn-press"
        >
          ★
        </button>
      ))}
    </span>
  );
}

export function Blob({ className, color }) {
  return (
    <div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{ background: color, filter: "blur(50px)", opacity: 0.35 }}
    />
  );
}

// Fetch farmer rating statistics from storage
export async function getFarmerRating(farmerPhone) {
  const prefix = `rating:${farmerPhone}:`;
  const keys = await slist(prefix);
  let sum = 0;
  let count = 0;
  for (const key of keys) {
    const rec = await sget(key);
    if (rec && typeof rec.rating === 'number') {
      sum += rec.rating;
      count++;
    }
  }
  const avg = count > 0 ? sum / count : 0;
  return { avg, count };
}


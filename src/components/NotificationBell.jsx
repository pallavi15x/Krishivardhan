import React, { useState, useEffect } from "react";
import { slist, sget } from "../utils/storage";

export function NotificationBell({ session }) {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;

    async function load() {
      const keys = await slist("order:");
      const list = [];
      for (const k of keys) {
        const o = await sget(k);
        if (!o) continue;
        if (session.role === "farmer") {
          const mine = o.items.some((it) => it.farmerPhone === session.phone);
          if (mine && o.status === "placed") {
            list.push({ id: o.id, text: `New order ${o.id} from ${o.customerName}`, time: o.createdAt });
          }
        } else {
          if (o.customerPhone === session.phone && o.status !== "placed") {
            list.push({ id: o.id, text: `Order ${o.id} status updated to ${o.status}`, time: o.createdAt });
          }
        }
      }
      list.sort((a, b) => b.time - a.time);
      if (!cancelled) setNotifs(list.slice(0, 8));
    }

    load();
    const interval = setInterval(load, 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [session]);

  if (!session) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-lg hover:bg-stone-200 text-sm transition-colors"
        title="Notifications"
      >
        🔔
        {notifs.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
            {notifs.length}
          </span>
        )}
      </button>
      {open && (
        <div
          className="absolute right-0 top-11 w-72 bg-white border border-green-950/10 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto"
          onMouseLeave={() => setOpen(false)}
          style={{ animation: "fadeUp 0.15s ease" }}
        >
          <div className="p-3 border-b border-green-950/10 font-semibold text-sm flex items-center justify-between">
            <span>Notifications</span>
            <span className="text-xs text-amber-600 font-normal">{notifs.length} active</span>
          </div>
          {notifs.length === 0 ? (
            <div className="p-4 text-xs text-green-900/60 text-center">Nothing new right now.</div>
          ) : (
            notifs.map((n) => (
              <div key={n.id} className="p-3 border-b border-green-950/5 last:border-0 text-xs hover:bg-stone-50">
                <div className="font-medium text-green-950">{n.text}</div>
                <div className="text-green-900/60 mt-1 font-mono">{new Date(n.time).toLocaleString("en-IN")}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

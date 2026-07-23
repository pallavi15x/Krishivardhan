/* ---------------- STORAGE POLYFILL & HELPERS ---------------- */

// Polyfill window.storage if absent (uses localStorage)
if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    async set(key, value) {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (e) {
        console.error("localStorage set error", e);
        return null;
      }
    },
    async get(key) {
      try {
        const val = localStorage.getItem(key);
        return val !== null ? { value: val } : null;
      } catch (e) {
        return null;
      }
    },
    async delete(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        return null;
      }
    },
    async list(prefix) {
      try {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(prefix)) {
            keys.push(k);
          }
        }
        return { keys };
      } catch (e) {
        return { keys: [] };
      }
    }
  };
}

export async function sset(key, value, shared = true) {
  try {
    return await window.storage.set(key, JSON.stringify(value), shared);
  } catch (e) {
    console.error("storage set failed", e);
    return null;
  }
}

export async function sget(key, shared = true) {
  try {
    const r = await window.storage.get(key, shared);
    return r ? JSON.parse(r.value) : null;
  } catch (e) {
    return null;
  }
}

export async function sdelete(key, shared = true) {
  try {
    return await window.storage.delete(key, shared);
  } catch (e) {
    return null;
  }
}

export async function slist(prefix, shared = true) {
  try {
    const r = await window.storage.list(prefix, shared);
    return r ? r.keys : [];
  } catch (e) {
    return [];
  }
}

export async function getFarmerRating(farmerPhone) {
  const keys = await slist("review:");
  let total = 0, count = 0;
  const list = [];
  for (const k of keys) {
    const r = await sget(k);
    if (r && r.farmerPhone === farmerPhone) {
      total += r.rating;
      count++;
      list.push(r);
    }
  }
  list.sort((a, b) => b.createdAt - a.createdAt);
  return { avg: count ? total / count : 0, count, reviews: list };
}

/* ---------------- SEED INITIAL DATA IF EMPTY ---------------- */
export async function initSeedData() {
  const accounts = await slist("account:");
  if (accounts.length > 0) return; // Already seeded

  // Sample Farmers
  const farmers = [
    { phone: "9876543210", name: "Ramesh Patel", password: "123", role: "farmer", village: "Anand", district: "Anand", state: "Gujarat", language: "Gujarati", experience: 15, joinedAt: Date.now() - 864000000 },
    { phone: "9876543211", name: "Gurpreet Singh", password: "123", role: "farmer", village: "Ludhiana", district: "Ludhiana", state: "Punjab", language: "Punjabi", experience: 20, joinedAt: Date.now() - 764000000 },
    { phone: "9876543212", name: "Savita Patil", password: "123", role: "farmer", village: "Nashik", district: "Nashik", state: "Maharashtra", language: "Marathi", experience: 10, joinedAt: Date.now() - 664000000 },
    { phone: "9876543213", name: "Rajesh Verma", password: "123", role: "farmer", village: "Karnal", district: "Karnal", state: "Haryana", language: "Hindi", experience: 12, joinedAt: Date.now() - 564000000 },
  ];

  for (const f of farmers) {
    await sset("account:" + f.phone, f);
  }

  // Sample Customer
  await sset("account:9123456789", {
    phone: "9123456789",
    name: "Priya Sharma",
    password: "123",
    role: "customer",
    city: "Ahmedabad",
    joinedAt: Date.now() - 400000000
  });

  // Sample Products
  const products = [
    { id: "p1", name: "Organic Red Tomatoes", category: "Vegetables", price: 35, unit: "kg", quantity: 250, organic: true, image: "🍅", farmerName: "Ramesh Patel", farmerPhone: "9876543210", village: "Anand", status: "available", createdAt: Date.now() - 36000000 },
    { id: "p2", name: "Fresh Sharbati Wheat", category: "Grains", price: 42, unit: "kg", quantity: 1200, organic: false, image: "🌾", farmerName: "Gurpreet Singh", farmerPhone: "9876543211", village: "Ludhiana", status: "available", createdAt: Date.now() - 72000000 },
    { id: "p3", name: "Nashik Red Onions", category: "Vegetables", price: 28, unit: "kg", quantity: 500, organic: true, image: "🧅", farmerName: "Savita Patil", farmerPhone: "9876543212", village: "Nashik", status: "available", createdAt: Date.now() - 12000000 },
    { id: "p4", name: "Karnal Basmati Rice", category: "Grains", price: 95, unit: "kg", quantity: 800, organic: true, image: "🍚", farmerName: "Rajesh Verma", farmerPhone: "9876543213", village: "Karnal", status: "available", createdAt: Date.now() - 18000000 },
    { id: "p5", name: "Fresh Potatoes (Kufri)", category: "Vegetables", price: 22, unit: "kg", quantity: 900, organic: false, image: "🥔", farmerName: "Ramesh Patel", farmerPhone: "9876543210", village: "Anand", status: "available", createdAt: Date.now() - 5000000 },
    { id: "p6", name: "Pure Cow Ghee", category: "Dairy", price: 650, unit: "kg", quantity: 50, organic: true, image: "🧈", farmerName: "Savita Patil", farmerPhone: "9876543212", village: "Nashik", status: "available", createdAt: Date.now() - 8000000 },
  ];

  for (const p of products) {
    await sset("product:" + p.id, p);
  }

  // Sample Reviews
  const reviews = [
    { id: "r1", farmerPhone: "9876543210", customerName: "Priya Sharma", rating: 5, text: "Extremely fresh tomatoes delivered on time!", createdAt: Date.now() - 20000000 },
    { id: "r2", farmerPhone: "9876543211", customerName: "Amit Shah", rating: 5, text: "Best quality Basmati rice grain length.", createdAt: Date.now() - 40000000 },
    { id: "r3", farmerPhone: "9876543212", customerName: "Neha Gupta", rating: 4, text: "Great quality onions and organic ghee.", createdAt: Date.now() - 10000000 },
  ];

  for (const r of reviews) {
    await sset("review:" + r.id, r);
  }
}

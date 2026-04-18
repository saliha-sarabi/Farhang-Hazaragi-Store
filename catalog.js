// ============================
// CATALOG VERSION (one-time merge for legacy short lists)
// ============================
const CATALOG_VERSION = "3";

const PLACEHOLDER_SVG =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><rect fill="#e8e4dc" width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6b7280" font-family="system-ui,sans-serif" font-size="15">No image</text></svg>'
  );

// ============================
// INITIAL PRODUCT CATALOG (shared store + admin)
// ============================
const INITIAL_PRODUCTS = [
  { id: 1, name: "Banaras Dress", price: 35, category: "women", images: ["IMG_1025.PNG", "IMG_1298.PNG", "IMG_1299.PNG"], desc: "Stylish Banaras Dress" },
  { id: 2, name: "Hazaragi Dress", price: 50, category: "women", images: ["IMG_1131.PNG", "IMG_1132.PNG", "IMG_1133.PNG"], desc: "Elegant Handmade Women Hazaragi dress" },
  { id: 3, name: "Hazaragi Couple Dress", price: 28, category: "couple", images: ["IMG_1219.PNG", "IMG_1220.PNG"], desc: "Beautiful Couple Dress" },
  { id: 4, name: "Hazaragi Accessory", price: 25, category: "accessory", images: ["IMG_1224.PNG", "IMG_1194.PNG", "IMG_1225.PNG"], desc: "Classic Hazaragi Accessory" },
  { id: 5, name: "Afghani Gand", price: 45, category: "women", images: ["IMG_1070.PNG", "IMG_1071.PNG", "IMG_1072.PNG"], desc: "Traditional Afghan Dress" },
  { id: 6, name: "Traditional Thredwork Attire", price: 30, category: "women", images: ["IMG_1168.PNG", "IMG_1169.PNG", "IMG_1170.PNG"], desc: "Traditional handmade Dress" },
  { id: 7, name: "Men's Cloth", price: 60, category: "men", images: ["IMG_1274.PNG", "IMG_1275.PNG", "IMG_1276.PNG", "IMG_1278.PNG", "IMG_1279.PNG"], desc: "Traditional men's Attire" },
  { id: 8, name: "Hand Craft Trouser", price: 55, category: "women", images: ["IMG_1285.PNG", "IMG_1286.PNG", "IMG_1287.PNG", "IMG_1288.PNG", "IMG_1289.PNG", "IMG_1290.PNG"], desc: "Handmade trouser" },
  { id: 9, name: "Afghani Accessory", price: 40, category: "accessory", images: ["IMG_1179.PNG", "IMG_1180.PNG", "IMG_1181.PNG", "IMG_1182.PNG", "IMG_1183.PNG"], desc: "Classic Afghani Accessory" },
  { id: 10, name: "New Hazaragi Accessory", price: 20, category: "accessory", images: ["IMG_1228.PNG", "IMG_1230.PNG", "IMG_1192.PNG", "IMG_1231.PNG"], desc: "New Design Hazaragi Accessory" },
  { id: 11, name: "Casual Outfit", price: 22, category: "women", images: ["IMG_1264.PNG", "IMG_1266.PNG", "IMG_1271.PNG", "IMG_1273.PNG"], desc: "Comfortable Outfit" },
  { id: 12, name: "Child", price: 30, category: "women", images: ["IMG_1212.PNG", "IMG_1213.PNG", "IMG_1255.PNG", "IMG_1261.PNG"], desc: "Beautiful handmade Child' Dress" },
];

// ============================
// MERGE STORED CATALOG WITH INITIAL (keeps admin edits / new SKUs)
// ============================
function mergeCatalogWithInitial(parsed) {
  const byId = new Map();
  INITIAL_PRODUCTS.forEach((p) => byId.set(p.id, { ...p }));
  (parsed || []).forEach((p) => {
    if (byId.has(p.id)) {
      byId.set(p.id, { ...byId.get(p.id), ...p });
    } else {
      byId.set(p.id, { ...p });
    }
  });
  return Array.from(byId.values()).sort((a, b) => a.id - b.id);
}

// ============================
// LOAD PRODUCTS (localStorage + one-time migration)
// ============================
function loadAndPersistStoreCatalog() {
  const ver = localStorage.getItem("productsCatalogVersion");
  const raw = localStorage.getItem("products");

  if (!raw) {
    const next = [...INITIAL_PRODUCTS];
    localStorage.setItem("products", JSON.stringify(next));
    localStorage.setItem("productsCatalogVersion", CATALOG_VERSION);
    return next;
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    const next = [...INITIAL_PRODUCTS];
    localStorage.setItem("products", JSON.stringify(next));
    localStorage.setItem("productsCatalogVersion", CATALOG_VERSION);
    return next;
  }

  if (!Array.isArray(parsed)) {
    const next = [...INITIAL_PRODUCTS];
    localStorage.setItem("products", JSON.stringify(next));
    localStorage.setItem("productsCatalogVersion", CATALOG_VERSION);
    return next;
  }

  if (ver !== CATALOG_VERSION) {
    const next = mergeCatalogWithInitial(parsed);
    localStorage.setItem("products", JSON.stringify(next));
    localStorage.setItem("productsCatalogVersion", CATALOG_VERSION);
    return next;
  }

  return parsed;
}

// ============================
// IMAGE URL FALLBACKS (extension / folder / placeholder)
// ============================
function extensionAlternateFilenames(leaf) {
  const m = leaf.match(/^(.+)\.([^.]+)$/);
  if (!m) {
    return [leaf];
  }
  const base = m[1];
  const ext = m[2];
  const lower = ext.toLowerCase();
  const alts = new Set([ext, ext.toUpperCase(), ext.toLowerCase()]);

  if (lower === "jpg" || lower === "jpeg") {
    ["png", "PNG", "webp", "WEBP", "jpg", "JPG", "jpeg", "JPEG"].forEach((x) =>
      alts.add(x)
    );
  } else if (lower === "png") {
    ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG", "webp", "WEBP"].forEach((x) =>
      alts.add(x)
    );
  } else {
    alts.add(lower === ext ? ext.toUpperCase() : lower);
  }

  return [...alts].map((x) => `${base}.${x}`);
}

function expandPathVariants(relativePath) {
  const trimmed = (relativePath || "").trim();
  if (!trimmed) {
    return [];
  }

  const out = [];
  const segments = trimmed.split("/");
  const leaf = segments.pop() || trimmed;
  const dir = segments.length ? segments.join("/") + "/" : "";

  for (const name of extensionAlternateFilenames(leaf)) {
    const rel = dir + name;
    out.push(rel);
    if (!rel.toLowerCase().startsWith("images/")) {
      out.push("images/" + rel);
    }
  }

  return [...new Set(out)];
}

function getImageSrcCandidates(filename) {
  const list = expandPathVariants(filename);
  list.push(PLACEHOLDER_SVG);
  return [...new Set(list)];
}

function bindProductImage(img, filename) {
  if (!img) return;

  const urls = getImageSrcCandidates(filename);
  let i = 0;

  img.onload = function () {
    img.onerror = null;
  };

  img.onerror = function () {
    i += 1;
    if (i < urls.length) {
      img.src = urls[i];
    } else {
      img.onerror = null;
      img.src = PLACEHOLDER_SVG;
    }
  };

  img.src = urls[0];
}

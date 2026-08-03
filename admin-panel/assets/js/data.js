/* ============================================
   DATA — seed & CRUD data produk (disimpan di localStorage,
   diseed pertama kali dari data/products.json)
   ============================================ */

const DATA_KEY = 'panel_products';

async function initProductData() {
  if (localStorage.getItem(DATA_KEY)) return;
  let products = [];
  try {
    const res = await fetch('data/products.json');
    if (res.ok) products = await res.json();
  } catch (e) {
    products = [
      { id: 1, nama: 'Kopi Arabika 250g', kategori: 'Minuman', stok: 42, harga: 45000 },
      { id: 2, nama: 'Teh Hijau Premium', kategori: 'Minuman', stok: 18, harga: 32000 }
    ];
  }
  localStorage.setItem(DATA_KEY, JSON.stringify(products));
}

function getProducts() {
  const raw = localStorage.getItem(DATA_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveProducts(products) {
  localStorage.setItem(DATA_KEY, JSON.stringify(products));
}

function addProduct(product) {
  const products = getProducts();
  const nextId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
  products.push({ id: nextId, ...product });
  saveProducts(products);
}

function updateProduct(id, updates) {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return false;
  products[idx] = { ...products[idx], ...updates };
  saveProducts(products);
  return true;
}

function deleteProduct(id) {
  const products = getProducts().filter(p => p.id !== id);
  saveProducts(products);
}

function filterProducts({ query = '', kategori = '' } = {}) {
  return getProducts().filter(p => {
    const matchQuery = p.nama.toLowerCase().includes(query.toLowerCase());
    const matchKategori = !kategori || p.kategori === kategori;
    return matchQuery && matchKategori;
  });
}

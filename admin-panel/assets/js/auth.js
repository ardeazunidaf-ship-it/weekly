/* ============================================
   AUTH — login, logout, proteksi halaman, auto-logout
   Catatan: ini website statis, kredensial disimpan di
   localStorage (diseed dari data/admin.json). Ini cocok
   untuk demo / belajar, BUKAN untuk produksi nyata,
   karena semua logika berjalan di sisi klien (browser).
   ============================================ */

const AUTH_KEY = 'panel_admin_credentials';
const SESSION_KEY = 'panel_session';
const INACTIVITY_LIMIT_MS = 5 * 60 * 1000; // auto-logout setelah 5 menit tidak aktif

// Muat kredensial awal dari data/admin.json (sekali saja) ke localStorage
async function initAdminCredentials() {
  if (localStorage.getItem(AUTH_KEY)) return;
  let creds = { username: 'admin', password: 'admin123' };
  try {
    const res = await fetch('data/admin.json');
    if (res.ok) creds = await res.json();
  } catch (e) {
    // Jika dibuka langsung via file:// (bukan lewat server/GitHub Pages),
    // fetch bisa gagal karena CORS — pakai kredensial default di atas.
  }
  localStorage.setItem(AUTH_KEY, JSON.stringify(creds));
}

function getStoredCredentials() {
  const raw = localStorage.getItem(AUTH_KEY);
  return raw ? JSON.parse(raw) : { username: 'admin', password: 'admin123' };
}

function login(username, password) {
  const creds = getStoredCredentials();
  if (username.trim() === creds.username && password === creds.password) {
    const now = Date.now();
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      username: creds.username,
      loginAt: now,
      lastActivity: now
    }));
    return true;
  }
  return false;
}

function logout(redirect = true) {
  localStorage.removeItem(SESSION_KEY);
  if (redirect) window.location.href = 'index.html';
}

function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

function touchSession() {
  const session = getSession();
  if (!session) return;
  session.lastActivity = Date.now();
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function changePassword(oldPassword, newPassword) {
  const creds = getStoredCredentials();
  if (oldPassword !== creds.password) return { ok: false, message: 'Password lama tidak sesuai.' };
  creds.password = newPassword;
  localStorage.setItem(AUTH_KEY, JSON.stringify(creds));
  return { ok: true, message: 'Password berhasil diperbarui.' };
}

// Panggil di bagian atas setiap halaman terproteksi (dashboard.html, data.html)
function requireAuth() {
  const session = getSession();
  if (!session) {
    window.location.href = 'index.html';
    return;
  }
  if (Date.now() - session.lastActivity > INACTIVITY_LIMIT_MS) {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'index.html?expired=1';
    return;
  }
  // reset timer saat ada aktivitas pengguna
  ['click', 'keydown', 'mousemove', 'scroll'].forEach(evt =>
    document.addEventListener(evt, throttledTouch)
  );
  // cek berkala apakah sudah melewati batas idle
  setInterval(() => {
    const s = getSession();
    if (!s || Date.now() - s.lastActivity > INACTIVITY_LIMIT_MS) {
      localStorage.removeItem(SESSION_KEY);
      window.location.href = 'index.html?expired=1';
    }
  }, 15000);
}

let lastTouch = 0;
function throttledTouch() {
  const now = Date.now();
  if (now - lastTouch > 5000) { // throttle max sekali per 5 detik
    lastTouch = now;
    touchSession();
  }
}

function formatDuration(ms) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60).toString().padStart(2, '0');
  const s = (totalSec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

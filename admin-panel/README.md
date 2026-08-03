# Panel Admin (Website Statis)

Template panel admin statis (HTML/CSS/JS murni, tanpa backend/server) dengan sistem login dan manajemen data sederhana. Siap di-*push* ke GitHub dan di-*deploy* lewat **GitHub Pages**.

## Fitur

1. Login admin (kredensial diseed dari `data/admin.json`)
2. Logout
3. Dashboard dengan ringkasan statistik (total produk, stok menipis, kategori, estimasi nilai stok)
4. CRUD data produk (tambah, edit, hapus, lihat)
5. Pencarian & filter kategori pada tabel data
6. Ganti password admin
7. Proteksi halaman — otomatis redirect ke login jika belum login
8. Auto-logout setelah 5 menit tidak aktif
9. Desain responsif (mobile & desktop)
10. Notifikasi toast untuk aksi sukses/gagal

## Struktur Folder

```
admin-panel/
├── index.html          # halaman login
├── dashboard.html      # dashboard (terproteksi)
├── data.html           # manajemen data produk (terproteksi)
├── data/
│   ├── admin.json      # kredensial default admin
│   └── products.json   # data produk awal (seed)
├── assets/
│   ├── css/style.css
│   └── js/
│       ├── ui.js       # toast notifikasi
│       ├── auth.js     # login, logout, proteksi, auto-logout
│       └── data.js     # CRUD data produk
└── README.md
```

## Login Default

```
username: admin
password: admin123
```

**Ganti kredensial ini** di `data/admin.json` sebelum di-deploy ke publik.

## Cara Menjalankan

### Opsi 1 — Buka langsung
Cukup buka `index.html` di browser. Catatan: pada beberapa browser, `fetch()` ke file JSON bisa gagal jika dibuka langsung via `file://` (bukan lewat server). Jika ini terjadi, sistem otomatis memakai kredensial & data bawaan sebagai cadangan.

### Opsi 2 — Jalankan lewat server lokal (disarankan)
```bash
# dari dalam folder admin-panel/
python3 -m http.server 8000
# lalu buka http://localhost:8000
```

## Deploy ke GitHub Pages

1. Buat repository baru di GitHub, lalu upload seluruh isi folder `admin-panel/` ke root repository (atau `git push` biasa).
2. Masuk ke **Settings → Pages** pada repository.
3. Pilih source: branch `main`, folder `/ (root)`.
4. Simpan — situs akan tersedia di `https://<username>.github.io/<nama-repo>/`.

## ⚠️ Catatan Penting Soal Keamanan

Ini adalah website **statis** — semua logika (termasuk pengecekan password) berjalan di sisi browser (client-side) dan data disimpan di `localStorage`. Ini artinya:

- Kredensial **bisa dilihat** oleh siapa pun yang membuka source code lewat DevTools browser.
- Data yang diubah (tambah/edit/hapus produk, ganti password) **hanya tersimpan di browser pengguna itu sendiri**, tidak tersinkron ke file JSON asli atau ke pengguna lain.
- Cocok untuk: belajar, prototipe, demo, portofolio.
- **Tidak cocok** untuk aplikasi produksi yang menyimpan data sensitif. Untuk itu, dibutuhkan backend sungguhan (misalnya Node.js/Express, PHP, atau layanan seperti Firebase/Supabase) dengan autentikasi & database di sisi server.

## Kustomisasi

- Warna & font: ubah variabel di bagian atas `assets/css/style.css` (`:root { ... }`)
- Kolom data produk: sesuaikan di `data/products.json`, `assets/js/data.js`, dan `data.html`
- Batas waktu auto-logout: ubah `INACTIVITY_LIMIT_MS` di `assets/js/auth.js`

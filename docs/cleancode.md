# 🧹 Clean Code Mission — Full Project Refactor

> **Tujuan:** Bersihkan, optimalkan, dan restrukturisasi seluruh codebase agar web lebih cepat, ringan, dan mudah di-maintain.

---

## 📋 Instruksi Utama

Lakukan clean code secara **menyeluruh** pada **semua file dan folder** dalam project ini. **Tidak boleh ada satu pun file yang terlewat.**

---

## ✅ Checklist Tugas

### 0. 📸 Benchmark SEBELUM Mulai (Baseline)

> **Wajib dilakukan dulu sebelum menyentuh satu baris kode pun.**

Ukur performa awal sebagai baseline perbandingan:

- **Buka Chrome DevTools → tab Lighthouse** → jalankan audit untuk Mobile & Desktop
  - Catat skor: Performance, LCP, FID/INP, CLS, TBT
- **Buka tab Network** → reload halaman (Ctrl+Shift+R) → catat:
  - Total load time (DOMContentLoaded & Load)
  - Total transfer size
  - Jumlah request
- **Buka tab Performance** → record reload → catat:
  - Time to First Byte (TTFB)
  - First Contentful Paint (FCP)
  - Largest Contentful Paint (LCP)
- **Gunakan WebPageTest** (webpagetest.org) atau **GTmetrix** untuk hasil lebih detail jika perlu

> 💾 Simpan screenshot / export hasil Lighthouse sebagai file `benchmark-before.json` atau screenshot `benchmark-before.png`

---

### 1. 🗂️ Scan Seluruh File & Folder
- Masuk ke setiap folder dan subfolder secara rekursif
- Daftar semua file yang ditemukan sebelum mulai mengerjakan
- Tandai setiap file setelah selesai diproses ✅

---

### 2. ✂️ Singkat & Sederhanakan Code

Untuk setiap file, lakukan:

- **Hapus kode yang tidak dipakai** — variabel, fungsi, import, dead code
- **Persingkat logika yang verbose** — ganti kondisi panjang dengan ternary, optional chaining (`?.`), nullish coalescing (`??`), dsb.
- **Hapus comment yang tidak informatif** — seperti `// ini fungsi login` yang sudah jelas dari nama fungsinya
- **Rename variabel/fungsi** yang namanya ambigu atau tidak deskriptif
- **Hapus console.log / debugger** yang tertinggal di production code
- **Hapus whitespace dan baris kosong berlebih**

---

### 3. 🧩 Ekstrak Komponen / Fungsi Berulang

Identifikasi dan refactor:

- **UI pattern yang muncul lebih dari 1x** → jadikan reusable component
- **Logika bisnis yang duplikat** → pindahkan ke utility function / custom hook / service
- **API call yang diulang** → buat satu fungsi terpusat (misal: `fetchData`, `apiClient`)
- **Style / class Tailwind yang sama berulang** → buat component wrapper atau gunakan `@apply`
- **Konstanta hardcoded yang dipakai di banyak tempat** → pindahkan ke file `constants.js` / `config.js`

---

### 4. ⚡ Optimasi Performa Web

- **Lazy load** semua komponen yang tidak muncul di viewport pertama (gunakan `React.lazy` / dynamic import)
- **Memoize** komponen yang sering re-render tapi propnya jarang berubah (`React.memo`, `useMemo`, `useCallback`)
- **Optimasi gambar** — pastikan semua `<img>` pakai `loading="lazy"` dan format WebP jika memungkinkan
- **Minimalkan re-render** — audit penggunaan `useEffect` dan pastikan dependency array-nya benar
- **Pisahkan bundle besar** — pastikan tidak ada satu file JS yang terlalu besar (code splitting)
- **Hapus library yang tidak dipakai** dari `package.json`
- **Preload resource kritis** — tambahkan `<link rel="preload">` untuk font dan asset above-the-fold
- **Cek font loading** — gunakan `font-display: swap` agar teks tidak invisible saat font belum load (ini sering bikin render delay)
- **Defer script non-kritis** — pastikan script pihak ketiga (analytics, chat widget, dll) pakai `async` atau `defer`

---

### 5. 📁 Struktur Folder yang Rapi

Pastikan struktur folder mengikuti pola yang konsisten, contoh:

```
src/
├── components/       # Reusable UI components
│   ├── ui/           # Atom/molecule components (Button, Input, Modal)
│   └── shared/       # Komponen yang dipakai di banyak halaman
├── pages/            # Halaman / routes
├── hooks/            # Custom hooks
├── services/         # API calls & business logic
├── utils/            # Helper functions
├── constants/        # Konstanta & config
└── assets/           # Gambar, icon, font
```

Jika ada file yang tidak di tempat yang seharusnya → **pindahkan dan update semua import-nya.**

---

### 6. 🧼 Code Style Konsisten

- Pastikan semua file menggunakan **format yang sama** (indentasi, quote style, semicolon)
- Jalankan formatter jika tersedia (Prettier / ESLint auto-fix)
- Pastikan semua komponen menggunakan **satu gaya penulisan** (arrow function vs function declaration — pilih satu dan konsisten)

---

### 7. 🏁 Benchmark SETELAH Selesai (Validasi)

> **Target: halaman utama load dalam < 3 detik pada koneksi normal (4G / Fast 3G).**

Ulangi semua langkah benchmark dari Step 0, lalu bandingkan:

| Metrik | Sebelum | Sesudah | Target |
|--------|---------|---------|--------|
| Lighthouse Performance Score | - | - | ≥ 85 |
| LCP (Largest Contentful Paint) | - | - | < 2.5 detik |
| FCP (First Contentful Paint) | - | - | < 1.8 detik |
| TBT (Total Blocking Time) | - | - | < 200ms |
| CLS (Cumulative Layout Shift) | - | - | < 0.1 |
| Total Load Time | - | - | < 3 detik |
| Total Transfer Size | - | - | Lebih kecil |
| Jumlah Request | - | - | Lebih sedikit |

**Cara cek load time secara manual:**
1. Buka Chrome → DevTools → tab Network
2. Centang "Disable cache"
3. Pilih throttling **"Fast 3G"** (simulasi user HP biasa)
4. Reload halaman (Ctrl+Shift+R)
5. Lihat angka di bagian bawah: `DOMContentLoaded` dan `Load`
6. Ulangi 3x, ambil rata-rata

> ⚠️ Jika load time masih > 3 detik di Fast 3G → cek tab Lighthouse untuk tahu bottleneck spesifiknya sebelum deploy.

---

## ⚠️ Aturan Penting

| Aturan | Detail |
|--------|--------|
| 🚫 Jangan skip file | Semua file wajib diproses, sekecil apapun |
| 🔁 Update semua import | Jika file dipindah / di-rename, update seluruh referensinya |
| ✋ Jangan ubah fungsionalitas | Clean code ≠ ubah behavior. Fungsi harus tetap sama persis |
| 📝 Catat semua perubahan | Buat summary perubahan per file setelah selesai |
| 🧪 Pastikan tidak ada yang broken | Setelah selesai, pastikan semua halaman & fitur masih berjalan |
| 📸 Simpan baseline | Jangan mulai tanpa screenshot benchmark awal |

---

## 💡 Tips Tambahan (Sering Terlewat)

**Render-blocking resources** — jalankan Lighthouse dan cek bagian "Eliminate render-blocking resources". Ini salah satu penyebab paling umum halaman terasa lemot walau ukuran filenya kecil.

**Bundle analyzer** — install `webpack-bundle-analyzer` atau `vite-bundle-visualizer` untuk lihat visualisasi isi bundle. Sering kali ada satu library yang nyedot 40%+ ukuran bundle padahal cuma dipakai di satu tempat.

**HTTP/2 & compression** — pastikan server mengaktifkan Gzip/Brotli compression dan HTTP/2. Ini bisa reduce transfer size 60-70% tanpa ubah kode sama sekali. Cek di tab Network → klik salah satu response → lihat header `content-encoding`.

**Critical CSS** — CSS yang dipakai above-the-fold bisa di-inline di `<head>` supaya tidak ada render-blocking. Tools: `critters` untuk Next.js / Vite.

**API waterfall** — audit apakah ada API call yang sequential padahal bisa di-parallel pakai `Promise.all()`. Ini sering jadi hidden bottleneck yang tidak keliatan di Lighthouse.

---

## 📊 Laporan Akhir yang Diharapkan

Setelah selesai, buat laporan berisi:

1. **Daftar file yang diproses** (total berapa file)
2. **Komponen baru yang dibuat** (nama + alasan)
3. **File / fungsi yang dihapus** (nama + alasan)
4. **Perbandingan benchmark** (tabel Sebelum vs Sesudah dari Step 7)
5. **Estimasi improvement performa** (persentase improvement LCP / load time)
6. **Hal yang perlu diperhatikan** oleh developer ke depannya

---

## 🚀 Mulai dari Sini

```
0. Benchmark dulu → simpan hasilnya
1. List semua file
2. Kerjakan per folder, dari yang paling sering dipakai
3. Komponen/pages → hooks → utils → services → constants
4. Terakhir cek package.json dan config files
5. Benchmark lagi → bandingkan → pastikan < 3 detik
```

---

> 💡 **Prioritas tertinggi:** Komponen yang di-render di halaman utama (above the fold) — ini yang paling berdampak ke performa user.
> 
> 🎯 **Quick win terbesar:** Biasanya ada di gambar yang tidak dioptimasi, bundle size yang kegedean, atau render-blocking script. Cek tiga ini dulu sebelum yang lain.
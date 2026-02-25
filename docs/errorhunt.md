# 🔬 Error Hunt Mission — Analisa & Perbaiki Semua Error

> **Tujuan:** Temukan dan perbaiki SEMUA error, calon error, dan code rapuh di seluruh project — baik yang sudah meledak maupun yang belum. Tidak boleh ada satu pun yang terlewat. Project harus berjalan bersih di local, staging, maupun production.

---

## ⚡ Mindset Utama

Bedakan 4 jenis masalah yang harus dicari:

```
💥 ERROR AKTIF     — Sudah error sekarang, merusak fungsi
⚠️  CALON ERROR    — Belum error, tapi akan error dalam kondisi tertentu
🤡 ASAL JALAN     — Fungsi tapi dengan cara yang salah / tidak reliable
🕳️  SILENT FAIL    — Gagal tanpa ada error message, user tidak tahu ada masalah
```

Semua 4 jenis ini wajib diperbaiki.

---

## 📋 Fase Kerja

---

### FASE 1 — Audit Statis (Tanpa Jalankan Code)

Baca setiap file secara seksama. Cari semua ini:

#### 🔴 JavaScript / TypeScript Errors

**Null & Undefined Hazards:**
```
- Akses property tanpa null check: user.name tanpa cek apakah user ada
- Array method pada nilai yang bisa null/undefined: data.map(...) tanpa verifikasi data adalah array
- Chaining panjang tanpa optional chaining: a.b.c.d tanpa a?.b?.c?.d
- Destructuring tanpa default value pada data yang bisa kosong
- useState yang langsung dipakai sebelum data API masuk (nilai awal undefined)
```

**Async / Promise Errors:**
```
- Async function tanpa try/catch
- Promise tanpa .catch() handler
- await di dalam forEach (tidak bekerja seperti yang diharapkan)
- Race condition: dua fetch jalan bersamaan, yang selesai terakhir override yang pertama
- Memory leak: fetch atau setTimeout tidak dibersihkan saat komponen unmount
- useEffect yang trigger infinite loop karena dependency array salah
```

**Logic Errors:**
```
- Kondisi yang selalu true atau selalu false
- Off-by-one error pada loop dan slice
- Perbandingan == vs === yang tidak tepat
- Mutasi langsung pada state React (array.push, object.key = value tanpa spread)
- Assignment di dalam kondisi if (if (a = b) bukan if (a === b))
- parseInt / parseFloat tanpa radix atau tanpa validasi hasilnya (bisa NaN)
```

**Type Errors (khusus TypeScript):**
```
- Penggunaan `any` yang berlebihan — ini mematikan TypeScript
- Type assertion paksa (as SomeType) tanpa validasi
- Return type fungsi yang tidak konsisten
- Interface yang tidak lengkap implementasinya
- Optional property yang dipakai seolah selalu ada
```

---

#### 🔴 React / Framework Errors

```
- Key prop yang pakai index array (ini calon bug saat list berubah urutan)
- useEffect cleanup tidak ada padahal ada side effect (event listener, interval, subscription)
- Komponen yang re-render tidak perlu karena object/array dibuat ulang setiap render
- Context yang menyebabkan seluruh tree re-render karena value selalu baru
- Lazy loading tanpa Suspense fallback
- Error boundary tidak ada — satu komponen crash = seluruh halaman blank
- Form yang tidak handle submit berulang (double submit karena user klik 2x)
- Image tanpa alt attribute (accessibility + bisa error di beberapa env)
```

---

#### 🔴 API & Data Fetching Errors

```
- Tidak handle HTTP error status (fetch tidak throw error untuk 4xx/5xx — harus cek response.ok)
- Tidak handle network error (offline, timeout)
- Tidak ada loading state — UI blank saat data belum datang
- Tidak ada error state — user tidak tahu kalau fetch gagal
- Data dari API langsung dipakai tanpa validasi strukturnya
- Hardcoded URL API yang berbeda antara development dan production
- API key / secret yang terekspos di frontend code atau di-commit ke repo
- CORS error yang di-"solve" dengan cara salah di frontend
```

---

#### 🔴 Environment & Config Errors

```
- Environment variable yang tidak ada fallback-nya (process.env.X tanpa default)
- ENV variable yang dipakai di frontend tapi harusnya server-only
- Perbedaan konfigurasi antara .env.local, .env.development, .env.production
- Path/URL yang hardcoded untuk local (localhost:3000) yang lupa diganti
- Feature flag atau config yang berbeda behavior di dev vs prod
- Build-time variable yang tidak tersedia saat runtime (atau sebaliknya)
```

---

#### 🔴 CSS / Styling Errors

```
- Z-index yang bentrok (modal ketutup elemen lain di production)
- Overflow hidden yang memotong konten penting di screen kecil
- Position absolute/fixed tanpa parent yang tepat
- Font yang tidak load (tidak ada fallback font)
- Warna text yang tidak kontras dengan background (accessibility)
- Responsive breakpoint yang tidak konsisten antara komponen
- Animation yang tidak di-pause untuk user dengan prefers-reduced-motion
```

---

#### 🔴 Performance Errors (yang bikin asal jalan)

```
- Data besar diload sekaligus tanpa pagination / virtualization
- Gambar resolusi asli ditampilkan tanpa resize (3MB foto untuk thumbnail 50x50px)
- Re-fetch data setiap kali komponen mount padahal data tidak berubah
- Bundle yang terlalu besar karena import library secara penuh (import _ from 'lodash')
- Blocking resource di <head> yang delay render halaman
```

---

### FASE 2 — Audit Runtime (Jalankan Project)

Setelah audit statis, jalankan project dan lakukan ini:

#### Console Browser
```
- Buka DevTools → Console
- Navigasi ke setiap halaman
- Catat SEMUA error dan warning yang muncul
- Termasuk: React warning, missing key, deprecated API, CORS error, 404 asset
```

#### Network Tab
```
- Cek semua request yang status 4xx / 5xx
- Cek request yang gagal (merah)
- Cek resource yang loading terlalu lama
- Cek apakah ada request yang duplikat / tidak perlu
```

#### Build Check
```
- Jalankan: npm run build
- Catat semua error dan warning saat build
- Cek ukuran bundle — warning jika ada chunk > 500KB
- Pastikan build selesai tanpa error
```

#### Lighthouse / Performance Audit
```
- Jalankan Lighthouse di Chrome DevTools
- Target minimum: Performance > 80, Accessibility > 90, Best Practices > 90
- Catat semua issue yang dilaporkan
```

---

### FASE 3 — Audit Security (Bonus tapi Penting)

```
- Cek apakah ada secret / API key yang ter-expose di client-side code
- Cek apakah ada file .env yang ke-commit ke git
- Cek apakah ada input user yang langsung dirender tanpa sanitasi (XSS)
- Cek apakah ada dangerouslySetInnerHTML tanpa sanitasi
- Cek apakah dependency memiliki known vulnerability: npm audit
- Cek apakah ada endpoint API yang tidak ada auth-nya padahal seharusnya ada
```

---

### FASE 4 — Eksekusi Perbaikan

**Urutan prioritas perbaikan:**

```
PRIORITAS 1 — Error yang bikin halaman blank / crash total
PRIORITAS 2 — Error yang bikin fitur utama tidak berfungsi
PRIORITAS 3 — Silent fail dan data corruption
PRIORITAS 4 — Console error dan warning
PRIORITAS 5 — Calon error dan code rapuh
PRIORITAS 6 — Performance dan best practices
```

**Aturan saat memperbaiki:**
- Jangan hanya "suppress" error (try/catch kosong, console.error dihapus) — perbaiki akar masalahnya
- Setiap perbaikan harus disertai penjelasan singkat: apa masalahnya dan kenapa ini solusinya
- Jika ada bug yang perlu perubahan besar dan berisiko — tandai untuk review developer, jangan asal ubah
- Setelah perbaikan, test ulang fitur yang diperbaiki

---

### FASE 5 — Verifikasi Final

Setelah semua diperbaiki, lakukan checklist ini:

**Local:**
- [ ] `npm run dev` — project jalan tanpa error
- [ ] Buka setiap halaman — tidak ada yang blank atau crash
- [ ] Console browser bersih — tidak ada error, minimal warning
- [ ] Semua fitur utama berfungsi normal

**Build:**
- [ ] `npm run build` — selesai tanpa error
- [ ] Tidak ada chunk size warning yang baru
- [ ] `npm run preview` / `npm start` — production build jalan normal

**Code:**
- [ ] Tidak ada TypeScript error (`tsc --noEmit` jika TypeScript project)
- [ ] ESLint bersih atau hanya warning minor (`npm run lint`)
- [ ] Tidak ada `console.log` tertinggal di production code

---

## 📊 Format Laporan Akhir

```
## Laporan Error Hunt

### Ringkasan
- Total file dianalisa: X
- Total error ditemukan: X
- Total error diperbaiki: X
- Total ditandai untuk review manual: X

---

### Error yang Diperbaiki

#### [NAMA FILE]
| No | Jenis | Deskripsi Error | Solusi |
|----|-------|-----------------|--------|
| 1  | 💥 Error Aktif | fetch tanpa try/catch, crash saat network offline | Tambah try/catch + error state |
| 2  | ⚠️ Calon Error | user.profile.name tanpa null check | Ganti dengan user?.profile?.name ?? 'Unknown' |
| 3  | 🤡 Asal Jalan | response.json() langsung tanpa cek response.ok | Tambah if (!response.ok) throw new Error(...) |

---

### Error yang Ditandai untuk Review Manual
| File | Masalah | Alasan Tidak Langsung Diperbaiki |
|------|---------|----------------------------------|
| src/services/payment.js | Logic kalkulasi diskon mencurigakan | Butuh konfirmasi business logic dari developer |

---

### Console Errors yang Ditemukan & Diperbaiki
(Screenshot atau deskripsi error console sebelum dan sesudah)

---

### Hasil Build Sebelum vs Sesudah
- Sebelum: X error, X warning
- Sesudah: 0 error, X warning (list warning yang tersisa)

---

### Rekomendasi Lanjutan
(Hal-hal yang tidak bisa diperbaiki otomatis dan butuh keputusan developer)
```

---

## 🚀 Mulai dari Sini

```
Step 1: Audit statis — baca semua file, jangan jalankan apapun dulu
Step 2: Buat daftar semua temuan sebelum mulai perbaiki
Step 3: Jalankan project → audit console & network
Step 4: Jalankan build → catat error & warning
Step 5: Perbaiki sesuai urutan prioritas
Step 6: Verifikasi setiap perbaikan langsung setelah dikerjakan
Step 7: Verifikasi final menyeluruh
Step 8: Buat laporan lengkap
```

---

> 🧠 **Ingat:** Error yang paling berbahaya bukan yang sudah meledak — tapi yang **diam-diam gagal** tanpa ada yang tahu. Prioritaskan mencari silent fail dan calon error di path yang jarang dieksekusi (edge case, error handling, kondisi network buruk).
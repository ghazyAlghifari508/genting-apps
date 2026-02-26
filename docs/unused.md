# 🗑️ Delete Mission — Hapus Semua yang Tidak Terpakai

> **Tujuan:** Temukan dan hapus seluruh file, folder, dan ghost code yang tidak digunakan di project ini. Tidak boleh ada yang terlewat. Tidak boleh ada yang dihapus sembarangan tanpa verifikasi.

---

## ⚡ Aturan Emas Sebelum Mulai

| Aturan | Detail |
|--------|--------|
| 🔍 Verifikasi dulu, hapus kemudian | Jangan hapus apapun sebelum konfirmasi tidak ada yang pakai |
| 🚫 Jangan hapus berdasarkan nama saja | File bernama `old-`, `backup-`, `unused-` belum tentu benar-benar unused |
| 📝 Catat semua yang dihapus | Buat log lengkap: nama file + alasan dihapus |
| ✋ Skip jika ragu | Lebih baik tandai sebagai "perlu review manual" daripada hapus yang salah |
| 🔁 Update semua referensi | Jika ada yang nge-import sesuatu yang dihapus → update dulu sebelum hapus |

---

## 📋 Urutan Kerja

### FASE 1 — Pemetaan (Jangan hapus apapun dulu)

**1.1 List semua file & folder**
- Scan rekursif dari root project
- Catat path lengkap setiap file
- Catat ukuran file (prioritaskan yang besar)

**1.2 Bangun dependency map**
- Cari tahu siapa yang mengimport siapa
- Tandai file mana yang jadi "entry point" (tidak diimport siapapun tapi dipanggil langsung)
- Tandai file yang tidak diimport dari mana pun sebagai **kandidat hapus**

**1.3 Deteksi Folder Duplikat / Serupa**

Ini sering terjadi karena reorganisasi folder yang tidak selesai, atau ada dua developer yang buat folder berbeda untuk hal yang sama.

Langkah-langkahnya:

- Scan semua folder dan cari yang namanya mirip atau punya fungsi serupa, contoh:
  ```
  src/utils/      vs  src/helpers/
  src/components/ vs  src/ui/
  src/services/   vs  src/api/
  src/hooks/      vs  src/customHooks/
  src/constants/  vs  src/config/
  ```
- Untuk setiap pasangan folder yang mencurigakan:
  1. **List isi keduanya** — bandingkan file-file di dalamnya
  2. **Cek dependency map** — folder mana yang lebih banyak diimport di project?
  3. **Tentukan statusnya:**

| Kondisi | Keputusan |
|---------|-----------|
| Folder A dipakai, Folder B tidak diimport dari mana pun | Hapus Folder B, pindahkan isinya ke Folder A jika perlu |
| Folder A dan Folder B sama-sama diimport | Jangan hapus keduanya — tandai 🟡 untuk konsolidasi manual |
| Isi Folder A dan B tidak overlap (beda fungsi) | Jangan hapus — biarkan keduanya, pertimbangkan rename supaya lebih jelas |
| Isi Folder A dan B ada yang duplikat (file serupa) | Hapus file duplikat, pastikan semua import mengarah ke satu sumber |

- Setelah keputusan diambil, **update semua import** yang mengarah ke folder yang dihapus
- Catat hasilnya di laporan akhir

**1.4 Deteksi Gambar Duplikat di `/images/unsplash`**

Folder aset gambar sering jadi "tempat sampah tersembunyi" — file png/jpg numpuk tanpa ada yang sadar ada yang dobel.

Langkah-langkahnya:

**A. Temukan file duplikat secara konten (bukan cuma nama):**
- Bandingkan file berdasarkan **hash MD5/SHA** — dua file bisa punya nama berbeda tapi isi pixel-nya sama persis
- Bisa pakai command: `find /images/unsplash -type f \( -iname "*.jpg" -o -iname "*.png" \) | sort` untuk list semua file dulu
- Lalu cek hash: `md5sum /images/unsplash/*.jpg /images/unsplash/*.png | sort` — file dengan hash sama = duplikat sejati

**B. Temukan file yang namanya mirip / jelas duplikat:**
- Cari pola seperti: `hero.jpg` dan `hero-copy.jpg`, `banner.png` dan `banner_2.png`, `photo.jpg` dan `photo (1).jpg`
- Cari juga file dengan ukuran yang sama atau sangat mirip (selisih < 5KB) — bisa jadi hasil re-save

**C. Untuk setiap pasangan duplikat yang ditemukan, cek mana yang dipakai:**
- Cari referensinya di seluruh codebase: `grep -r "nama-file.jpg" src/` (atau pakai global search di IDE)
- Cek juga di CSS, komponen, dan file config (kadang gambar direferensikan lewat string bukan import)

**D. Tentukan keputusan:**

| Kondisi | Keputusan |
|---------|-----------|
| File A direferensikan di code, File B tidak | Hapus File B |
| File A dan B sama-sama direferensikan, isinya identik | Pilih satu (biasanya yang namanya lebih bersih), update semua referensi ke File B, hapus File B |
| File A dan B sama-sama direferensikan, isinya berbeda | Jangan hapus — ini bukan duplikat sejati |
| Tidak ada yang direferensikan (keduanya orphan) | Hapus keduanya — ini aset yang ditinggal |

**E. Cek juga gambar orphan (tidak direferensikan sama sekali):**
- Buat list semua filename di `/images/unsplash`
- Cari satu per satu di codebase — ada yang nyebut filename ini tidak?
- Yang tidak direferensikan dari mana pun = kandidat hapus 🔴
- Perhatian: ada gambar yang dipanggil secara dinamis lewat variabel (misal: `\`/images/unsplash/${slug}.jpg\``) — jangan hapus gambar yang namanya bisa cocok dengan pola seperti ini

> 💡 Gambar yang tidak dipakai bisa makan storage signifikan dan memperlambat deploy. Foto Unsplash biasanya besar (100KB–2MB per file) jadi ini worth dicek.

---

**1.5 Buat 3 kategori:**
```
🔴 HAPUS     — Sudah dipastikan tidak terpakai sama sekali
🟡 REVIEW    — Mencurigakan, perlu dicek manual
🟢 AMAN      — Masih dipakai, jangan disentuh
```

---

### FASE 2 — Deteksi Ghost Code & File Unused

#### 📁 File & Folder yang Harus Dicari

**File Kandidat Hapus:**
- File dengan nama mengandung: `old`, `backup`, `copy`, `test2`, `unused`, `deprecated`, `temp`, `tmp`, `draft`
- File duplikat yang isinya sama persis (atau hampir sama) dengan file lain
- File yang tidak diimport dari mana pun dan bukan entry point
- File `.DS_Store`, `Thumbs.db`, log file, file editor (`.swp`, `.swo`)
- File build artifact yang tidak sengaja ke-commit (`dist/`, `build/`, `.next/` jika ada di repo)

**Folder Kandidat Hapus:**
- Folder kosong (tidak ada isinya)
- Folder yang seluruh isinya sudah tidak dipakai
- Folder duplikat yang sudah diidentifikasi di Fase 1.3
- Folder `__pycache__`, `.cache`, `node_modules` (jangan commit ini)

**Config & Dotfiles:**
- Config tool yang sudah tidak dipakai (misal: config untuk library yang sudah dihapus)
- Script yang tidak pernah dijalankan

---

#### 👻 Ghost Code — Cari di Dalam File

Untuk setiap file, scan dan hapus:

**Variables & Constants:**
```
- Variabel yang dideklarasikan tapi tidak pernah dipakai
- Konstanta yang nilainya tidak pernah direferensikan
- State (useState) yang di-set tapi tidak pernah dibaca
```

**Functions & Methods:**
```
- Fungsi yang didefinisikan tapi tidak pernah dipanggil
- Method dalam class yang tidak pernah digunakan
- Helper function yang sudah digantikan fungsi lain
- Event handler yang sudah tidak ada event-nya
```

**Imports:**
```
- Import yang tidak dipakai di file tersebut
- Import yang di-import tapi langsung di-destructure sebagian dan sisanya terbuang
- Re-export yang tidak ada konsumennya
- Import yang mengarah ke file yang sama tapi lewat path berbeda (alias vs relative)
  contoh: import X from '@/utils/helper' dan import X from '../../utils/helper' di file berbeda
  → seragamkan semua ke satu pola
```

**JSX / HTML / Template:**
```
- Komponen yang di-render tapi sudah tidak ada gunanya (placeholder lama, section kosong)
- Props yang dikirim ke komponen tapi tidak diterima / dipakai di dalam komponen
- Conditional render yang conditionnya selalu false (dead branch)
- Commented-out code yang sudah lama (lebih dari beberapa hari)
```

**CSS / Styling:**
```
- Class CSS yang tidak dipakai di HTML manapun
- Variable CSS yang tidak direferensikan
- Media query untuk breakpoint yang tidak ada komponen targetnya
- Keyframe animation yang tidak dipakai
- Style inline yang di-override sepenuhnya oleh class
- File CSS / stylesheet yang tidak di-import dari mana pun
```

**Dependency (package.json):**
```
- Package yang terinstall tapi tidak ada satu pun file yang mengimportnya
- Package yang duplikat fungsinya (misal: ada axios DAN fetch wrapper)
- devDependencies yang masuk ke dependencies (atau sebaliknya)
- Package yang sudah punya native alternative di browser/framework
- Package versi lama yang ada versi barunya dan sudah tidak compatible — flag untuk upgrade
```

---

### FASE 3 — Eksekusi Penghapusan

**Urutan yang Benar:**

```
1. Hapus ghost code di dalam file (unused vars, imports, functions)
2. Hapus file yang 100% tidak terpakai
3. Konsolidasi folder duplikat (update semua import dulu, baru hapus folder lama)
4. Hapus folder yang sudah kosong setelah langkah 1-3
5. Hapus dependency dari package.json
6. Jalankan project — pastikan tidak ada yang broken
7. Jika ada error, trace dan fix referensinya
```

**Yang TIDAK boleh dihapus meski terlihat unused:**
- File konfigurasi framework (next.config.js, vite.config.js, tsconfig.json, dll)
- Entry point utama (index.js, main.tsx, App.tsx, dll)
- File `.env.example` (ini dokumentasi)
- File yang ada komentar `// @keep` atau `// @preserve`
- Type definitions (`.d.ts`) — meski tidak diimport, bisa dipakai secara implisit
- File yang dipanggil secara dinamis (`import(./pages/${name}`)`) — jangan hapus folder pages-nya
- File test (`.test.js`, `.spec.js`) — meski tidak diimport, dijalankan langsung oleh test runner

---

### FASE 4 — Verifikasi Akhir

Setelah semua dihapus:

- [ ] Jalankan project dari awal (`npm run dev` / `npm run build`)
- [ ] Buka setiap halaman utama — pastikan tidak ada error
- [ ] Cek console browser — tidak ada error import/module not found
- [ ] Cek network tab — pastikan tidak ada request ke file yang sudah dihapus
- [ ] Jalankan build untuk production — pastikan tidak ada warning/error baru
- [ ] Cek tidak ada import path yang broken akibat konsolidasi folder

---

## 📊 Format Laporan Akhir

Setelah selesai, buat laporan dengan format ini:

```
## Laporan Penghapusan

### File yang Dihapus (total: X file)
| File | Alasan |
|------|--------|
| src/components/OldButton.jsx | Tidak diimport dari mana pun sejak 3 bulan lalu |
| src/utils/legacyHelper.js | Sudah digantikan oleh src/utils/helper.js |

### Folder Duplikat yang Ditemukan & Hasilnya
| Folder A | Folder B | Yang Dipakai | Aksi |
|----------|----------|--------------|------|
| src/utils/ | src/helpers/ | src/utils/ | Hapus src/helpers/, pindah isinya ke src/utils/ |
| src/hooks/ | src/customHooks/ | Keduanya | Tidak dihapus, tandai untuk konsolidasi manual |

### Ghost Code yang Dihapus (per file)
| File | Yang Dihapus |
|------|--------------|
| src/pages/Home.jsx | 3 unused imports, 1 fungsi tidak terpakai, 2 state tidak dibaca |

### Package Dihapus dari package.json
| Package | Alasan |
|---------|--------|
| moment | Tidak dipakai, digantikan date-fns yang sudah ada |

### Audit Gambar /images/unsplash
| File | Status | Referensi di Code | Aksi |
|------|--------|-------------------|------|
| hero.jpg | Duplikat dari hero-copy.jpg | src/pages/Home.jsx | Pertahankan hero.jpg, hapus hero-copy.jpg |
| banner_old.png | Orphan | Tidak ada | Hapus |

### File yang Ditandai untuk Review Manual
| File | Alasan |
|------|--------|
| src/utils/analytics.js | Tidak diimport tapi mungkin dipanggil secara external |

### Estimasi Pengurangan Bundle Size & Storage
- JS/CSS sebelum: X KB / MB → sesudah: X KB / MB (hemat X%)
- Gambar dihapus: X file, total X MB dibebaskan
```

---

## 💡 Tips Tambahan (Sering Terlewat)

**Gunakan tools otomatis sebagai pembantu, bukan penentu:**
- `knip` — tools khusus untuk detect unused files, exports, dan dependencies di JS/TS project. Jalankan dulu, tapi tetap verifikasi manual hasilnya sebelum hapus
- `depcheck` — khusus untuk cek unused package di package.json
- ESLint rule `no-unused-vars` dan `import/no-unused-modules` bisa bantu flag ghost code secara otomatis

**Hati-hati dengan dynamic import & string-based routing:**
Beberapa framework (Next.js, Nuxt) otomatis load file berdasarkan nama file di folder tertentu (`pages/`, `routes/`, `app/`). File di sini tidak akan terlihat "diimport" secara eksplisit tapi sebenarnya aktif dipakai. **Jangan hapus file di folder routing framework tanpa dicek dulu.**

**Perhatikan barrel files (`index.js`):**
File `index.js` yang isinya cuma re-export sering jadi "perantara" — file di dalamnya kelihatan tidak langsung diimport padahal diakses lewat barrel. Jangan hapus file yang di-export dari `index.js` tanpa cek konsumennya.

**Cek git history sebelum hapus file besar:**
Kalau ada file yang kelihatan unused tapi ukurannya besar atau namanya penting, cek dulu di `git log -- path/to/file` untuk lihat kapan terakhir diubah dan konteksnya. Mungkin baru dinonaktifkan sementara.

---

## 🚀 Mulai dari Sini

```
Langkah 1: Scan dan list semua file & folder — jangan hapus apapun
Langkah 2: Bangun dependency map — siapa pakai siapa
Langkah 3: Identifikasi folder duplikat / serupa → tentukan mana yang aktif dipakai
Langkah 4: Kategorikan (🔴 Hapus / 🟡 Review / 🟢 Aman)
Langkah 5: Minta konfirmasi untuk kategori 🔴 sebelum eksekusi
Langkah 6: Eksekusi penghapusan sesuai urutan di Fase 3
Langkah 7: Verifikasi — pastikan project masih jalan
Langkah 8: Buat laporan akhir
```

---

> ⚠️ **Peringatan:** Jika di tengah proses ditemukan file yang tidak jelas apakah dipakai atau tidak — **jangan hapus, tandai 🟡 dan laporkan ke developer untuk diputuskan secara manual.**
>
> 🔁 **Khusus folder duplikat:** Jangan hapus folder lama sebelum semua import di project sudah diupdate ke folder baru. Hapus folder lama adalah langkah **terakhir**, bukan pertama.
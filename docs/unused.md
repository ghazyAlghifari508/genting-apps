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

**1.3 Buat 3 kategori:**
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
```

**Dependency (package.json):**
```
- Package yang terinstall tapi tidak ada satu pun file yang mengimportnya
- Package yang duplikat fungsinya (misal: ada axios DAN fetch wrapper)
- devDependencies yang masuk ke dependencies (atau sebaliknya)
- Package yang sudah punya native alternative di browser/framework
```

---

### FASE 3 — Eksekusi Penghapusan

**Urutan yang Benar:**

```
1. Hapus ghost code di dalam file (unused vars, imports, functions)
2. Hapus file yang 100% tidak terpakai
3. Hapus folder yang sudah kosong setelah langkah 1-2
4. Hapus dependency dari package.json
5. Jalankan project — pastikan tidak ada yang broken
6. Jika ada error, trace dan fix referensinya
```

**Yang TIDAK boleh dihapus meski terlihat unused:**
- File konfigurasi framework (next.config.js, vite.config.js, tsconfig.json, dll)
- Entry point utama (index.js, main.tsx, App.tsx, dll)
- File `.env.example` (ini dokumentasi)
- File yang ada komentar `// @keep` atau `// @preserve`
- Type definitions (`.d.ts`) — meski tidak diimport, bisa dipakai secara implisit
- File yang dipanggil secara dinamis (`import(./pages/${name}`)`) — jangan hapus folder pages-nya

---

### FASE 4 — Verifikasi Akhir

Setelah semua dihapus:

- [ ] Jalankan project dari awal (`npm run dev` / `npm run build`)
- [ ] Buka setiap halaman utama — pastikan tidak ada error
- [ ] Cek console browser — tidak ada error import/module not found
- [ ] Cek network tab — pastikan tidak ada request ke file yang sudah dihapus
- [ ] Jalankan build untuk production — pastikan tidak ada warning/error baru

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

### Ghost Code yang Dihapus (per file)
| File | Yang Dihapus |
|------|--------------|
| src/pages/Home.jsx | 3 unused imports, 1 fungsi tidak terpakai, 2 state tidak dibaca |

### Package Dihapus dari package.json
| Package | Alasan |
|---------|--------|
| moment | Tidak dipakai, digantikan date-fns yang sudah ada |

### File yang Ditandai untuk Review Manual
| File | Alasan |
|------|--------|
| src/utils/analytics.js | Tidak diimport tapi mungkin dipanggil secara external |

### Estimasi Pengurangan Bundle Size
- Sebelum: X KB / MB
- Sesudah: X KB / MB
- Hemat: X KB / MB (X%)
```

---

## 🚀 Mulai dari Sini

```
Langkah 1: Scan dan list semua file dulu — jangan hapus apapun
Langkah 2: Bangun dependency map — siapa pakai siapa
Langkah 3: Kategorikan (🔴 Hapus / 🟡 Review / 🟢 Aman)
Langkah 4: Minta konfirmasi untuk kategori 🔴 sebelum eksekusi
Langkah 5: Eksekusi penghapusan sesuai urutan di Fase 3
Langkah 6: Verifikasi — pastikan project masih jalan
Langkah 7: Buat laporan akhir
```

---

> ⚠️ **Peringatan:** Jika di tengah proses ditemukan file yang tidak jelas apakah dipakai atau tidak — **jangan hapus, tandai 🟡 dan laporkan ke developer untuk diputuskan secara manual.**
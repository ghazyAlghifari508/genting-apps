# 🧹 Clean Code Mission — Full Project Refactor

> **Tujuan:** Bersihkan, optimalkan, dan restrukturisasi seluruh codebase agar web lebih cepat, ringan, dan mudah di-maintain.

---

## 📋 Instruksi Utama

Lakukan clean code secara **menyeluruh** pada **semua file dan folder** dalam project ini. **Tidak boleh ada satu pun file yang terlewat.**

---

## ✅ Checklist Tugas

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

## ⚠️ Aturan Penting

| Aturan | Detail |
|--------|--------|
| 🚫 Jangan skip file | Semua file wajib diproses, sekecil apapun |
| 🔁 Update semua import | Jika file dipindah / di-rename, update seluruh referensinya |
| ✋ Jangan ubah fungsionalitas | Clean code ≠ ubah behavior. Fungsi harus tetap sama persis |
| 📝 Catat semua perubahan | Buat summary perubahan per file setelah selesai |
| 🧪 Pastikan tidak ada yang broken | Setelah selesai, pastikan semua halaman & fitur masih berjalan |

---

## 📊 Laporan Akhir yang Diharapkan

Setelah selesai, buat laporan berisi:

1. **Daftar file yang diproses** (total berapa file)
2. **Komponen baru yang dibuat** (nama + alasan)
3. **File / fungsi yang dihapus** (nama + alasan)
4. **Estimasi improvement performa** (jika bisa diukur)
5. **Hal yang perlu diperhatikan** oleh developer ke depannya

---

## 🚀 Mulai dari Sini

```
1. List semua file dulu
2. Kerjakan per folder, dari yang paling sering dipakai
3. Komponen/pages → hooks → utils → services → constants
4. Terakhir cek package.json dan config files
```

---

> 💡 **Prioritas tertinggi:** Komponen yang di-render di halaman utama (above the fold) — ini yang paling berdampak ke performa user.
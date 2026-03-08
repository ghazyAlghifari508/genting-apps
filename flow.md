Product Requirements Document (PRD) - GENTING User Flow Testing
Overview
Dokumen ini mendefinisikan skenario pengujian End-to-End (E2E) menggunakan TestSprite untuk website GENTING (Cegah Stunting Sejak Dini). Fokus pengujian adalah pada User Flow untuk peran (role) User Biasa (Ibu Hamil/Keluarga), memastikan seluruh fitur utama dapat beroperasi dan tampil dengan baik di mode Frontend (port 3000).

Environment
Base URL: http://localhost:3000
Mode: Light Mode
Skenario Pengujian (User Flow)
1. Landing Page & Navigasi Awal
Tujuan: Memastikan halaman depan memuat dengan sempurna dan navigasi utama berfungsi.
Langkah:
Buka halaman utama (/).
Verifikasi elemen UI utama seperti Hero image, fitur unggulan, dan call to action (CTA).
Pastikan tidak ada "dark mode residue" (tampilan harus murni light mode).
Klik tombol "Mulai Sekarang" atau "Masuk/Daftar".
2. Autentikasi (Registrasi & Login)
Tujuan: Memastikan sistem pembuatan akun baru dan login berjalan lancar.
Langkah Registrasi:
Arahkan ke halaman pendaftaran (/register atau /login lalu pilih daftar).
Isi form dengan data dummy: Email (contoh: testuser_genting@example.com), Nama Lengkap, dan Password.
Submit form.
Verifikasi bahwa user berhasil dialihkan ke halaman onboarding atau User Dashboard.
Langkah Login (Opsional jika session mati):
Arahkan ke /login.
Masuk dengan akun dummy yang telah dibuat.
Verifikasi masuk ke Dashboard.
3. User Dashboard
Tujuan: Memastikan halaman home base user memuat rangkuman informasi yang benar.
Langkah:
Berada di /dashboard (atau halaman utama user setelah login).
Verifikasi bagian Profil singkat dan total poin/XP.
Verifikasi rute cepat (quick links) ke fitur utama: Roadmap, Vision, Konsultasi, dan Edukasi.
4. Aktivitas 1000 HPK (Roadmap)
Tujuan: Menguji fitur pelacakan aktivitas harian.
Langkah:
Navigasi ke /roadmap.
Verifikasi UI Header (pastikan progress bar dan teks sejajar secara estetik).
Verifikasi daftar aktivitas harian muncul.
Coba klik satu aktivitas (jika interaktif) untuk memverifikasi detail atau status penyelesaian.
5. AI Vision (Analisis Nutrisi)
Tujuan: Menguji kelancaran antarmuka fitur berbasis AI.
Langkah:
Navigasi ke /vision.
Verifikasi halaman pemindai kamera/unggah foto sayuran dan makanan termuat.
(Simulasi unggah jika TestSprite memungkinkan, jika tidak cukup verifikasi elemen form uploader).
Pastikan tidak ada error render di halaman ini.
6. Konsultasi Dokter
Tujuan: Menguji fitur pemilihan dokter dan pengecekan riwayat.
Langkah:
Navigasi ke /konsultasi-dokter.
Verifikasi daftar dokter (Doctor Cards) termuat dengan baik.
Scroll ke bagian "Riwayat Konsultasi" (jika ada).
Verifikasi bahwa gap (jarak) antara Card Dokter dan Card Riwayat Konsultasi sudah pas (tidak terlalu jauh, sesuai perbaikan terakhir).
7. Edukasi Timeline
Tujuan: Menguji akses perpustakaan materi belajar ibu hamil.
Langkah:
Navigasi ke /education.
Verifikasi tampilan antarmuka timeline hari demi hari.
Verifikasi filter fase (contoh: Trimester 1, 2, dll) bisa diakses.
Klik salah satu kartu artikel edukasi untuk melihat detailnya.
Kriteria Sukses (Exit Criteria)
Robot TestSprite dapat mengeksekusi perjalanan dari Poin 1 hingga Poin 7 tanpa mengalami error aplikasi yang menghentikan navigasi (crash/blank route).
Tidak ada error 404 (Not Found) untuk halaman-halaman yang disebutkan.
Form Registrasi berhasil me-return status masuk (Login Success).
Layar UI di halaman Roadmap dan Konsultasi termuat rapih (layout validation).

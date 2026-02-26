# Test Accounts

Berikut adalah akun uji coba per role untuk platform Genting:

### 1. User (Bunda)
- **Email:** `user@genting.id`
- **Password:** nilai `SEED_USER_PASSWORD` dari `.env.local`
- **Role:** user

### 2. Doctor (Tenaga Medis)
- **Email:** `doctor@genting.id`
- **Password:** nilai `SEED_DOCTOR_PASSWORD` dari `.env.local`
- **Role:** doctor

### 3. Admin
- **Email:** `admin@genting.id`
- **Password:** nilai `SEED_ADMIN_PASSWORD` dari `.env.local`
- **Role:** admin

---
**Catatan:** Pastikan database telah di-seed menggunakan script `scripts/seed-users.ts` dan variabel seed password di `.env.local` sudah terisi.

npx tsx scripts/seed-users.ts
# GENTING Doctor Role - Implementation Planning

## 📋 Overview
Implementasi role **Doctor** di GENTING (Generasi Anti Stunting) untuk memungkinkan konsultasi realtime antara User dan Doctor dengan sistem pembayaran (dummy untuk MVP).

**Tech Stack:** Next.js + Supabase (PostgreSQL) + Tailwind CSS + TypeScript

---

## 🗄️ Database Schema

### 1. Table: `doctors`
```sql
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Profile Info
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  profile_picture_url TEXT,
  bio TEXT,
  
  -- Professional Info
  specialization VARCHAR(100) NOT NULL, -- pediatri, gizi, umum, etc
  license_number VARCHAR(100) UNIQUE NOT NULL,
  certification_url TEXT, -- URL to certification file/image
  years_of_experience INT,
  
  -- Pricing
  hourly_rate DECIMAL(10, 2) NOT NULL, -- harga per jam
  currency VARCHAR(3) DEFAULT 'IDR',
  
  -- Status
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  verification_date TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_doctors_user_id ON doctors(user_id);
CREATE INDEX idx_doctors_is_active ON doctors(is_active);
CREATE INDEX idx_doctors_specialization ON doctors(specialization);
```

### 2. Table: `doctor_schedules`
```sql
CREATE TABLE doctor_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  
  -- Schedule Info
  day_of_week INT NOT NULL, -- 0-6 (Sunday-Saturday)
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_doctor_schedules_doctor_id ON doctor_schedules(doctor_id);
CREATE UNIQUE INDEX idx_unique_doctor_schedule ON doctor_schedules(doctor_id, day_of_week, start_time);
```

### 3. Table: `consultations`
```sql
CREATE TABLE consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  
  -- Consultation Details
  title VARCHAR(255),
  description TEXT,
  
  -- Schedule
  scheduled_at TIMESTAMP NOT NULL,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  duration_minutes INT,
  
  -- Payment (Dummy)
  hourly_rate DECIMAL(10, 2) NOT NULL,
  total_cost DECIMAL(10, 2),
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, failed, refunded
  payment_method VARCHAR(50) DEFAULT 'dummy', -- dummy, midtrans, etc
  payment_reference VARCHAR(255), -- reference number
  payment_date TIMESTAMP,
  
  -- Consultation Status
  status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, ongoing, completed, cancelled, no_show
  notes TEXT, -- doctor's notes after consultation
  
  -- Ratings
  rating INT, -- 1-5 stars
  review TEXT,
  reviewed_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_consultations_user_id ON consultations(user_id);
CREATE INDEX idx_consultations_doctor_id ON consultations(doctor_id);
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_consultations_scheduled_at ON consultations(scheduled_at);
```

### 4. Table: `consultation_messages`
```sql
CREATE TABLE consultation_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_type VARCHAR(20) NOT NULL, -- 'user' or 'doctor'
  
  -- Message Content
  message TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text', -- text, image, prescription, etc
  file_url TEXT, -- for attachments
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_consultation_messages_consultation_id ON consultation_messages(consultation_id);
CREATE INDEX idx_consultation_messages_sender_id ON consultation_messages(sender_id);
CREATE INDEX idx_consultation_messages_created_at ON consultation_messages(created_at);
```

---

## 🏗️ Doctor Pages & Features

### **1. Doctor Dashboard** (`/dashboard/doctor`)
Main landing page untuk doctor setelah login.

**Features:**
- Overview stats (total earnings, consultation count, rating, etc)
- Upcoming consultations (next 7 days)
- Recent consultations (last 5)
- Quick action buttons (edit profile, manage schedule, view consultations)
- Simple charts/analytics

**Components:**
- `DoctorDashboardCard` - Stats card
- `UpcomingConsultationsList` - Table upcoming consultations
- `RecentConsultationsWidget` - List recent consultations
- `QuickStatsOverview` - Overview stats

---

### **2. Doctor Profile Setup** (`/dashboard/doctor/profile`)
Halaman untuk dokter mengisi/edit profil mereka.

**Features:**
- Upload profile picture
- Fill personal info (name, email, phone, bio)
- Professional info (specialization, license number, years of experience)
- Upload certification file
- Set hourly rate
- Save & publish profile

**Form Fields:**
```
Personal Info:
- Full Name (required)
- Email (required, read-only)
- Phone (required)
- Bio/About (textarea, max 500 chars)
- Profile Picture (image upload)

Professional Info:
- Specialization (dropdown: pediatri, gizi, umum, etc)
- License Number (required, unique)
- Years of Experience (number)
- Certification File (file upload - PDF/Image)

Pricing:
- Hourly Rate (decimal, required)
- Currency (default: IDR)

Status:
- Profile Completion % indicator
- Publish button (if profile complete)
```

---

### **3. Doctor Schedule Management** (`/dashboard/doctor/schedule`)
Halaman untuk dokter mengatur jadwal ketersediaan mereka.

**Features:**
- View current schedule (per day/week)
- Add/Edit/Delete available time slots
- Mark specific slots as unavailable
- Bulk operations (set same schedule for multiple days)
- Calendar view (optional, untuk MVP bisa skip)

**Schedule Management:**
```
Display Format:
- Weekly view (Monday - Sunday)
- For each day:
  - Toggle "Available" switch
  - Multiple time slots (start_time - end_time)
  - Add new slot button
  - Edit/Delete buttons per slot

Time Slot Format:
- Start Time (time picker)
- End Time (time picker)
- Is Available (toggle)
```

---

### **4. Doctor Consultations List** (`/dashboard/doctor/consultations`)
Halaman untuk dokter melihat daftar semua konsultasi mereka.

**Features:**
- Filter by status (scheduled, ongoing, completed, cancelled)
- Search by patient name/email
- Sort by date (upcoming, latest)
- View consultation details (click to open)
- Quick actions (start consultation, mark completed, add notes)

**Table Columns:**
- Patient Name
- Consultation Date/Time
- Duration (if completed)
- Status (badge: scheduled/ongoing/completed/cancelled)
- Total Cost
- Rating (stars)
- Actions (view, start, complete, etc)

---

### **5. Consultation Room** (`/dashboard/doctor/consultations/[id]`)
Halaman untuk melakukan chat/konsultasi realtime dengan user.

**Features:**
- Chat/messaging interface (realtime using Supabase Realtime)
- Display patient info (name, history, reason for consultation)
- Display consultation timer (countdown if ongoing)
- Status indicator (scheduled, ongoing, completed)
- Doctor notes section (textarea untuk dokter bisa tulis notes)
- End consultation button
- Message input + send

**Layout:**
```
Left Side (30%):
- Patient Info Card (name, age, reason for consultation)
- Previous Consultations (if any)
- Consultation Details (date, time, duration)

Center (70%):
- Chat Messages Area (scrollable)
- Message Input Field
- Attach button (optional, untuk MVP skip)

Top Bar:
- Consultation Status
- Timer (if ongoing)
- End Consultation Button
```

**Realtime Implementation:**
- Use **Supabase Realtime** on `consultation_messages` table
- Subscribe to messages untuk specific `consultation_id`
- Auto-refresh dokter profile jika ada update
- Indicate typing status (optional)

---

### **6. Consultation Completion** (`/dashboard/doctor/consultations/[id]/complete`)
Modal/page untuk menyelesaikan konsultasi.

**Features:**
- Doctor notes (textarea)
- Mark as completed
- Confirm end time
- Success message

---

### **7. Doctor Analytics/Reports** (`/dashboard/doctor/analytics`) [OPTIONAL - Phase 2]
Halaman untuk analytics dan reporting.

**Features:**
- Total earnings (this month, this year)
- Consultation count (total, completed, no-show)
- Average rating
- Busiest time slots
- Patient demographics (optional)

---

## 👤 User Side Changes

### **1. Doctor Selection Page** (Update `/dashboard/user/konsultasi-dokter`)
Halaman untuk user memilih dokter untuk konsultasi.

**Features:**
- Filter by specialization, rating, availability
- Search by doctor name
- Doctor card (foto, name, specialization, rating, hourly rate)
- "Book Consultation" button

**Doctor Card Display:**
```
- Profile Picture
- Name
- Specialization
- Years of Experience
- Average Rating (stars)
- Hourly Rate (Rp X.XXX/jam)
- Availability Status (available/next available [date])
- View Profile / Book Consultation buttons
```

---

### **2. Doctor Profile Page** (NEW: `/doctors/[id]`)
Detail profil dokter yang bisa dilihat user sebelum booking.

**Features:**
- Full doctor information
- Certifications/credentials
- Schedule (available slots)
- Patient reviews/ratings
- "Book Consultation" button

---

### **3. Booking Page** (NEW: `/dashboard/user/booking/[doctorId]`)
Halaman untuk user melakukan booking konsultasi.

**Features:**
- Doctor info (read-only)
- Select date & time (from doctor's available schedule)
- Add consultation reason/description
- Confirm & Proceed to Payment
- Display total cost calculation

**Form Fields:**
```
Doctor Info (read-only):
- Name, Specialization, Hourly Rate

Booking Details:
- Select Date (date picker)
- Select Time Slot (from available schedule)
- Duration (default: 1 hour, bisa custom)
- Reason/Description (textarea)
- Notes for Doctor (textarea, optional)

Cost Breakdown:
- Hourly Rate: Rp X.XXX
- Duration: X jam
- Total Cost: Rp X.XXX
- Tax (optional): Rp X
- Total Payment: Rp X.XXX

Actions:
- Cancel button
- Confirm & Proceed to Payment button
```

---

### **4. Payment Confirmation (DUMMY)** (NEW: `/dashboard/user/payment/[consultationId]`)
Modal/page untuk konfirmasi pembayaran (dummy/gimmick).

**Features (Dummy Payment):**
- Display consultation details
- Display total cost
- Payment method selection (dummy options: credit card, e-wallet, bank transfer)
- Confirm payment button
- After confirm: Show success page
- Create consultation record in DB dengan `payment_status = 'confirmed'`

**Payment Modal Content:**
```
Header:
- "Confirm Payment"
- Close button

Body:
- Consultation Summary
  - Doctor Name
  - Date/Time
  - Duration
  - Hourly Rate
  - Total Cost: Rp X.XXX

- Payment Method Selection (radio buttons):
  - Credit Card / Debit Card
  - E-Wallet (GCash, OVO, Dana, etc)
  - Bank Transfer
  
- Promo Code Input (optional)

- Terms & Conditions Checkbox

Footer:
- Cancel button
- Confirm Payment button

Success State (after confirm):
- Show checkmark icon
- "Payment Confirmed!"
- Consultation scheduled for [date] [time]
- "View Consultation" button
- "Back to Dashboard" button
```

---

### **5. Consultation Room (User Side)** (UPDATE: `/dashboard/user/consultations/[id]`)
Halaman user untuk chat dengan dokter.

**Features:**
- Same as doctor side (chat, timer, etc)
- Patient info display (show doctor info instead)
- Can't end consultation until doctor ends it
- After consultation: show rating form

**Layout:**
```
Left Side (30%):
- Doctor Info Card (name, specialization, rating)
- Consultation Details (date, time, duration)
- Session Timer

Center (70%):
- Chat Messages Area
- Message Input Field

Top Bar:
- Consultation Status
- Timer
- (No End button - wait for doctor to end)
```

---

### **6. Consultation History (User Side)** (`/dashboard/user/consultation-history`)
Halaman untuk user melihat riwayat konsultasi.

**Features:**
- List all past consultations
- View details
- Rating (if not yet rated)
- Re-book with same doctor button

---

### **7. Rating & Review** (Modal after consultation)
Setelah konsultasi selesai, user bisa rate & review dokter.

**Features:**
- Star rating (1-5)
- Review text (textarea, optional)
- Submit button
- Skip option

---

## 🔄 Real-time Messaging Implementation

### **Supabase Realtime Setup:**

1. **Enable Realtime in Supabase:**
   - Go to Project Settings → Realtime
   - Enable realtime for `consultation_messages` table

2. **Client-side Hook (useConsultationMessages):**
```typescript
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export function useConsultationMessages(consultationId: string) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch initial messages
    fetchMessages()

    // Subscribe to new messages
    const subscription = supabase
      .channel(`consultation:${consultationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'consultation_messages',
          filter: `consultation_id=eq.${consultationId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [consultationId])

  async function fetchMessages() {
    const { data } = await supabase
      .from('consultation_messages')
      .select('*')
      .eq('consultation_id', consultationId)
      .order('created_at', { ascending: true })
    
    setMessages(data || [])
    setLoading(false)
  }

  return { messages, loading }
}
```

3. **Send Message Function:**
```typescript
async function sendMessage(
  consultationId: string,
  senderId: string,
  senderType: 'user' | 'doctor',
  message: string
) {
  const { error } = await supabase
    .from('consultation_messages')
    .insert({
      consultation_id: consultationId,
      sender_id: senderId,
      sender_type: senderType,
      message
    })

  if (error) throw error
}
```

---

## 💳 Dummy Payment Flow

### **Payment Confirmation Modal Flow:**

1. User clicks "Proceed to Payment" on booking page
2. Redirect ke `/dashboard/user/payment/[consultationId]`
3. Show payment confirmation modal dengan:
   - Consultation details
   - Total cost
   - Payment method selection (radio buttons)
4. User clicks "Confirm Payment"
5. Create/Update consultation record:
   ```sql
   UPDATE consultations 
   SET payment_status = 'confirmed',
       payment_date = NOW(),
       status = 'scheduled'
   WHERE id = [consultationId]
   ```
6. Show success page with next steps
7. Consultation status berubah ke "scheduled" dan bisa di-start oleh dokter

### **Future Migration to Midtrans:**
- Replace confirm button handler dengan Midtrans redirect
- Use Midtrans token untuk payment processing
- Handle callback dari Midtrans untuk update payment status
- No major DB changes needed (already have `payment_method` field)

---

## 📁 Folder Structure

```
src/
├── app/
│   ├── dashboard/
│   │   ├── doctor/
│   │   │   ├── page.tsx (Doctor Dashboard)
│   │   │   ├── profile/
│   │   │   │   └── page.tsx (Doctor Profile Setup)
│   │   │   ├── schedule/
│   │   │   │   └── page.tsx (Doctor Schedule Management)
│   │   │   ├── consultations/
│   │   │   │   ├── page.tsx (Consultations List)
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx (Consultation Room)
│   │   │   │       └── complete/
│   │   │   │           └── page.tsx (Complete Consultation)
│   │   │   └── analytics/
│   │   │       └── page.tsx (Analytics - Phase 2)
│   │   ├── user/
│   │   │   ├── konsultasi-dokter/
│   │   │   │   └── page.tsx (Updated - Doctor Selection)
│   │   │   ├── booking/
│   │   │   │   └── [doctorId]/
│   │   │   │       └── page.tsx (Booking Page)
│   │   │   ├── payment/
│   │   │   │   └── [consultationId]/
│   │   │   │       └── page.tsx (Payment Confirmation)
│   │   │   ├── consultations/
│   │   │   │   ├── page.tsx (Consultation History)
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx (Consultation Room - User)
│   │   │   └── consultation-history/
│   │   │       └── page.tsx (Consultation History)
│   ├── doctors/
│   │   └── [id]/
│   │       └── page.tsx (Doctor Profile Public)
│
├── components/
│   ├── doctor/
│   │   ├── DoctorDashboard/
│   │   │   ├── DoctorDashboardCard.tsx
│   │   │   ├── UpcomingConsultationsList.tsx
│   │   │   ├── RecentConsultationsWidget.tsx
│   │   │   └── QuickStatsOverview.tsx
│   │   ├── ProfileSetup/
│   │   │   ├── PersonalInfoForm.tsx
│   │   │   ├── ProfessionalInfoForm.tsx
│   │   │   ├── PricingForm.tsx
│   │   │   └── ProfileCompletion.tsx
│   │   ├── ScheduleManagement/
│   │   │   ├── ScheduleTable.tsx
│   │   │   ├── AddScheduleModal.tsx
│   │   │   └── TimeSlotCard.tsx
│   │   ├── ConsultationRoom/
│   │   │   ├── ChatArea.tsx
│   │   │   ├── PatientInfoCard.tsx
│   │   │   ├── DoctorNotesSection.tsx
│   │   │   ├── ConsultationTimer.tsx
│   │   │   └── MessageInput.tsx
│   │   └── ConsultationsList.tsx
│   │
│   ├── user/
│   │   ├── DoctorSelection/
│   │   │   ├── DoctorCard.tsx
│   │   │   ├── DoctorFilter.tsx
│   │   │   └── DoctorSearch.tsx
│   │   ├── DoctorProfilePage/
│   │   │   ├── DoctorHeaderInfo.tsx
│   │   │   ├── DoctorCredentials.tsx
│   │   │   ├── DoctorSchedule.tsx
│   │   │   └── ReviewsList.tsx
│   │   ├── BookingForm/
│   │   │   ├── DateTimeSelector.tsx
│   │   │   ├── ReasonInput.tsx
│   │   │   ├── CostBreakdown.tsx
│   │   │   └── BookingForm.tsx
│   │   ├── PaymentModal/
│   │   │   ├── PaymentConfirmation.tsx
│   │   │   ├── PaymentMethodSelector.tsx
│   │   │   ├── CostSummary.tsx
│   │   │   └── PaymentSuccess.tsx
│   │   ├── ConsultationRoom/
│   │   │   ├── ChatArea.tsx
│   │   │   ├── DoctorInfoCard.tsx
│   │   │   ├── ConsultationTimer.tsx
│   │   │   └── MessageInput.tsx
│   │   ├── RatingModal.tsx
│   │   └── ConsultationHistory.tsx
│   │
│   └── shared/
│       ├── ConsultationStatus.tsx
│       ├── RatingStars.tsx
│       ├── ConsultationTimer.tsx
│       └── MessageBubble.tsx
│
├── hooks/
│   ├── useConsultationMessages.ts
│   ├── useDoctorProfile.ts
│   ├── useConsultationTimer.ts
│   └── useBookingForm.ts
│
├── lib/
│   ├── supabaseClient.ts
│   ├── doctorService.ts
│   ├── consultationService.ts
│   ├── paymentService.ts (dummy)
│   └── utils.ts
│
├── types/
│   ├── doctor.ts
│   ├── consultation.ts
│   ├── payment.ts
│   └── schedule.ts
│
└── styles/
    └── globals.css
```

---

## 🚀 Implementation Phases

### **Phase 1 (MVP):**
1. Database setup (tables + indexes)
2. Doctor Profile Setup page
3. Doctor Schedule Management
4. Doctor Dashboard (basic stats)
5. Doctor Consultations List
6. Consultation Room (both doctor & user)
7. Dummy Payment Confirmation
8. User Doctor Selection page
9. Booking page
10. User Consultation History
11. Rating & Review modal

**Timeline:** 2-3 weeks

---

### **Phase 2 (Enhancement):**
1. Doctor Analytics page
2. Advanced filtering/search
3. Typing indicators in chat
4. File attachments in chat
5. Prescription system
6. Email/Push notifications
7. SMS reminders
8. Admin moderation panel

**Timeline:** TBD

---

### **Phase 3 (Integration):**
1. Midtrans payment integration
2. Webhook handling
3. Refund system
4. Advanced analytics
5. Doctor verification system

**Timeline:** TBD

---

## 🔐 Authentication & Authorization

### **Role-based Access Control:**
```typescript
// middleware.ts atau library function
export async function checkDoctorRole(userId: string) {
  const { data: doctor } = await supabase
    .from('doctors')
    .select('id')
    .eq('user_id', userId)
    .single()
  
  return !!doctor
}

// Protect routes:
// /dashboard/doctor/* → hanya untuk doctor role
// /dashboard/user/* → hanya untuk user role
```

---

## ✅ Checklist untuk Development

- [ ] Database schema dibuat & tested
- [ ] Auth system supports doctor role
- [ ] Doctor profile setup page
- [ ] Doctor schedule management
- [ ] Doctor dashboard dengan stats
- [ ] Doctor consultations list
- [ ] Real-time messaging (Supabase Realtime)
- [ ] Consultation room (doctor)
- [ ] Consultation room (user)
- [ ] User doctor selection page
- [ ] Booking page & flow
- [ ] Dummy payment confirmation
- [ ] Rating & review modal
- [ ] Consultation history (both roles)
- [ ] Error handling & validation
- [ ] UI/UX polish (Tailwind)
- [ ] Testing (unit + integration)
- [ ] Documentation

---

## 🎯 Key Considerations

1. **Real-time Performance:** Supabase Realtime bagus, tapi monitoring latency penting
2. **Scalability:** Pagination perlu untuk large message lists & consultations
3. **Payment:** Keep dummy payment logic simple untuk easy Midtrans migration
4. **Notifications:** Consider adding toast notifications untuk better UX
5. **Validation:** Server-side validation untuk semua forms
6. **Error Handling:** Proper error messages & fallbacks
7. **Loading States:** Show loading indicators untuk async operations
8. **Responsive Design:** Mobile-first approach dengan Tailwind

---

## 📞 Support & Questions

Untuk pertanyaan teknis atau clarification, review kembali section yang relevan atau reach out!

Happy coding! 🎉
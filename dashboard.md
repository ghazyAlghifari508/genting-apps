# GENTING Doctor Dashboard - Comprehensive Planning

## 📋 Overview
Implementasi complete Doctor Dashboard sebagai all-in-one solution dengan:
- Real-time consultation chat
- Notification system (in-app + email)
- Dashboard statistics & overview
- Consultation management
- Patient history & notes
- Prescription system

**Tech Stack:** Next.js + Supabase (PostgreSQL + Realtime) + Tailwind CSS + TypeScript + Nodemailer (untuk email)

---

## 🗄️ Database Schema Updates

### 1. Table: `consultation_messages` (Update)
```sql
-- Add support untuk file attachments & message types
ALTER TABLE consultation_messages ADD COLUMN IF NOT EXISTS message_type VARCHAR(50) DEFAULT 'text';
-- message_type: text, file, prescription, note

ALTER TABLE consultation_messages ADD COLUMN IF NOT EXISTS file_url TEXT;
ALTER TABLE consultation_messages ADD COLUMN IF NOT EXISTS file_name VARCHAR(255);
ALTER TABLE consultation_messages ADD COLUMN IF NOT EXISTS file_size BIGINT;
ALTER TABLE consultation_messages ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;

-- Index untuk improve query performance
CREATE INDEX IF NOT EXISTS idx_consultation_messages_is_read ON consultation_messages(is_read);
```

### 2. Table: `prescriptions` (New)
```sql
CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Prescription Details
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  medicines JSONB, -- Array of {name, dosage, frequency, duration}
  instructions TEXT,
  
  -- Status
  status VARCHAR(50) DEFAULT 'active', -- active, expired, archived
  issued_at TIMESTAMP DEFAULT NOW(),
  valid_until TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prescriptions_consultation_id ON prescriptions(consultation_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor_id ON prescriptions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_user_id ON prescriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_status ON prescriptions(status);
```

### 3. Table: `doctor_notifications` (New)
```sql
CREATE TABLE IF NOT EXISTS doctor_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  
  -- Notification Content
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  notification_type VARCHAR(50) NOT NULL, -- new_consultation, message, payment, reminder, etc
  reference_id UUID, -- consultation_id atau message_id
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  
  -- Action
  action_url VARCHAR(255), -- URL untuk click notification
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doctor_notifications_doctor_id ON doctor_notifications(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_notifications_is_read ON doctor_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_doctor_notifications_created_at ON doctor_notifications(created_at);
```

### 4. Table: `doctor_availability_status` (New)
```sql
CREATE TABLE IF NOT EXISTS doctor_availability_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE UNIQUE,
  
  -- Current Status
  status VARCHAR(50) DEFAULT 'offline', -- online, available, busy, break, offline
  status_message VARCHAR(255), -- "On lunch break", "Busy with consultation", etc
  
  -- Timestamps
  set_at TIMESTAMP DEFAULT NOW(),
  until TIMESTAMP, -- Auto-reset after this time
  
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doctor_availability_status_doctor_id ON doctor_availability_status(doctor_id);
```

### 5. Table: `doctor_notes` (New - untuk internal notes per patient)
```sql
CREATE TABLE IF NOT EXISTS doctor_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Notes
  note_text TEXT NOT NULL,
  is_private BOOLEAN DEFAULT true, -- doctor only atau visible to patient
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doctor_notes_doctor_id ON doctor_notes(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_notes_user_id ON doctor_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_doctor_notes_created_at ON doctor_notes(created_at DESC);
```

### 6. Table: `consultation_status_history` (New - untuk track status changes)
```sql
CREATE TABLE IF NOT EXISTS consultation_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
  
  -- Status Change
  old_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  reason TEXT,
  
  -- Timestamps
  changed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consultation_status_history_consultation_id ON consultation_status_history(consultation_id);
```

---

## 🎨 Doctor Dashboard - All-in-One Layout

### **Main Dashboard Structure**

```
┌─────────────────────────────────────────────────────────────────┐
│                          NAVBAR + PROFILE                       │
├──────────────────────┬──────────────────────────────────────────┤
│                      │                                          │
│  LEFT SIDEBAR        │        MAIN CONTENT AREA                │
│  (200px fixed)       │      (Responsive - flex)                │
│                      │                                          │
│  • Dashboard         │  ┌─────────────────────────────────┐   │
│  • Consultations     │  │   TOP STATS BAR                 │   │
│  • Schedule          │  │ [Online] [Earnings] [Consultations] │
│  • Profile           │  │ [Rating] [Notifications Bell]   │   │
│  • Settings          │  └─────────────────────────────────┘   │
│                      │                                          │
│                      │  ┌─────────────────────────────────┐   │
│                      │  │  GRID LAYOUT:                   │   │
│                      │  │                                 │   │
│                      │  │  [Upcoming Consultations]       │   │
│                      │  │  [Recent Consultations]         │   │
│                      │  │  [Active Consultation Chat]     │   │
│                      │  │  [Notifications Panel]          │   │
│                      │  │  [Quick Actions]                │   │
│                      │  │                                 │   │
│                      │  └─────────────────────────────────┘   │
│                      │                                          │
└──────────────────────┴──────────────────────────────────────────┘
```

### **1. Top Stats Bar (Quick Overview)**

```
┌──────────────────────────────────────────────────────────────┐
│  🟢 Online    │  💰 Rp 450K    │  👥 3 Konsultasi    │  ⭐ 4.8  │
│  Status       │  Today Earnings │  In Progress       │  Rating │
│               │                │                     │         │
│  [Set Status] │                │  [View All]         │ [Bell]  │
│               │                │                     │ (3 new) │
└──────────────────────────────────────────────────────────────┘
```

**Components:**
- `DoctorStatusCard` - Current online status + quick toggle
- `TodayEarningsCard` - Today's earnings display
- `ActiveConsultationsCard` - Count + quick view all
- `RatingCard` - Average rating
- `NotificationBell` - With unread count

---

### **2. Main Content Grid**

Responsive grid layout dengan sections:

#### **Section A: Upcoming Consultations** (Top Left - 60% width)
```
┌─────────────────────────────────────────────┐
│ ⏰ Upcoming Consultations                    │
├─────────────────────────────────────────────┤
│                                             │
│ [Today - 2 consultations]                   │
│ ├─ 14:00 - Sarah (Pediatri)                │
│ │  └─ [Join Now] [Reschedule] [Cancel]    │
│ │                                          │
│ └─ 15:30 - Budi (Gizi)                    │
│    └─ [Join Now] [Reschedule] [Cancel]    │
│                                             │
│ [Tomorrow - 1 consultation]                 │
│ ├─ 10:00 - Dewi (Pediatri)                │
│    └─ [Join Now] [Reschedule] [Cancel]    │
│                                             │
│ [View Full Schedule]                        │
│                                             │
└─────────────────────────────────────────────┘
```

**Component: `UpcomingConsultationsWidget`**
- Real-time updates (Supabase Realtime)
- Quick action buttons
- Sorted by time
- Show next 5 consultations

---

#### **Section B: Active Consultation Chat** (Top Right - 40% width)
```
┌──────────────────────────┐
│ 💬 Active Consultation   │
├──────────────────────────┤
│                          │
│ Patient: Sarah (Pediatri)│
│ Time: 14:00 - 14:45 ⏱️   │
│ Status: Ongoing          │
│                          │
│ ┌──────────────────────┐│
│ │ Messages Area        ││
│ │                      ││
│ │ [Sarah]: Dok, bayi   ││
│ │         saya...      ││
│ │                      ││
│ │ [You]: Iya, silakan  ││
│ │        cerita detail  ││
│ │        nya...         ││
│ │                      ││
│ └──────────────────────┘│
│ ┌──────────────────────┐│
│ │ [📎] [Message...] →  ││
│ └──────────────────────┘│
│                          │
│ [Add Prescription]       │
│ [End Consultation]       │
│                          │
└──────────────────────────┘
```

**Component: `ActiveConsultationWidget`**
- Real-time chat display
- Shows current patient info
- Floating timer
- Quick actions (add prescription, end consultation)

---

#### **Section C: Recent Consultations** (Middle Left - 60% width)
```
┌─────────────────────────────────────────────┐
│ 📋 Recent Consultations                     │
├─────────────────────────────────────────────┤
│ Filter: [All] [Completed] [Cancelled]       │
│                                             │
│ ┌───────────────────────────────────────┐  │
│ │ Yesterday - 15:00                     │  │
│ │ Patient: Budi                         │  │
│ │ Status: ✅ Completed (45 min)         │  │
│ │ Earning: Rp 75K                       │  │
│ │ Rating: ⭐⭐⭐⭐⭐                      │  │
│ │ [View Chat] [View Prescription]       │  │
│ └───────────────────────────────────────┘  │
│                                             │
│ ┌───────────────────────────────────────┐  │
│ │ 2 days ago - 10:00                    │  │
│ │ Patient: Dewi                         │  │
│ │ Status: ✅ Completed (60 min)         │  │
│ │ Earning: Rp 100K                      │  │
│ │ Rating: ⭐⭐⭐⭐                       │  │
│ │ [View Chat] [View Prescription]       │  │
│ └───────────────────────────────────────┘  │
│                                             │
│ [Load More]                                 │
│                                             │
└─────────────────────────────────────────────┘
```

**Component: `RecentConsultationsWidget`**
- Show last 5 consultations
- With status, earnings, ratings
- Quick access to chat & prescriptions

---

#### **Section D: Notifications Panel** (Middle Right - 40% width)
```
┌──────────────────────────┐
│ 🔔 Notifications         │
│ [Mark all as read]       │
├──────────────────────────┤
│                          │
│ 🟢 NEW                   │
│ "New consultation        │
│  request from Rina"      │
│ 2 minutes ago            │
│ [View] [Accept] [Decline]│
│                          │
│ 💬 NEW                   │
│ "Sarah sent a message"   │
│ 5 minutes ago            │
│ [View]                   │
│                          │
│ 📧                       │
│ "Payment confirmed"      │
│ 1 hour ago               │
│ [View]                   │
│                          │
│ ⏰                       │
│ "Reminder: Consultation  │
│  in 30 minutes"          │
│ 10 hours ago             │
│ [Dismiss]                │
│                          │
│ [View All Notifications] │
│                          │
└──────────────────────────┘
```

**Component: `NotificationsPanel`**
- Show unread notifications
- Group by type
- Quick actions per notification
- Mark as read functionality

---

#### **Section E: Doctor Stats & Quick Stats** (Bottom - Full Width)
```
┌──────────────────────────────────────────────────────────────┐
│ 📊 Today's Statistics                                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  [Consultations]  [Earnings]  [Avg Rating]  [Success Rate]  │
│      3              Rp 225K       4.7 ⭐        100%          │
│                                                              │
│                                                              │
│ 📊 This Month Statistics                                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  [Total Consultations]  [Total Earnings]  [Avg Rating]     │
│           28                 Rp 4.2M         4.6 ⭐         │
│                                                              │
│                                                              │
│ 🎯 Quick Actions                                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  [Edit Profile] [Manage Schedule] [View Earnings]           │
│  [Settings] [Help & Support]                                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Component: `DoctorStatsSection`**
- Today & This month stats
- Quick action buttons

---

## 🔧 Backend Services

### **1. Consultation Service** (`src/lib/consultationService.ts`)

```typescript
import { supabase } from '@/lib/supabaseClient'

/**
 * Get upcoming consultations for doctor
 */
export async function getUpcomingConsultations(
  doctorId: string,
  limit: number = 5
) {
  const { data, error } = await supabase
    .from('consultations')
    .select(`
      id,
      scheduled_at,
      user_id,
      auth.users!user_id(id, email),
      status,
      title,
      duration_minutes,
      hourly_rate
    `)
    .eq('doctor_id', doctorId)
    .in('status', ['scheduled', 'ongoing'])
    .order('scheduled_at', { ascending: true })
    .limit(limit)

  if (error) throw error
  return data || []
}

/**
 * Get recent consultations for doctor
 */
export async function getRecentConsultations(
  doctorId: string,
  limit: number = 5
) {
  const { data, error } = await supabase
    .from('consultations')
    .select(`
      id,
      scheduled_at,
      ended_at,
      user_id,
      auth.users!user_id(id, email),
      status,
      duration_minutes,
      total_cost,
      rating,
      review,
      created_at
    `)
    .eq('doctor_id', doctorId)
    .in('status', ['completed', 'cancelled'])
    .order('ended_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

/**
 * Get active consultation (ongoing)
 */
export async function getActiveConsultation(doctorId: string) {
  const { data, error } = await supabase
    .from('consultations')
    .select(`
      id,
      scheduled_at,
      started_at,
      user_id,
      auth.users!user_id(id, email),
      status,
      title,
      hourly_rate,
      duration_minutes
    `)
    .eq('doctor_id', doctorId)
    .eq('status', 'ongoing')
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data || null
}

/**
 * Start consultation
 */
export async function startConsultation(consultationId: string) {
  const { error } = await supabase
    .from('consultations')
    .update({
      status: 'ongoing',
      started_at: new Date()
    })
    .eq('id', consultationId)

  if (error) throw error
}

/**
 * End consultation
 */
export async function endConsultation(
  consultationId: string,
  notes?: string
) {
  const { error } = await supabase
    .from('consultations')
    .update({
      status: 'completed',
      ended_at: new Date(),
      notes
    })
    .eq('id', consultationId)

  if (error) throw error
}

/**
 * Get daily earnings
 */
export async function getTodayEarnings(doctorId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('consultations')
    .select('total_cost')
    .eq('doctor_id', doctorId)
    .eq('status', 'completed')
    .gte('ended_at', today.toISOString())

  if (error) throw error

  const total = data?.reduce((sum, item) => sum + (item.total_cost || 0), 0) || 0
  return total
}

/**
 * Get monthly stats
 */
export async function getMonthlyStats(doctorId: string) {
  const today = new Date()
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)

  const { data, error } = await supabase
    .from('consultations')
    .select('id, total_cost, rating, status')
    .eq('doctor_id', doctorId)
    .gte('created_at', monthStart.toISOString())

  if (error) throw error

  const stats = {
    totalConsultations: data?.length || 0,
    completedConsultations: data?.filter(c => c.status === 'completed').length || 0,
    totalEarnings: data?.reduce((sum, item) => sum + (item.total_cost || 0), 0) || 0,
    avgRating: data && data.length > 0
      ? (data.reduce((sum, item) => sum + (item.rating || 0), 0) / data.filter(c => c.rating).length).toFixed(1)
      : 0
  }

  return stats
}
```

### **2. Notification Service** (`src/lib/notificationService.ts`)

```typescript
import { supabase } from '@/lib/supabaseClient'
import { sendEmailNotification } from '@/lib/emailService'

export type NotificationType = 
  | 'new_consultation'
  | 'message'
  | 'payment'
  | 'reminder'
  | 'review'
  | 'system'

/**
 * Create notification untuk doctor
 */
export async function createDoctorNotification(
  doctorId: string,
  {
    title,
    message,
    type,
    referenceId,
    actionUrl
  }: {
    title: string
    message: string
    type: NotificationType
    referenceId?: string
    actionUrl?: string
  }
) {
  const { data, error } = await supabase
    .from('doctor_notifications')
    .insert({
      doctor_id: doctorId,
      title,
      message,
      notification_type: type,
      reference_id: referenceId,
      action_url: actionUrl
    })
    .select()
    .single()

  if (error) throw error

  // Send email notification juga
  const doctor = await supabase
    .from('doctors')
    .select('email')
    .eq('id', doctorId)
    .single()

  if (doctor.data?.email) {
    await sendEmailNotification({
      to: doctor.data.email,
      title,
      message,
      actionUrl: actionUrl ? `${process.env.NEXT_PUBLIC_SITE_URL}${actionUrl}` : undefined
    })
  }

  return data
}

/**
 * Get unread notifications
 */
export async function getUnreadNotifications(doctorId: string) {
  const { data, error } = await supabase
    .from('doctor_notifications')
    .select('*')
    .eq('doctor_id', doctorId)
    .eq('is_read', false)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) throw error
  return data || []
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  const { error } = await supabase
    .from('doctor_notifications')
    .update({
      is_read: true,
      read_at: new Date()
    })
    .eq('id', notificationId)

  if (error) throw error
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(doctorId: string) {
  const { error } = await supabase
    .from('doctor_notifications')
    .update({
      is_read: true,
      read_at: new Date()
    })
    .eq('doctor_id', doctorId)
    .eq('is_read', false)

  if (error) throw error
}

/**
 * Delete notification
 */
export async function deleteNotification(notificationId: string) {
  const { error } = await supabase
    .from('doctor_notifications')
    .delete()
    .eq('id', notificationId)

  if (error) throw error
}
```

### **3. Email Service** (`src/lib/emailService.ts`)

```typescript
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export interface EmailNotificationOptions {
  to: string
  title: string
  message: string
  actionUrl?: string
  actionText?: string
}

/**
 * Send email notification
 */
export async function sendEmailNotification({
  to,
  title,
  message,
  actionUrl,
  actionText = 'View'
}: EmailNotificationOptions) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .message { margin: 15px 0; }
          .button { 
            display: inline-block; 
            background: #667eea; 
            color: white; 
            padding: 12px 24px; 
            border-radius: 4px; 
            text-decoration: none; 
            margin-top: 15px;
          }
          .footer { margin-top: 20px; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏥 GENTING</h1>
            <p>${title}</p>
          </div>
          <div class="content">
            <p>Halo Dokter,</p>
            <div class="message">
              ${message}
            </div>
            ${actionUrl ? `<a href="${actionUrl}" class="button">${actionText}</a>` : ''}
            <div class="footer">
              <p>Email ini dikirim karena ada aktivitas baru di akun GENTING Anda.</p>
              <p>Anda dapat mengatur preferensi notifikasi di pengaturan akun.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: title,
    html: htmlContent
  })
}

/**
 * Send reminder email
 */
export async function sendConsultationReminder(
  doctorEmail: string,
  patientName: string,
  consultationTime: Date
) {
  const timeString = new Date(consultationTime).toLocaleString('id-ID')

  await sendEmailNotification({
    to: doctorEmail,
    title: 'Reminder: Konsultasi Dimulai 15 Menit',
    message: `Anda memiliki konsultasi dengan <strong>${patientName}</strong> pada <strong>${timeString}</strong>.<br><br>Pastikan Anda siap untuk memulai konsultasi.`,
    actionUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/doctor`,
    actionText: 'Masuk ke Dashboard'
  })
}
```

### **4. Prescription Service** (`src/lib/prescriptionService.ts`)

```typescript
import { supabase } from '@/lib/supabaseClient'

export interface Medicine {
  name: string
  dosage: string
  frequency: string
  duration: string
}

export interface PrescriptionData {
  consultationId: string
  doctorId: string
  userId: string
  title: string
  description: string
  medicines: Medicine[]
  instructions: string
  validUntil?: Date
}

/**
 * Create prescription
 */
export async function createPrescription({
  consultationId,
  doctorId,
  userId,
  title,
  description,
  medicines,
  instructions,
  validUntil
}: PrescriptionData) {
  const { data, error } = await supabase
    .from('prescriptions')
    .insert({
      consultation_id: consultationId,
      doctor_id: doctorId,
      user_id: userId,
      title,
      description,
      medicines,
      instructions,
      valid_until: validUntil
    })
    .select()
    .single()

  if (error) throw error

  // Send notification to user
  const { createDoctorNotification } = await import('@/lib/notificationService')
  await createDoctorNotification(doctorId, {
    title: 'Resep Dibuat',
    message: `Anda telah membuat resep untuk konsultasi: ${title}`,
    type: 'system',
    referenceId: data.id
  })

  return data
}

/**
 * Get prescription by ID
 */
export async function getPrescription(prescriptionId: string) {
  const { data, error } = await supabase
    .from('prescriptions')
    .select('*')
    .eq('id', prescriptionId)
    .single()

  if (error) throw error
  return data
}

/**
 * Get prescriptions by consultation
 */
export async function getConsultationPrescriptions(consultationId: string) {
  const { data, error } = await supabase
    .from('prescriptions')
    .select('*')
    .eq('consultation_id', consultationId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Update prescription
 */
export async function updatePrescription(
  prescriptionId: string,
  updates: Partial<PrescriptionData>
) {
  const { error } = await supabase
    .from('prescriptions')
    .update(updates)
    .eq('id', prescriptionId)

  if (error) throw error
}

/**
 * Archive prescription
 */
export async function archivePrescription(prescriptionId: string) {
  await updatePrescription(prescriptionId, {
    status: 'archived'
  } as any)
}
```

### **5. Message Service** (`src/lib/messageService.ts`)

```typescript
import { supabase } from '@/lib/supabaseClient'

/**
 * Send message dalam consultation
 */
export async function sendMessage(
  consultationId: string,
  senderId: string,
  senderType: 'user' | 'doctor',
  message: string,
  messageType: 'text' | 'file' | 'prescription' | 'note' = 'text',
  fileUrl?: string,
  fileName?: string,
  fileSize?: number
) {
  const { data, error } = await supabase
    .from('consultation_messages')
    .insert({
      consultation_id: consultationId,
      sender_id: senderId,
      sender_type: senderType,
      message,
      message_type: messageType,
      file_url: fileUrl,
      file_name: fileName,
      file_size: fileSize
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Get consultation messages
 */
export async function getConsultationMessages(
  consultationId: string,
  limit: number = 50
) {
  const { data, error } = await supabase
    .from('consultation_messages')
    .select(`
      id,
      consultation_id,
      sender_id,
      sender_type,
      message,
      message_type,
      file_url,
      file_name,
      file_size,
      is_read,
      created_at,
      updated_at
    `)
    .eq('consultation_id', consultationId)
    .order('created_at', { ascending: true })
    .limit(limit)

  if (error) throw error
  return data || []
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(
  consultationId: string,
  readBy: string
) {
  const { error } = await supabase
    .from('consultation_messages')
    .update({ is_read: true })
    .eq('consultation_id', consultationId)
    .neq('sender_id', readBy)
    .eq('is_read', false)

  if (error) throw error
}

/**
 * Subscribe to real-time messages
 */
export function subscribeToConsultationMessages(
  consultationId: string,
  onNewMessage: (message: any) => void
) {
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
        onNewMessage(payload.new)
      }
    )
    .subscribe()

  return subscription
}
```

---

## 🎨 React Components

### **1. Doctor Dashboard Main** (`src/components/doctor/DoctorDashboard.tsx`)

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useUserRole } from '@/hooks/useUserRole'
import { getDoctorByUserId } from '@/lib/doctorService'
import { getActiveConsultation, getUpcomingConsultations, getRecentConsultations, getTodayEarnings, getMonthlyStats } from '@/lib/consultationService'
import { getUnreadNotifications } from '@/lib/notificationService'

// Components
import DoctorSidebar from '@/components/doctor/sidebar/DoctorSidebar'
import TopStatsBar from '@/components/doctor/dashboard/TopStatsBar'
import UpcomingConsultationsWidget from '@/components/doctor/dashboard/UpcomingConsultationsWidget'
import ActiveConsultationWidget from '@/components/doctor/dashboard/ActiveConsultationWidget'
import RecentConsultationsWidget from '@/components/doctor/dashboard/RecentConsultationsWidget'
import NotificationsPanel from '@/components/doctor/dashboard/NotificationsPanel'
import DoctorStatsSection from '@/components/doctor/dashboard/DoctorStatsSection'

export default function DoctorDashboard() {
  const { user } = useAuth()
  const { role } = useUserRole(user?.id)
  const [doctor, setDoctor] = useState(null)
  const [upcomingConsultations, setUpcomingConsultations] = useState([])
  const [activeConsultation, setActiveConsultation] = useState(null)
  const [recentConsultations, setRecentConsultations] = useState([])
  const [notifications, setNotifications] = useState([])
  const [todayEarnings, setTodayEarnings] = useState(0)
  const [monthlyStats, setMonthlyStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user || role !== 'doctor') return

    async function loadDashboardData() {
      try {
        // Load doctor profile
        const doctorData = await getDoctorByUserId(user.id)
        setDoctor(doctorData)

        if (doctorData) {
          // Load all dashboard data
          const [upcoming, active, recent, earnings, stats, notifs] = await Promise.all([
            getUpcomingConsultations(doctorData.id),
            getActiveConsultation(doctorData.id),
            getRecentConsultations(doctorData.id),
            getTodayEarnings(doctorData.id),
            getMonthlyStats(doctorData.id),
            getUnreadNotifications(doctorData.id)
          ])

          setUpcomingConsultations(upcoming)
          setActiveConsultation(active)
          setRecentConsultations(recent)
          setTodayEarnings(earnings)
          setMonthlyStats(stats)
          setNotifications(notifs)
        }
      } catch (error) {
        console.error('Error loading dashboard:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()

    // Set up real-time subscription untuk notifications
    const subscriptionNotif = supabase
      .channel('doctor_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'doctor_notifications',
          filter: `doctor_id=eq.${doctor?.id}`
        },
        (payload) => {
          setNotifications(prev => [payload.new, ...prev])
        }
      )
      .subscribe()

    return () => {
      subscriptionNotif.unsubscribe()
    }
  }, [user, role])

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (role !== 'doctor') {
    return <div>Unauthorized</div>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <DoctorSidebar doctor={doctor} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Stats Bar */}
        <TopStatsBar
          isOnline={true}
          todayEarnings={todayEarnings}
          activeConsultations={upcomingConsultations.length}
          avgRating={doctor?.rating || 0}
          unreadNotifications={notifications.filter(n => !n.is_read).length}
        />

        {/* Main Grid */}
        <div className="p-6 space-y-6">
          {/* Row 1: Upcoming & Active Chat */}
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <UpcomingConsultationsWidget consultations={upcomingConsultations} doctor={doctor} />
            </div>
            <div>
              {activeConsultation ? (
                <ActiveConsultationWidget consultation={activeConsultation} doctor={doctor} />
              ) : (
                <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
                  Tidak ada konsultasi aktif
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Recent Consultations & Notifications */}
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <RecentConsultationsWidget consultations={recentConsultations} />
            </div>
            <div>
              <NotificationsPanel notifications={notifications} />
            </div>
          </div>

          {/* Row 3: Stats */}
          <DoctorStatsSection doctor={doctor} stats={monthlyStats} />
        </div>
      </div>
    </div>
  )
}
```

### **2. Top Stats Bar** (`src/components/doctor/dashboard/TopStatsBar.tsx`)

```typescript
'use client'

import { useState } from 'react'
import { Bell, Heart, DollarSign, Users } from 'lucide-react'

interface TopStatsBarProps {
  isOnline: boolean
  todayEarnings: number
  activeConsultations: number
  avgRating: number
  unreadNotifications: number
}

export default function TopStatsBar({
  isOnline,
  todayEarnings,
  activeConsultations,
  avgRating,
  unreadNotifications
}: TopStatsBarProps) {
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false)

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        {/* Left: Status & Earnings */}
        <div className="flex items-center gap-8">
          {/* Status */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span className="text-sm font-medium">{isOnline ? 'Online' : 'Offline'}</span>
            <button className="text-xs text-blue-600 hover:text-blue-700 ml-2">
              [Set Status]
            </button>
          </div>

          {/* Earnings */}
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-xs text-gray-600">Today's Earnings</p>
              <p className="text-sm font-semibold">Rp {todayEarnings.toLocaleString('id-ID')}</p>
            </div>
          </div>

          {/* Active Consultations */}
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-xs text-gray-600">In Progress</p>
              <p className="text-sm font-semibold">{activeConsultations}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-xs text-gray-600">Rating</p>
              <p className="text-sm font-semibold">{avgRating.toFixed(1)} ⭐</p>
            </div>
          </div>
        </div>

        {/* Right: Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Bell className="w-6 h-6 text-gray-600" />
            {unreadNotifications > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
```

### **3. Active Consultation Widget** (`src/components/doctor/dashboard/ActiveConsultationWidget.tsx`)

```typescript
'use client'

import { useEffect, useState } from 'react'
import { subscribeToConsultationMessages, getConsultationMessages, sendMessage } from '@/lib/messageService'
import ConsultationTimer from '@/components/shared/ConsultationTimer'
import MessageBubble from '@/components/shared/MessageBubble'

interface ActiveConsultationWidgetProps {
  consultation: any
  doctor: any
}

export default function ActiveConsultationWidget({
  consultation,
  doctor
}: ActiveConsultationWidgetProps) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)

  useEffect(() => {
    if (!consultation?.id) return

    async function loadMessages() {
      try {
        const msgs = await getConsultationMessages(consultation.id)
        setMessages(msgs)
      } catch (error) {
        console.error('Error loading messages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()

    // Subscribe to new messages
    const subscription = subscribeToConsultationMessages(
      consultation.id,
      (newMsg) => {
        setMessages(prev => [...prev, newMsg])
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [consultation?.id])

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      await sendMessage(
        consultation.id,
        doctor.user_id,
        'doctor',
        newMessage
      )
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Active Consultation</h3>
        <p className="text-sm text-gray-600">Patient: {consultation.user_id}</p>
        <div className="mt-2">
          <ConsultationTimer startTime={consultation.started_at} />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.sender_type === 'doctor'}
          />
        ))}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            Send
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowPrescriptionModal(true)}
            className="px-3 py-2 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
          >
            + Prescription
          </button>
          <button
            type="button"
            className="px-3 py-2 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            End Consultation
          </button>
        </div>
      </form>

      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <PrescriptionModal
          isOpen={showPrescriptionModal}
          onClose={() => setShowPrescriptionModal(false)}
          consultationId={consultation.id}
          patientId={consultation.user_id}
        />
      )}
    </div>
  )
}
```

---

## 📁 Complete File Structure

```
src/
├── app/
│   ├── dashboard/
│   │   └── doctor/
│   │       ├── page.tsx (Main Dashboard)
│   │       ├── consultations/
│   │       │   └── [id]/
│   │       │       └── page.tsx (Full Consultation Room)
│   │       ├── schedule/
│   │       │   └── page.tsx (Schedule Management)
│   │       ├── profile/
│   │       │   └── page.tsx (Doctor Profile Settings)
│   │       ├── analytics/
│   │       │   └── page.tsx (Detailed Analytics)
│   │       └── settings/
│   │           └── page.tsx (Doctor Settings)
│
├── components/
│   ├── doctor/
│   │   ├── DoctorDashboard.tsx
│   │   ├── sidebar/
│   │   │   └── DoctorSidebar.tsx
│   │   ├── dashboard/
│   │   │   ├── TopStatsBar.tsx
│   │   │   ├── UpcomingConsultationsWidget.tsx
│   │   │   ├── ActiveConsultationWidget.tsx
│   │   │   ├── RecentConsultationsWidget.tsx
│   │   │   ├── NotificationsPanel.tsx
│   │   │   └── DoctorStatsSection.tsx
│   │   ├── consultation/
│   │   │   ├── ConsultationRoom.tsx
│   │   │   ├── ChatArea.tsx
│   │   │   ├── PatientInfoCard.tsx
│   │   │   ├── DoctorNotesSection.tsx
│   │   │   └── PrescriptionModal.tsx
│   │   └── common/
│   │       ├── DoctorCard.tsx
│   │       └── ConsultationCard.tsx
│   │
│   └── shared/
│       ├── ConsultationTimer.tsx
│       ├── MessageBubble.tsx
│       ├── RatingStars.tsx
│       ├── Modal.tsx
│       └── LoadingSpinner.tsx
│
├── hooks/
│   ├── useConsultationMessages.ts
│   ├── useDoctorProfile.ts
│   ├── useNotifications.ts
│   ├── useConsultationTimer.ts
│   └── useDoctorDashboard.ts
│
├── lib/
│   ├── consultationService.ts
│   ├── notificationService.ts
│   ├── messageService.ts
│   ├── prescriptionService.ts
│   ├── emailService.ts
│   ├── doctorService.ts
│   └── supabaseClient.ts
│
├── types/
│   ├── consultation.ts
│   ├── notification.ts
│   ├── prescription.ts
│   ├── message.ts
│   └── doctor.ts
│
└── styles/
    └── globals.css
```

---

## 🔄 Real-time Implementation Strategy

### **1. Doctor Notifications (Real-time)**
```typescript
// Subscribe to new notifications
supabase
  .channel('doctor_notifications')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'doctor_notifications',
      filter: `doctor_id=eq.${doctorId}`
    },
    (payload) => {
      // Show toast notification
      // Update notification list
    }
  )
  .subscribe()
```

### **2. Consultation Messages (Real-time)**
```typescript
// Subscribe to new messages dalam consultation
supabase
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
```

### **3. Consultation Status Changes (Real-time)**
```typescript
// Subscribe to consultation status changes
supabase
  .channel('consultations')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'consultations',
      filter: `doctor_id=eq.${doctorId}`
    },
    (payload) => {
      // Update consultation status in UI
      // Trigger notifications
    }
  )
  .subscribe()
```

---

## 📧 Notification Triggers

### **1. New Consultation Request**
```
Trigger: User membuat booking consultation
Email Subject: "Konsultasi Baru Ditunggu - [Patient Name]"
In-app: Badge di notification bell + panel entry
```

### **2. Message Received**
```
Trigger: User kirim message ke doctor
Email Subject: "[Patient Name] mengirim pesan"
In-app: Toast notification + message count
```

### **3. Consultation Starting Soon**
```
Trigger: 15 minutes sebelum consultation start
Email Subject: "Reminder: Konsultasi dalam 15 menit"
In-app: Toast notification
```

### **4. Payment Confirmed**
```
Trigger: User melakukan pembayaran
Email Subject: "Pembayaran Dikonfirmasi - Rp [Amount]"
In-app: Earning notification
```

### **5. Review/Rating Received**
```
Trigger: User memberi rating setelah consultation
Email Subject: "[Patient Name] memberikan rating ⭐"
In-app: Rating notification
```

---

## 🧪 Testing Checklist

- [ ] Dashboard loads dengan all data (stats, consultations, notifications)
- [ ] Real-time messages update without refresh
- [ ] Notifications appear in real-time
- [ ] Email notifications terkirim (test dengan mailtrap)
- [ ] File attachments upload & display correctly
- [ ] Prescriptions dapat dibuat & ditampilkan
- [ ] Chat pagination works untuk old messages
- [ ] Timer countdown akurat
- [ ] End consultation flow berfungsi
- [ ] Doctor can view recent consultations & prescriptions
- [ ] Mark notification as read works
- [ ] Search & filter consultations works
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Error handling untuk network failures
- [ ] Performance optimization (lazy loading, pagination)

---

## 🚀 Deployment Considerations

1. **Environment Variables:**
```
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
SMTP_SECURE=true
NEXT_PUBLIC_SITE_URL=
```

2. **Email Service Setup:**
   - Setup Nodemailer dengan SMTP credentials
   - Test dengan Mailtrap untuk development
   - Use SendGrid/AWS SES untuk production

3. **Supabase RLS Policies:**
   - Ensure row-level security untuk doctor data
   - Only doctor can view own consultations
   - Only doctor can access own notifications

4. **Performance:**
   - Add pagination untuk messages & consultations
   - Implement message virtual scrolling
   - Cache doctor profile data
   - Optimize Supabase queries dengan indexes

---

## 📝 Future Enhancements (Phase 2+)

1. **Video Call Integration** - Zoom/Jitsi integration
2. **Appointment Reminders** - Auto SMS/WhatsApp reminders
3. **Doctor Calendar View** - Calendar widget untuk schedule
4. **Billing & Payout** - Detailed earnings & payout management
5. **Patient Records** - Full medical history management
6. **Consultation Transcript** - Auto-generate summary
7. **Doctor Verification** - License verification system
8. **Advanced Analytics** - Charts & performance metrics

---

**Last Updated:** February 2026
**Status:** Ready for Development
**Priority:** HIGH - Core doctor functionality
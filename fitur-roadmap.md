 GENTING Roadmap Feature - Project Planning Guide
1. Project Overview
Feature Name: Roadmap Kehamilan & Pencegahan Stunting
Project Code: GENTING-ROADMAP-v1.0
Target Users: Ibu Hamil + Keluarga (Suami/Orang Tua) + Healthcare Professional
Purpose: Menyediakan panduan aktivitas terstruktur (olahraga & nutrisi) untuk mencegah stunting sejak masa kehamilan

2. Feature Scope & Core Functionality
2.1 Main Features
A. Roadmap Selection Interface

Dual-Category Navigation:

🏃 Kategori Olahraga - Exercise & Physical Activity
🥗 Kategori Nutrisi - Makan & Minum


Interactive Selection:

User dapat toggle antara kategori olahraga dan nutrisi
Clear visual indication kategori mana yang sedang active
Responsive design untuk mobile (primary platform)



B. Trimester-Based Personalization

Dynamic Content Based on Pregnancy Stage:

Trimester 1 (0-12 minggu): Focus pada stabilisasi & light activities
Trimester 2 (13-26 minggu): Moderate activities & balanced nutrition
Trimester 3 (27-40+ minggu): Low-impact activities & optimized nutrition


Implementation:

Calculate trimester based on last menstrual period (LMP) atau estimated due date
Automatically adjust roadmap difficulty & recommendations
Show warning jika aktivitas tidak cocok dengan trimester saat ini



C. Activity Roadmap Display

Roadmap Components:

Activity name & description
Duration & frequency (berapa menit, berapa kali seminggu)
Difficulty level: Beginner, Intermediate, Advanced
Benefits & explanation (mengapa activity ini penting)
Step-by-step instruction atau video tutorial link
Caution/warning notes (hal yang harus diperhatikan)
Tips untuk memulai


Visual Representation:

Timeline/progress card layout
Checklist untuk tracking completion
Color-coding berdasar difficulty level
Icons untuk setiap jenis activity



D. Progress Tracking & Milestone Celebration

User Progress Tracking:

Completion status untuk setiap activity (Not Started, In Progress, Completed)
Weekly/monthly progress visualization (chart/graph)
Consistency streak counter (berapa hari/minggu berturut-turut activity dilakukan)
Compliance rate percentage


Milestone System:

Celebrate ketika user mencapai milestones (e.g., "Week 1 Complete", "10 Activities Done")
Achievement badges/badges untuk motivasi
Positive reinforcement messages
Share achievement option (ke keluarga atau healthcare provider)



E. Reminder & Notification System

Smart Reminders:

Set reminder untuk setiap scheduled activity
Configurable notification timing (1 hari sebelum, pagi hari, custom time)
Push notifications (jika app mobile) atau email reminders


Notification Types:

Activity reminder: "Waktu untuk olahraga pagi hari!"
Missed activity alert: "Kamu melewatkan activity kemarin, yuk lakukan hari ini"
Milestone celebration: "Selamat! Kamu sudah konsisten 2 minggu!"
Doctor check-in prompt: "Saatnya konsultasi dengan dokter tentang progress mu"



F. Tips & Benefit Explanation

For Each Activity:

Science-backed benefits (mengapa activity ini penting untuk ibu hamil & calon bayi)
Specific benefits untuk pencegahan stunting
Myth-busting information (hal-hal yang sering disalahpahami)
Real success stories dari ibu hamil lain


Additional Resources:

Link ke artikel edukasi (dari fitur Edukasi di GENTING)
Video tutorial atau demonstrasi
FAQ section untuk activity tertentu



G. Difficulty Level System

3-Level Progression:

Beginner: Aman untuk semua trimester, minimal equipment, mudah dipahami
Intermediate: Slightly more challenging, requires basic fitness level
Advanced: Higher intensity, untuk ibu yang sudah fit sebelum hamil


Adaptive Difficulty:

Default difficulty berdasar fitness level input saat onboarding
User dapat upgrade/downgrade sesuai kemampuan
System recommends difficulty adjustment based on completion rate



H. Health Data Integration (Optional)

Wearable Device Support:

Connect dengan fitness tracker (Apple Health, Google Fit, Fitbit)
Auto-track steps, calories burned, heart rate
Sync data ke roadmap progress


Manual Health Metrics:

Weight tracking (input manual setiap minggu)
Blood pressure monitoring (jika tersedia)
Nutrition intake logging


Integration Approach:

Start dengan manual tracking dulu
Wearable integration bisa fase kedua (MVP jangan include)




3. User Stories & Use Cases
Story 1: Ibu Hamil Membuat Roadmap Pertama Kali
AS: Ibu hamil (Trimester 2)
I WANT TO: Mendapatkan personalized roadmap untuk olahraga & nutrisi
SO THAT: Saya tahu apa yang harus saya lakukan untuk cegah stunting
Acceptance Criteria:

 App meminta input LMP/due date saat pertama kali
 App menampilkan rekomendasi activities sesuai trimester
 User dapat memilih kategori olahraga atau nutrisi
 User melihat 5-7 recommended activities per kategori

Story 2: Ibu Hamil Tracking Progress Mingguan
AS: Ibu hamil
I WANT TO: Melihat progress saya minggu ini dan streak konsistensi
SO THAT: Saya termotivasi untuk terus konsisten
Acceptance Criteria:

 Dashboard menampilkan % completion untuk minggu ini
 Ada visual chart untuk weekly progress
 Consistency streak ditampilkan dengan badge
 User mendapat congratulatory message ketika milestone tercapai

Story 3: Suami/Keluarga Monitor Progress Ibu
AS: Suami atau keluarga ibu hamil
I WANT TO: Melihat progress roadmap ibu hamil
SO THAT: Saya bisa support dan motivate ibu hamil
Acceptance Criteria:

 Ada fitur "invite family member" dengan share link/QR code
 Family member bisa view progress (read-only) tapi tidak bisa edit
 Notification untuk family member ketika ibu reach milestone
 Family member bisa send encouragement message

Story 4: Healthcare Provider Monitoring Pasien
AS: Dokter/Bidan/Healthcare Professional
I WANT TO: Monitor patient's compliance dengan roadmap
SO THAT: Saya bisa lihat progress dan adjust recommendations
Acceptance Criteria:

 Doctor bisa lihat patient compliance rate & history
 Ada export/report feature untuk dibawa ke clinic
 Doctor bisa add custom notes/adjustments ke roadmap
 Secure access dengan patient consent

Story 5: Menerima Reminder Aktivitas
AS: Ibu hamil
I WANT TO: Menerima reminder untuk aktivitas saya
SO THAT: Saya tidak lupa dan tetap konsisten
Acceptance Criteria:

 User dapat set custom reminder time
 Reminder sent via push notification (mobile) atau email
 User dapat snooze/skip reminder dengan reason
 Missed activity alert jika tidak completed dalam 24 jam


4. Technical Requirements
4.1 Frontend Stack

Framework: React/React Native (untuk web & mobile)
State Management: Redux atau Context API
UI Components: Material-UI, Ant Design, atau custom component library
Charts/Graphs: Chart.js, Recharts, atau D3.js
Authentication: JWT atau OAuth integration dengan existing system

4.2 Backend Stack

API Framework: Node.js (Express) atau Python (Django/FastAPI)
Database: PostgreSQL (relational) atau MongoDB (flexible schema)
Caching: Redis untuk caching roadmap templates & user progress
Job Queue: For scheduled reminders (Bull, Celery)
File Storage: AWS S3 atau Firebase Storage untuk video/image

4.3 Mobile Integration (Future)

Push Notifications: Firebase Cloud Messaging (FCM) atau OneSignal
Health Data: HealthKit (iOS), Google Fit (Android)
Offline Mode: Service worker atau local database sync

4.4 Security & Privacy

Data Protection:

Encrypt health data at rest & in transit
HIPAA/GDPR compliance (jika applicable)
Secure API endpoints dengan rate limiting


Access Control:

Role-based access: Patient, Family Member, Healthcare Provider
Consent management untuk data sharing
Audit logs untuk tracking data access




5. Database Schema (Simplified)
5.1 Core Tables
Users
├── user_id (PK)
├── email
├── phone
├── user_type (patient, family, healthcare_provider)
├── created_at
└── updated_at

Pregnancies
├── pregnancy_id (PK)
├── user_id (FK)
├── lmp_date (Last Menstrual Period)
├── due_date (Estimated)
├── current_trimester
├── fitness_level (beginner, intermediate, advanced)
├── created_at
└── updated_at

RoadmapActivities
├── activity_id (PK)
├── activity_name
├── category (exercise, nutrition)
├── description
├── benefits
├── difficulty_level (1, 2, 3)
├── min_trimester (mulai dari trimester berapa)
├── max_trimester (sampai trimester berapa, null = semua)
├── duration_minutes
├── frequency_per_week
├── instructions (JSON - steps)
├── tips
├── warnings
├── video_url
├── created_at
└── updated_at

UserRoadmapProgress
├── progress_id (PK)
├── pregnancy_id (FK)
├── activity_id (FK)
├── status (not_started, in_progress, completed)
├── completion_date
├── notes (user notes)
├── streak_count (hari/minggu berturut-turut)
├── last_completed_date
├── created_at
└── updated_at

Reminders
├── reminder_id (PK)
├── pregnancy_id (FK)
├── activity_id (FK)
├── reminder_type (push, email, sms)
├── scheduled_time
├── is_sent
├── created_at
└── updated_at

FamilyAccess
├── access_id (PK)
├── pregnancy_id (FK)
├── family_member_user_id (FK)
├── access_level (view_only, view_and_comment)
├── created_at
└── updated_at

HealthcareTasks (for doctors/healthcare providers)
├── task_id (PK)
├── pregnancy_id (FK)
├── healthcare_provider_id (FK)
├── task_description
├── custom_activity (JSON)
├── recommended_difficulty
├── notes
├── created_at
└── updated_at

6. UI/UX Considerations
6.1 Design Principles

Simplicity First: Minimal cognitive load untuk ibu hamil yang mungkin tired/busy
Accessibility: Large touch targets, clear typography, high contrast
Localization: Indonesian language primary, consider local context
Motivational Design: Positive tone, celebration of small wins, no judgment

6.2 Key Screens to Design
Screen 1: Roadmap Category Selection
┌─────────────────────────────────┐
│  GENTING - Roadmap Saya         │
│  Trimester 2 (Minggu 18)        │
├─────────────────────────────────┤
│                                 │
│  Pilih Kategori Roadmap:       │
│                                 │
│  ┌──────────────┐  ┌──────────┐│
│  │    🏃        │  │  🥗      ││
│  │  Olahraga   │  │ Nutrisi  ││
│  │             │  │          ││
│  │  5 Activities│  │ 6 Topics ││
│  └──────────────┘  └──────────┘│
│                                 │
│  Completed: 3/11 (27%)          │
│  Streak: 5 hari 🔥             │
└─────────────────────────────────┘
Screen 2: Activity Roadmap List
┌─────────────────────────────────┐
│  GENTING - Olahraga Saya        │
│  ← Back                         │
├─────────────────────────────────┤
│ Trimester 2 Recommendations     │
├─────────────────────────────────┤
│                                 │
│ 1. ✓ Jalan Kaki [Completed]    │
│    ⏱️ 30 min | 5x/week          │
│    Difficulty: Beginner ⭐      │
│                                 │
│ 2. ○ Prenatal Yoga [In Progress]│
│    ⏱️ 45 min | 3x/week          │
│    Difficulty: Beginner ⭐      │
│    Progress: 2/3 done          │
│                                 │
│ 3. ○ Swimming [Not Started]     │
│    ⏱️ 30 min | 2x/week          │
│    Difficulty: Intermediate ⭐⭐│
│    📋 Tips & Benefits           │
│                                 │
└─────────────────────────────────┘
Screen 3: Activity Detail & Instructions
┌─────────────────────────────────┐
│  Prenatal Yoga                  │
│  ← Back                         │
├─────────────────────────────────┤
│ Duration: 45 min | Frequency: 3x│
│ Difficulty: Beginner ⭐         │
│ Status: In Progress (2/3 done) │
├─────────────────────────────────┤
│                                 │
│ 💡 MANFAAT:                     │
│ • Mengurangi back pain          │
│ • Meningkatkan flexibility      │
│ • Mempersiapkan untuk labor     │
│ • Manfaat untuk bayi: [show more]
│                                 │
│ ⚠️ PERINGATAN:                  │
│ • Hindari posisi telungkup      │
│ • Stop jika ada cramping       │
│                                 │
│ 📺 Video Tutorial [Play]        │
│                                 │
│ 📝 LANGKAH DEMI LANGKAH:        │
│ 1. Mulai dengan child pose...   │
│ 2. Cat-cow stretch...          │
│ 3. Modified downward dog...    │
│                                 │
│ ✓ Mark as Completed  [Button]  │
│                                 │
└─────────────────────────────────┘
Screen 4: Progress Dashboard
┌─────────────────────────────────┐
│  GENTING - Progress Ku          │
│  Minggu 18 (Trimester 2)        │
├─────────────────────────────────┤
│                                 │
│  📊 PROGRESS MINGGU INI:        │
│  Olahraga: 3/5 (60%) ████░     │
│  Nutrisi: 4/6 (67%) ████░      │
│  Total: 7/11 (64%) ████░       │
│                                 │
│  🔥 KONSISTENSI:               │
│  5 hari berturut-turut! 🎉     │
│  Target minggu ini: 7 hari      │
│                                 │
│  📈 MONTHLY VIEW: [Line Chart]  │
│  Week 1: 45%  Week 2: 60%      │
│  Week 3: 75%  Week 4: 64%      │
│                                 │
│  🏆 ACHIEVEMENT:               │
│  ✓ First Week Pro              │
│  ✓ 10 Activities Done          │
│  ○ 30 Days Streak (soon!)      │
│                                 │
│  [Share Progress] [Download]   │
│                                 │
└─────────────────────────────────┘

7. API Endpoints Planning
7.1 Authentication
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - User login
POST   /api/auth/refresh           - Refresh token
POST   /api/auth/logout            - User logout
7.2 Pregnancy & Profile
POST   /api/pregnancies            - Create pregnancy profile
GET    /api/pregnancies/:id        - Get pregnancy detail
PUT    /api/pregnancies/:id        - Update pregnancy info
DELETE /api/pregnancies/:id        - Delete pregnancy profile
GET    /api/pregnancies/:id/current-trimester - Get current trimester
7.3 Roadmap Activities
GET    /api/activities             - Get all activities (with filters)
GET    /api/activities/:id         - Get activity detail
GET    /api/pregnancies/:id/recommended-activities - Get personalized recommendations
GET    /api/activities?category=exercise&trimester=2 - Filter activities
7.4 User Progress Tracking
GET    /api/pregnancies/:id/progress - Get all progress for pregnancy
GET    /api/pregnancies/:id/progress/summary - Get progress summary (dashboard)
POST   /api/pregnancies/:id/progress - Create/update progress entry
PUT    /api/progress/:progressId   - Update specific progress entry
GET    /api/pregnancies/:id/progress/analytics - Get detailed analytics
GET    /api/pregnancies/:id/streak - Get current streak info
7.5 Reminders
POST   /api/reminders              - Create reminder
GET    /api/reminders/:pregnancyId - Get all reminders
PUT    /api/reminders/:reminderId  - Update reminder
DELETE /api/reminders/:reminderId  - Delete reminder
POST   /api/reminders/:reminderId/send - Trigger manual send
7.6 Family & Access Management
POST   /api/pregnancies/:id/invite-family - Invite family member
GET    /api/pregnancies/:id/family-members - List family members
DELETE /api/pregnancies/:id/family-members/:userId - Remove access
PUT    /api/pregnancies/:id/family-members/:userId - Update access level
7.7 Healthcare Provider
POST   /api/pregnancies/:id/assign-provider - Assign healthcare provider
GET    /api/provider/patients      - Get list of patients (for provider)
GET    /api/pregnancies/:id/health-summary - Full health summary for provider
POST   /api/pregnancies/:id/provider-notes - Add provider notes
7.8 Milestones & Achievements
GET    /api/pregnancies/:id/achievements - Get all achievements
POST   /api/pregnancies/:id/achievements/:achievementId/claim - Claim achievement
GET    /api/pregnancies/:id/milestones - Get all milestones for pregnancy
7.9 Reports & Export
GET    /api/pregnancies/:id/report/pdf - Generate PDF report
GET    /api/pregnancies/:id/report/csv - Export progress as CSV
GET    /api/pregnancies/:id/report/health-summary - Health summary report

8. Development Phases & Timeline
Phase 1: MVP (4-6 weeks)
Scope: Core roadmap functionality

 User authentication & pregnancy profile
 Basic roadmap activity display (olahraga & nutrisi)
 Simple progress tracking (mark as done/not done)
 Trimester-based content filtering
 Basic reminder system (push notification setup)

Deliverables:

Working web app (desktop & mobile responsive)
API endpoints untuk core features
Basic UI sesuai design system GENTING

Testing: Unit tests + basic E2E testing

Phase 2: Enhancement (3-4 weeks)
Scope: Add engagement & tracking features

 Detailed progress dashboard & analytics
 Difficulty level system & personalization
 Tips & benefit explanation per activity
 Milestone/achievement system
 Better reminder system (customizable timing)

Deliverables:

Enhanced progress tracking UI
Analytics dashboard
Achievement badges & gamification
Advanced reminder management

Testing: Comprehensive testing + user feedback

Phase 3: Social & Sharing (2-3 weeks)
Scope: Family involvement & sharing features

 Family member access & invitation
 Share progress feature
 Healthcare provider dashboard
 Progress reports (PDF/CSV export)

Deliverables:

Family access management
Report generation
Provider dashboard
Sharing features

Testing: UAT dengan actual users

Phase 4: Health Integration (Ongoing)
Scope: Wearable & health data integration

 Fitness tracker integration (Apple Health, Google Fit)
 Health metrics dashboard
 Manual health data logging

Deliverables:

Health data sync system
Extended dashboard dengan health metrics
Integration documentation

Testing: Integration testing dengan devices

9. Success Metrics & KPIs
User Engagement

 Daily Active Users (DAU) - Target: 70% pregnant users
 Weekly Active Users (WAU) - Target: 85%
 Roadmap completion rate - Target: >60% activities completed per week
 Consistency streak average - Target: 14+ days

Health Outcomes (Long-term)

 Stunting incidence reduction in user cohort
 Gestational weight gain improvement
 Nutritional intake improvement
 Physical activity increase

User Satisfaction

 App Rating - Target: >4.5/5 stars
 User retention - Target: 80% after 1 month, 60% after 3 months
 NPS Score - Target: >50
 Feature usefulness rating - Target: >4/5

Compliance & Safety

 User safety incident rate - Target: Zero serious incidents
 Data breach incidents - Target: Zero
 HIPAA/Privacy compliance - Target: 100%


10. Risk Assessment & Mitigation
Risk 1: Low User Adoption
Likelihood: Medium | Impact: High
Mitigation:

Conduct user research & testing before launch
Integrate with existing GENTING features
Build strong onboarding flow
Regular user feedback loop

Risk 2: Data Privacy & Security
Likelihood: Low | Impact: Critical
Mitigation:

Implement encryption & secure protocols
Regular security audits
HIPAA compliance from day 1
Clear privacy policy & user consent

Risk 3: Content Accuracy (Health-related)
Likelihood: Medium | Impact: High
Mitigation:

Partner dengan medical experts untuk content review
Regular content audits
Disclaimer & professional consultation emphasis
Integration dengan doctor chat feature

Risk 4: Technical Performance
Likelihood: Medium | Impact: Medium
Mitigation:

Load testing sebelum launch
CDN untuk asset delivery
Database optimization & caching strategy
Monitoring & alerting setup

Risk 5: Wearable Integration Complexity
Likelihood: High | Impact: Low
Mitigation:

Make wearable integration optional (Phase 4)
Start dengan manual tracking (MVP)
Partner dengan wearable providers for support


11. Resources & Team Requirements
Team Composition

1x Product Manager - Oversee product vision & requirements
2x Backend Engineers - API development, database design
2x Frontend Engineers - Web & mobile UI development
1x UI/UX Designer - Design system & user experience
1x QA Engineer - Testing & quality assurance
1x DevOps Engineer - Infrastructure & deployment (shared)

External Resources

Medical Content Consultant - Validate health information
Security Consultant - HIPAA compliance & data security
User Testers - Actual pregnant women for UAT


12. Documentation & Support
Developer Documentation

API documentation (Swagger/OpenAPI)
Database schema documentation
Component library documentation
Deployment & CI/CD guide

User Documentation

In-app help & tutorials
FAQ section
Video guides untuk activities
Contact support form

Medical Documentation

Content source references
Expert review certifications
Safety guidelines
Contraindications list


13. Future Enhancement Ideas

AI-Powered Personalization: Machine learning untuk personalize recommendations based on user behavior
Community Features: Forum atau group chat antara ibu hamil untuk support
Wearable Sync: Full integration dengan fitness trackers & health devices
Nutrition Tracking: Detailed nutrition logging & meal planning
Mental Health Integration: Stress management & mental wellbeing tracking
Integration dengan Hospital/Clinic: Direct data sharing dengan healthcare facility
Multi-language Support: Expand beyond Indonesian
Offline Mode: Works offline dengan sync ketika online
AR Features: Augmented reality untuk proper exercise form
Voice Commands: Voice-activated reminders & progress logging


14. Getting Started Checklist
Before Development

 Finalize design mockups & user flows
 Set up development environment
 Create project structure & git repository
 Establish coding standards & conventions
 Set up CI/CD pipeline

Initial Development Setup

 Backend API boilerplate
 Frontend project scaffold
 Database setup & migrations
 Authentication system
 Basic API endpoints for activities

Pre-Launch Checklist

 Complete feature development
 Comprehensive testing (unit, integration, E2E)
 Security audit & penetration testing
 Medical content review
 User acceptance testing
 Performance optimization
 Deployment & production setup
 Monitoring & alerting setup
 Documentation complete


15. Contact & Support
Product Owner: [Your Name]
Tech Lead: [Tech Lead Name]
Medical Consultant: [Doctor/Healthcare Expert]
Support Email: support@genting-app.id

Last Updated: February 10, 2025
Version: 1.0 (MVP Planning)
Status: Ready for Development
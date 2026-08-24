# School Teacher Application

An ultra-premium, professional, feature-rich React Native & Expo mobile/web application designed for school teachers and educators.

## 🚀 Live Vercel Deployment

This application is configured for seamless deployment on Vercel:

- **Framework Preset**: Expo / Next.js / React Native Web
- **Build Command**: `npx expo export -p web`
- **Output Directory**: `dist`

### Vercel One-Click Deploy Setup
1. Push repository to GitHub/GitLab.
2. Import project into Vercel Dashboard.
3. Vercel automatically detects `vercel.json` and builds the static web application.

---

## 📁 Directory Structure

```text
school-teacher-app/
├── app/                  # Expo Router / Application Pages & Routes
│   ├── (tabs)/           # Navigation Tabs (Home, Assignments, Homework, CBTS, More)
│   ├── assignment/       # Assignment Features & AI Tools
│   ├── cbts/             # CBTS & Question Bank Portals
│   ├── homework/         # Homework Management
│   └── more/             # Exam Hub, Attendance, Salary, Timetable, AI Toolkit
├── components/           # Reusable Modular UI Components
│   ├── common/           # Header, Cards, Badges, Buttons, SearchBar, EmptyState
│   ├── home/             # Dashboard Widgets & Quick Actions
│   ├── assignments/      # Assignment Filters & Cards
│   └── annotation/       # Image Annotator, Canvas & Pins
├── constants/            # Colors, Spacing, Typography & Navigation Config
├── hooks/                # Custom React Hooks
├── services/             # API & Authentication Services
├── store/                # Application State Management
├── types/                # TypeScript Interfaces & Definitions
├── utils/                # Date, Validation & Helper Utilities
└── vercel.json           # Vercel Production Build Deployment Config
```

---

## 🛠️ Features & Modules

- 🎓 **Exam Management System**:
  - Exam Schedule View (14 Web Fields)
  - Mark Exam Attendance (Filter Criteria, Attendance Toggles, Attend All)
  - Exam Marks Portal (Dynamic Grade & Remark Badges)
  - Exam Term Mark & Final Exam Portal (Live Auto-Calculating Percentage)
  - Exam Report Card Portal (Official Student Performance Card & Print Report)

- 🤖 **AI Teacher Toolkit**:
  - MCQ Builder & AI Speaking Buddy
  - Lesson Plan & Presentation Generator
  - Worksheet & Q&A Builder
  - AI Assistant Chatbot

- 📊 **Teacher Operations**:
  - Student Roster & Mark Attendance
  - Timetable & Salary Ledger
  - Issues & Complaints Portal

---

## ⚙️ Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Start Expo dev server
npm start

# 3. Export for web build test
npm run web
```

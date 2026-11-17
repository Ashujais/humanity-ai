# 🌟 Humanity AI – Executive & Assistant Email Management Platform
> **AI Full-Stack Engineer Intern Assignment**  
> *A modern, intelligent email management dashboard connecting personal assistants and their clients with autonomous AI triage.*

---

## 🎯 Executive Summary & Product Vision

Personal assistants often manage multiple responsibilities and a large volume of emails on behalf of their executive clients. A critical everyday challenge is **identifying reply responsibility**: *Did the client read an email with the intent to reply personally, or do they expect their assistant to handle it?*

**Humanity AI** solves this problem by using an intelligent AI triage engine that analyzes full email threads, sender context, financial stakes, deadlines, and action items to automatically assign reply responsibility into three actionable classes:
1. **🤖 Assistant to Reply**: Meeting coordination, calendar rescheduling, logistics, vendor documentation (W-9, ACH), and routine administrative communication.
2. **👔 Client to Reply**: High-stakes business decisions, term sheets, cap table approvals, wire transfer authorizations, board resolutions, and VIP speaking requests.
3. **☕ No Reply Needed**: Automated transactional alerts, receipts, newsletters, and concluded threads.

The platform provides a **Dual Connected Experience**:
- **Assistant Dashboard (Sarah Jenkins)**: A full-power command center with high-density metrics, conversation history, 1-click classification overrides, tone-customizable AI reply drafting, and an intelligent "Ask Copilot" assistant.
- **Client Executive View (David Sterling)**: An ultra-clean, minimalist portal displaying **only** emails requiring David's personal decision, highlighting **"Why Your Decision is Needed"**, with 1-click actions: **Mark Handled**, **Delegate to Sarah**, or **Approve AI Draft**.
- **Bidirectional Sync**: Actions taken by the client in their view instantly reflect on the assistant's dashboard.

---

## 🛠️ Architecture & Tech Stack (MERN)

The application is architected around the **MERN** stack with zero-friction startup:

| Layer | Technology | Highlights |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite 5 | Tailwind CSS, Lucide Icons, Framer Motion, Canvas Confetti |
| **Backend** | Node.js + Express.js | REST API, CORS, Modular Router, Static Client Serving |
| **Database** | MongoDB / Hybrid Store | Supports MongoDB via Mongoose with automatic fallback to persistent in-memory data store for zero-setup execution |
| **AI Engine** | Gemini 1.5 Flash + Semantic NLP | Live Google Gemini API integration with high-precision local heuristic NLP fallback for 100% offline reliability |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+ or v20+)
- npm (v9+)

### 1. Clone & Install
```bash
git clone https://github.com/your-username/humanity-ai.git
cd humanity-ai
npm run install:all
```

### 2. Run Full-Stack Development Environment
To run both the Express backend (Port 5000) and the Vite frontend (Port 5173) concurrently:
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 3. Or Run in Unified Production Mode
The Express server is configured to serve the production-built React frontend and API on a single port:
```bash
npm run build
npm start
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser.

---

## 💡 Key User Journeys & Core Capabilities

### 1. Onboarding & Email Connection
- **Product Tour**: Interactive onboarding wizard introducing the core problem, AI classification model, and dual-mode interface.
- **OAuth Connection Flow**: Connect Google Workspace (Gmail) or Microsoft 365 (Outlook) accounts with simulated consent screens, permission scopes, and real-time synchronization progress.
- **Multi-Account Switching**: Manage multiple client inboxes (e.g., David Sterling - CEO, Elena Rostova - Partner).

### 2. Assistant Dashboard (Sarah's View)
- **5-Second Glanceability Metrics**: Immediate counters for Assistant to Reply, Client to Reply, Action Required, Waiting for Response, and Upcoming Meetings.
- **Smart Inbox Segmentation**: Filter by AI responsibility, unread status, pending actions, starred priority, and archive.
- **Full Conversation History**: Multi-turn thread timeline with sender verification badges, dates, CC recipients, and downloadable attachments.

### 3. Automatic AI Reply Responsibility & Manual Overrides
- **Color-Coded Visual Indicators**: Prominent badges on both the list view and conversation header with confidence percentage (e.g., *98% AI Confidence*).
- **Reasoning Explanation**: Clear narrative explaining *why* the email was classified (e.g., *"Involves executive financial decision or capital allocation ($140,000) requiring CEO authorization"*).
- **One-Click Manual Override**: Dropdown to change classification at any moment (logs override author and updates live counts).

### 4. Minimalistic Client-Facing View (David's View)
- **Executive Clarity**: Shows **only** emails requiring David's personal decision.
- **"Why Your Response is Needed"**: High-visibility callout box clarifying the exact reason for the executive's attention.
- **Three Core Actions**:
  1. **Mark Handled**: Marks thread complete with celebratory confetti feedback.
  2. **Delegate to Sarah**: 1-click handoff with optional quick notes (e.g., *"Decline politely"* or *"Push to next Friday"*).
  3. **Approve AI Reply**: Inspects pre-drafted executive reply and sends with 1 click.

### 5. Live Simulation Playground ("Simulate Incoming Email")
- Evaluators can test live AI classification in real time!
- Choose from 4 realistic scenario presets or write a custom subject and body.
- Watch the AI analyze the text, extract entities, compute confidence scores, and route the email into the appropriate inbox queue.

### 6. AI Smart Reply Composer
- Choose from 5 distinct executive tones: *Professional & Confident*, *Warm & Accommodating*, *Short & Executive*, *Polite Decline*, or *Reschedule*.
- Context-aware reply generation with inline review and editing before sending.

### 7. AI Inbox Copilot ("Ask Copilot")
- Conversational assistant drawer with one-click prompt suggestions:
  - *"Show me emails that need my attention."*
  - *"Which emails require the client's attention?"*
  - *"What am I waiting for a response on?"*
  - *"Summarize this conversation."*
  - *"Why has this email been assigned to the client?"*
  - *"Draft a reply to this conversation."*

### 8. Calendar & Meetings Extraction
- Automatic extraction of meeting proposals, Zoom links, and dates into a dedicated **Meetings & Invites** view.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | System health, database status, and AI engine status |
| `GET` | `/api/accounts` | List connected client accounts with sync status |
| `POST` | `/api/accounts` | Connect new email account (Google / Microsoft) |
| `POST` | `/api/accounts/:id/sync` | Trigger synchronization for an account |
| `GET` | `/api/emails` | Query emails with filtering (`segment`, `responsibility`, `search`) |
| `GET` | `/api/emails/:id` | Fetch complete email thread with message turns |
| `PATCH` | `/api/emails/:id/classification` | Manually override AI responsibility (`type`, `reason`) |
| `PATCH` | `/api/emails/:id/status` | Update status (`handled`, `delegated_to_assistant`, `isImportant`) |
| `POST` | `/api/emails/:id/messages` | Send approved reply message to thread |
| `POST` | `/api/emails/simulate` | **Simulate incoming email with live AI classification** |
| `POST` | `/api/ai/draft` | Generate AI reply draft with specific tone |
| `POST` | `/api/ai/copilot` | Conversational inbox search and AI assistant query |
| `POST` | `/api/reset` | Reset demo data to clean initial state |

---

## 📂 Project Directory Structure

```
Humanity_AI/
├── package.json               # Root scripts (install, build, dev, start)
├── start-dev.js               # Concurrently spawns client and server
├── .gitignore                 # Excludes node_modules, dist, logs
├── server/
│   ├── package.json           # Express, Mongoose, CORS, dotenv
│   └── src/
│       ├── server.js          # Express app entry & static serving
│       ├── config/db.js       # MongoDB connection & fallback store
│       ├── data/seedData.js   # Realistic executive email conversations
│       ├── models/store.js    # Data store & operations adapter
│       ├── routes/api.js      # REST API endpoints
│       └── services/aiEngine.js # AI classification & reply engine
└── client/
    ├── package.json           # React 19, Tailwind CSS, Lucide, Vite 5
    ├── vite.config.js         # Vite configuration with /api proxy
    ├── tailwind.config.js     # Custom design system & executive tokens
    └── src/
        ├── main.jsx           # React DOM root
        ├── App.jsx            # Main app coordinator & role state
        ├── index.css          # Tailwind base & custom animations
        ├── api/emailApi.js    # API service client
        └── components/
            ├── Header.jsx              # Role switcher & sync status
            ├── Sidebar.jsx             # AI responsibility segments
            ├── MetricsOverview.jsx     # 5-second glance KPI cards
            ├── EmailList.jsx           # Filterable email stream
            ├── EmailDetail.jsx         # Conversation view & AI composer
            ├── ClientView.jsx          # Minimalist executive portal
            ├── SimulateEmailModal.jsx  # Live AI ingestion playground
            ├── ConnectAccountModal.jsx # OAuth connection flow
            ├── OnboardingModal.jsx     # Product tour & vision
            ├── CopilotDrawer.jsx       # Conversational AI assistant
            └── MeetingsCalendarView.jsx# Extracted calendar invites
```

---

## 🎬 Walkthrough Video Script Suggestion (For Submission)

1. **Introduction (0:00 - 0:45)**:
   - Introduce the core problem: Inboxes are crowded, and assistants often don't know who is responsible for replying to each email.
   - Introduce Humanity AI: The intelligent platform connecting executive assistants and their clients.
2. **Assistant Dashboard & AI Triage (0:45 - 2:00)**:
   - Highlight the 5-second glance KPI cards and the 3 AI classifications: *Assistant to Reply*, *Client to Reply*, and *No Reply Needed*.
   - Open the $18M Series A Term Sheet thread: Show the AI confidence score, the reasoning explanation, and extracted deadlines.
   - Demonstrate the 1-click Manual Override to reassign responsibility.
   - Demonstrate the AI Smart Reply Assistant: Generate a draft in an "Executive Confident" tone, edit, and send.
3. **Live Incoming Email Simulation (2:00 - 3:00)**:
   - Open the "Simulate Incoming Email" modal.
   - Select a new test email (e.g. Dylan Field rescheduling a design sync), click "Receive & Classify Live".
   - Watch the AI triage it live into *Assistant to Reply* with extracted calendar times.
4. **Minimalist Client View & Bidirectional Sync (3:00 - 4:15)**:
   - Toggle to "Client View (David Sterling)".
   - Show the clean executive interface with zero noise: only emails requiring David's direct input appear here.
   - Show the highlighted box: **"Why Your Decision is Needed"**.
   - Click "Delegate to Sarah" with a quick note, or click "Mark Handled" with instant confetti.
   - Switch back to the Assistant View to prove the real-time state synchronization!
5. **Ask AI Copilot & Calendar Extraction (4:15 - 5:00)**:
   - Open the AI Copilot drawer and click *"Show me emails that need my attention"* and *"What am I waiting on?"*.
   - Show the Meetings & Calendar extraction view.
   - Conclude with architecture highlights (MERN, robust offline fallback, responsive UI).

---

*Developed with ❤️ for the AI Full-Stack Engineer Intern evaluation.*

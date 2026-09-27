# 🏋️ Antigravity Gym PWA

A sleek, privacy-first, Apple-inspired **Progressive Web Application (PWA)** for gym workout tracking, routine scheduling, live set-by-set execution, anatomical muscle visualizers, and recovery targets.

---

## ✨ Features & Architecture Highlights

### 1. 📅 Daily Dashboard & "Today" View
- **Smart Scheduling**: Automatically displays the scheduled routine for the current day of the week, or recovery guidance if it's a designated rest day.
- **Visual Muscle Target**: High-resolution anatomical diagram displaying all primary and secondary muscle groups targeted by today's routine.
- **Daily Recovery Tracker**: Quick-toggle tracking for daily creatine intake and calorie targets.
- **1-Tap Session Launch**: Start new sessions or instantly resume in-progress workouts.

### 2. ⚡ Live Active Workout Flow (Slide-by-Slide Pipeline)
- **Focused Execution**: Step-by-step pipeline advancing through sets, rest intervals, and exercise completion.
- **Ergonomic Numeric Inputs**: Free string typing allowing easy backspacing, decimal weights, and trailing zeros without cursor jumping.
- **Form Cues & Anatomy**: Collapsible exercise instructions and real-time muscle highlighting per exercise.
- **Apple Watch-Style Circular Rest Timer**:
  - Smooth animated countdown circle with audio chimes and mobile vibration feedback.
  - **Quick Adjustments**: Instant **`-10s`** (if you started the timer late) and **`+30s`** buttons, pause/resume, and skip options.
- **Celebration Confetti**: Physics-based burst animations when completing individual exercises and entire sessions.

### 3. 🛠 Routine & Schedule Builder
- **Day-of-Week Assignment**: Assign workout routines to any combination of days (Monday–Sunday).
- **70+ Exercise Library**: Browse and search exercises by muscle group, category (Chest, Back, Shoulders, Arms, Legs, Core), and equipment (Barbell, Dumbbell, Machine, Cable, Bodyweight).
- **Configurable Parameters**: Customize target sets, reps, weight, and rest intervals per exercise.
- **Accurate State Management**: Clean isolation when creating new routines or editing existing schedules.

### 4. 📊 Performance & Analytics Dashboard
- **Weekly Rhythm KPI**: Compares workouts completed this calendar week against your scheduled weekly target.
- **Muscle Stimulus Distribution**: Visual volume distribution bar chart calculating sets logged per muscle group.
- **All-Time Metrics**: Total sessions logged, total sets completed, and average session duration.
- **Recent Activity Log**: View past workout sessions with quick delete capabilities.

### 5. 🗓 Calendar & Workout History
- **Interactive Monthly Grid**: Visual dots indicating completed workouts and scheduled training days.
- **Selected Day Inspector**: View detailed exercise breakdowns, sets completed, and session durations for any past date.

### 6. 👆 Universal Swipe-to-Delete
- **Fluid Gesture Control**: Built with Framer Motion spring physics. Slide any item to the left to reveal the red **Delete** action.
- **Safe Confirmation Dialogs**: Prevents accidental deletions with iOS-style confirmation modals.
- **Universal Application**: Works across workout history sessions, routine schedules, and exercises within routine lineups.

### 7. ⚖️ Weight Units & Customization
- **Pounds & Kilograms**: Support for **Pounds (`lbs`)** as default, with a one-tap toggle for **Kilograms (`kg`)** in Settings.
- **Light & Dark Themes**: Apple-inspired clean light mode and OLED true black dark mode.

### 8. 🔒 Local-First Privacy & Backup / Restore
- **Zero Login Required**: All data stays stored securely on your local device.
- **Direct JSON File Export**: Download timestamped `.json` backup files (`gym-backup-YYYY-MM-DD.json`) or copy directly to clipboard.
- **Safe Backup Import**: Upload backup files or paste raw JSON with overwrite safety confirmation.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Core Framework** | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool & Bundler** | [Vite 6](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) (Custom Apple design tokens) |
| **Animations & Gestures** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Anatomical Visualizer** | [react-body-highlighter](https://github.com/react-body-highlighter) |
| **PWA & Offline Support** | [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) |
| **Audio Engine** | Web Audio API (Synthesized tone generator) |

---

## 📂 Project Structure

```text
gym-session-pwd/
├── public/                  # Static assets, PWA icons, manifest
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI primitives
│   │   │   ├── ConfirmDeleteModal.tsx   # Modal confirmation dialog
│   │   │   ├── ExerciseDetailModal.tsx  # Detailed exercise viewer
│   │   │   ├── MuscleDiagram.tsx        # Anatomical muscle highlighter
│   │   │   ├── NumericInput.tsx         # Ergonomic number input
│   │   │   └── SwipeToDeleteItem.tsx    # Gesture slide-to-delete container
│   │   ├── layout/          # App layout & bottom navigation bar
│   │   │   └── AppLayout.tsx
│   │   └── routine/         # Routine creation & editing modals
│   │       └── RoutineEditorModal.tsx
│   ├── context/
│   │   └── GymContext.tsx   # Core application state & LocalStorage sync
│   ├── data/
│   │   └── exercises.ts     # 70+ exercise catalog with muscle metadata
│   ├── hooks/
│   │   └── useRestTimer.ts  # Rest timer with Web Audio API chime
│   ├── types/
│   │   └── gym.ts           # Data models & TypeScript interfaces
│   ├── utils/
│   │   ├── confetti.ts      # Canvas confetti celebration triggers
│   │   └── exportImport.ts  # Backup file generation & downloads
│   ├── views/               # Primary application screens
│   │   ├── ActiveSessionView.tsx # Live workout session & rest timer
│   │   ├── CalendarView.tsx      # Monthly training calendar & history
│   │   ├── DashboardView.tsx     # KPI metrics & muscle stimulus charts
│   │   ├── ExercisesView.tsx     # 70+ exercise search catalog
│   │   ├── SettingsView.tsx      # Preferences, units, and data management
│   │   └── TodayView.tsx         # Daily schedule & start workout view
│   ├── App.tsx              # Root application component
│   ├── index.css            # Global CSS, variables, and typography
│   └── main.tsx             # React DOM root mounting
├── index.html               # Main HTML entry point & viewport config
├── package.json             # Project dependencies & scripts
├── tailwind.config.js       # Tailwind CSS design system configuration
├── tsconfig.json            # TypeScript compiler configuration
└── vite.config.ts           # Vite configuration with PWA plugin
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` (version 9 or higher)

### 1. Installation
Clone the repository and install the project dependencies:
```bash
git clone <repository-url>
cd gym-session-pwd
npm install
```

### 2. Run Development Server
Start the local development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Production Build
Compile TypeScript and build the optimized production bundle:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

---

## 📱 Installing as a PWA (Mobile & Desktop)

1. **iOS (Safari)**:
   - Open the web app in Safari.
   - Tap the **Share** button (box with arrow pointing up).
   - Scroll down and tap **"Add to Home Screen"**.
2. **Android (Chrome)**:
   - Open the web app in Chrome.
   - Tap the three dots menu in the top right corner.
   - Tap **"Install app"** or **"Add to Home screen"**.
3. **Desktop (Chrome / Edge / Safari)**:
   - Click the **Install** icon in the address bar to install as a standalone desktop app.

---

## 💾 Data Backup & Restore

- **Exporting Data**: Go to **Settings > Data & Backup > "Export as JSON File"** to download a copy of all your schedules, routines, and workout history.
- **Restoring Data**: Go to **Settings > Data & Backup > "Import File"** or **"Paste JSON"**. A confirmation modal will appear asking you to confirm before updating your data.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

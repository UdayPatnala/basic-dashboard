# TaskMaster Pro

TaskMaster Pro is a high-fidelity, interactive, and beautifully animated task management dashboard built with React. Designed as a professional tool for organizing tasks, it offers rich animations, dynamic statistics, flexible category classification, and built-in local persistence.

---

## 🚀 Key Features

- **🔐 Dual Access Authentication**:
  - **Authenticated Mode**: Enter a validated access code to unlock private task lists synced to the browser's local storage.
  - **Guest Mode**: Explore the dashboard's features with a temporary local task list.
- **📊 Real-Time Analytics & KPIs**:
  - **Total Tasks Counter**: Tracks all active tasks matching the current filters.
  - **Completed Count**: Dynamically computes completed tasks.
  - **Dynamic Completion Gauge**: A custom circular SVG progress bar animating to display the completion percentage.
- **🏷️ Smart Categorization**:
  - Out-of-the-box categories for **Java**, **DSA**, **Web**, **Project**, and **Tools**, each with a distinct color profile and Lucide icon.
  - Support for **Custom Categories** on-the-fly.
- **🔍 Advanced Search & Filtering**:
  - Instantly search by task content or category names.
  - Interactive date selection calendar to filter scheduled tasks.
  - Automatic calculation of **Overdue Tasks** (older uncompleted tasks highlighted with a warning badge).
- **✨ Fluid Micro-Animations**:
  - Driven by `framer-motion` to provide smooth slide-ins, status transitions, and card expansions.

---

## 🛠️ Technology Stack

- **Frontend Core**: [React](https://react.dev/) (v19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [PostCSS](https://postcss.org/)
- **UI Components**: Built on top of [Radix UI Primitives](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Utility Libraries**: `date-fns` (for date formatting) and `xlsx` (for spreadsheet utilities)
- **Containerization**: Docker with Microsoft OpenJDK 21

---

## 📂 Directory Structure

```
Dashboard v1/
├── Dockerfile                  # Production container packaging (Java runtime)
├── .dockerignore               # Patterns excluded from container builds
├── package-lock.json           # Lockfile for root-level packaging
└── dashboard-app/              # Core React Application
    ├── package.json            # React project manifest and script definitions
    ├── tailwind.config.js      # Tailwind style tokens and spacing overrides
    ├── postcss.config.js       # CSS processor configuration
    └── src/
        ├── App.js              # Application core logic & dashboard state
        ├── index.js            # React entry point
        ├── index.css           # Global CSS variables and utility classes
        ├── data/
        │   └── tasks.json      # Initial seed dataset for tasks
        └── components/         # Reusable dashboard design primitives
```

---

## ⚙️ Setup and Installation

### Running the React App Locally

1. Navigate to the `dashboard-app` directory:
   ```bash
   cd dashboard-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Docker Configuration

The repository includes a `Dockerfile` at the root, which sets up a Java 21 OpenJDK runtime to package and serve the compiled assets of the application:
```dockerfile
FROM mcr.microsoft.com/openjdk/jdk:21-ubuntu
VOLUME /tmp
COPY dashboardv1.jar dashboardv1.jar
EXPOSE 3000
ENTRYPOINT ["sh", "-c", "exec java -jar dashboardv1.jar"]
```

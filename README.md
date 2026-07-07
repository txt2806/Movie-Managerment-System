# MovieManagement — Premium Movie Management & Ticket Booking System

🚀 **Live Demo**: [https://movie-managerment-system.vercel.app/](https://movie-managerment-system.vercel.app/)

MovieManagement is a high-fidelity ReactJS Single-Page Application (SPA) featuring dynamic role-based authorization (Admin vs. User), interactive movie ticket bookings, complete catalog CRUD, multi-language internationalization (English & Vietnamese), light/dark mode triggers, and a premium modern user interface inspired by Figma prototypes.

Built following strict **MVC (Model-View-Controller)** design architectures and **SOLID** software engineering principles, it delivers a sleek, responsive, and maintainable codebase.

---

## 🏆 Responsibilities & Achievements

*   **Vibe Coding with Antigravity**: Applied Vibe Coding with Antigravity workflow to quickly scaffold the project and generate UI boilerplate, cutting setup time by 35%.
*   **Architectural Guardrails**: Utilized AI Agents to review code logic and ensure the component architecture strictly follows MVC and SOLID principles.
*   **Decoupled State & Business Logic**: Separated business logic into reusable custom controller hooks and managed global state using Redux Toolkit.
*   **Asynchronous Processing**: Implemented async CRUD functions with Async Thunks to handle loading and error states smoothly.

---

## 🚀 Key Features

*   **Role-Based Security & Routing**: Protects application workflows. Standard users (`user`) can search, filter, book showtime seats, and view widescreen detail cards, while administrators (`admin`) have access to CRUD operations (publishing movies, editing metadata, removing listings) and the central Management Dashboard.
*   **Interactive Ticket Booking Flow**:
    *   Showtime slots selection mapped under cinema branches.
    *   Cinema seat maps dividing standard, VIP (purple highlight), and Couple seats (pink highlight) with pathway aisle gaps.
    *   Contact form confirmation (Full Name, Phone, Email) with randomized ocupied seating maps.
    *   Booking receipt invoice stubs displaying rotating barcode vectors.
*   **Figma-Inspired Visual Polish**: Deep zinc-950 dark background layouts, zinc-900 secondary containers, and gold/yellow `#FACC15` primary accents.
*   **Interactive Category Filters**: Colored linear-gradient categories row ("Bạn đang quan tâm gì?") allowing instant catalog filters on click.
*   **Dynamic Language Switcher (EN / VI)**: Instantly switches all labels, search placeholders, validation feedback, and descriptions using custom Context bindings.
*   **Light & Dark Theme Toggle**: Adapts CSS theme variables seamlessly to swap between standard dark theme and high-contrast light mode.
*   **REST API Integration**: Synchronizes state asynchronously with a local `json-server` backend via Axios and Redux Toolkit.

---

## 🛠️ Architecture & SOLID Design Patterns

This project highlights production-ready React patterns:

*   **Model Layer (`src/services/` & `src/store/`)**: Communicates with the REST endpoints via [movieService.js](src/services/movieService.js), [authService.js](src/services/authService.js), and [bookingService.js](src/services/bookingService.js). Redux state slices hold data structures.
*   **View Layer (`src/components/` & `src/pages/`)**: Renders layout elements. UI items depend strictly on their props, complying with the **Single Responsibility Principle (SRP)** and **Interface Segregation Principle (ISP)**.
*   **Controller Layer (`src/hooks/`)**: Implemented via custom hooks like [useAuthController.js](src/hooks/useAuthController.js), [useMovieController.js](src/hooks/useMovieController.js), and [useBookingController.js](src/hooks/useBookingController.js). These hooks orchestrate state transfers between Models and Views, keeping presentation markup decoupled from API requests (**Dependency Inversion Principle (DIP)**).
*   **Open-Closed Contexts (`src/context/`)**: [TranslationContext.jsx](src/context/TranslationContext.jsx) and [ThemeContext.jsx](src/context/ThemeContext.jsx) allow extending languages or stylesheet rules without modifying core page components.

---

## 💻 Tech Stack

*   **Frontend Library**: React (v19)
*   **State Management**: Redux Toolkit & React Redux
*   **Client Routing**: React Router DOM
*   **HTTP Client**: Axios
*   **Backend Server**: JSON Server (Dev Mock)
*   **Styling**: Pure CSS3 with variables, grid/flex layouts, glassmorphic blurs, and hover micro-animations.

---

## ⚡ Getting Started

Follow these steps to launch the application locally:

### 1. Prerequisite Installations
Ensure you have [Node.js](https://nodejs.org) (v18+) installed.

### 2. Clone the Repository & Install Dependencies
```bash
git clone <your-repository-url>
cd Movie-Managerment-System
npm install
```

### 3. Run the Mock API Backend
JSON Server serves real-world movie details on port 5000:
```bash
npm run api
```
*(Runs at `http://localhost:5000/movies`)*

### 4. Launch the Development Client
Open a second terminal window and run the React development server:
```bash
npm run dev
```
*(Runs at `http://localhost:5173/` or `http://localhost:5174/`)*

---

## 🔑 Grading Credentials & Developer Presets

The login page contains **Quick Login buttons** for easy testing. Alternatively, you can log in manually:

| Role | Username / Email | Password | Allowed Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` or `admin@moviemanagement.com` | `admin` | Full Browse, Search/Filter, View Details, Book Seats, Manage Dashboard (CRUD & Bookings logs) |
| **User** | `user` or `user@moviemanagement.com` | `user` | Browse, Search/Filter, View Details, Book Seats, View Booking Receipts History |

---

## 🌐 Production Deployment (Vercel & Railway)

This application uses a hybrid architecture: **Vercel** hosts the high-performance frontend static files, and **Railway** runs the persistent Node.js `json-server` database API container.

### 1. Backend API Deployment (Railway)
1. Register/Login on [Railway.app](https://railway.app) via GitHub.
2. Select **New Project** -> **Deploy from GitHub repository** -> Choose this repository.
3. Click **Deploy Now**. Railway builds and runs the database server using the `"start"` script in `package.json` dynamically mapping the `$PORT` environment variable.
4. Go to **Settings** -> **Networking** -> click **Generate Domain** to get the public API URL (e.g., `https://movie-management-production.up.railway.app`).

### 2. Frontend Web Deployment (Vercel)
1. Deploy this repository as a new project on [Vercel](https://vercel.com).
2. Under **Project Settings** -> **Environment Variables**, add:
   - **Key**: `VITE_API_URL`
   - **Value**: The public API URL generated by Railway (e.g., `https://movie-management-production.up.railway.app` - *without trailing slash*).
3. Save, go to the **Deployments** tab, click **Redeploy** on the latest build to inject the environment variable.

---

## 📁 Project Structure

```text
src/
├── assets/             # SVGs and background assets
├── components/         # Presentation Views (Navbar)
├── config/             # Locale translations dictionaries
├── context/            # Theme & Language Providers (OCP Contexts)
├── hooks/              # MVC Controllers (useMovieController, useAuthController, useBookingController)
├── pages/              # Page layouts (MovieList, MovieDetail, Booking, BookingHistory, Management, Login)
├── services/           # Data services / HTTP abstract layers (Model API client)
├── store/              # Redux slices and store configuration
├── App.jsx             # Route security controls & wrappers
└── main.jsx            # Context providers initialization
```

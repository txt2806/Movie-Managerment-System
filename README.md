# CineSphere — Premium Netflix-Style Movie Management System

CineSphere is a high-fidelity ReactJS Single-Page Application (SPA) featuring dynamic role-based authorization (Admin vs. User), full CRUD operations, multi-language internationalization (English & Vietnamese), light/dark mode triggers, and a premium Netflix-inspired user interface.

Built following strict **MVC (Model-View-Controller)** design architectures and **SOLID** software engineering principles, it delivers a sleek, responsive, and maintainable codebase.

---

## 🚀 Key Features

*   **Role-Based Security & Routing**: Protects application workflows. Standard users (`user`) can search, filter, and view widescreen detail cards, while administrators (`admin`) have access to CRUD operations (publishing movies, editing metadata, and removing listings).
*   **Netflix Cinematic UI/UX**: Includes a dark radial background vignette, widescreen featured banners with play controls, and horizontal-scrolling category rows.
*   **Interactive Hover Reveals**: Hovering over a movie card poster dimensions scales the card (1.08x), blurs the image, and slides up a detailed glass card revealing plots, ratings, and licensing values.
*   **Dynamic Language Switcher (EN / VI)**: Instantly switches all labels, search placeholders, validation feedback, and descriptions between English and Vietnamese using custom Context bindings.
*   **Light & Dark Theme Toggle**: Adapts CSS theme variables seamlessly to swap between standard cinema dark theme and high-contrast light mode.
*   **Robust Client-Side Form Validation**: Evaluates additions/edits locally, outlining issues and displaying localized error labels.
*   **REST API Integration**: Synchronizes state asynchronously with a local `json-server` backend via Axios and Redux Toolkit.

---

## 🛠️ Architecture & SOLID Design Patterns

This project highlights master-level React patterns:

*   **Model Layer (`src/services/` & `src/store/`)**: Communicates with the REST endpoints via [movieService.js](src/services/movieService.js) and [authService.js](src/services/authService.js). Redux state slices hold data structures.
*   **View Layer (`src/components/` & `src/pages/`)**: Renders layout elements. UI items depend strictly on their props, complying with the **Single Responsibility Principle (SRP)** and **Interface Segregation Principle (ISP)**.
*   **Controller Layer (`src/hooks/`)**: Implemented via custom hooks like [useAuthController.js](src/hooks/useAuthController.js) and [useMovieController.js](src/hooks/useMovieController.js). These hooks orchestrate state transfers between Models and Views, keeping presentation markup decoupled from API requests (**Dependency Inversion Principle (DIP)**).
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
*(Runs at `http://localhost:5173/`)*

---

## 🔑 Grading Credentials & Developer Presets

The login page contains **Quick Login buttons** for easy testing. Alternatively, you can log in manually:

| Role | Username / Email | Password | Allowed Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` or `admin@cinesphere.com` | `admin` | Full Browse, Search/Filter, View Details, Add, Edit, Delete |
| **User** | `user` or `user@cinesphere.com` | `user` | Browse, Search/Filter, View Details (CRUD options are hidden & blocked) |

---

## 📁 Project Structure

```text
src/
├── assets/             # SVGs and background assets
├── components/         # Presentation Views (Navbar)
├── config/             # Locale translations dictionaries
├── context/            # Theme & Language Providers (OCP Contexts)
├── hooks/              # MVC Controllers (useMovieController, useAuthController)
├── pages/              # Page layouts (MovieList, MovieDetail, MovieForm, Login)
├── services/           # Data services / HTTP abstract layers (Model API client)
├── store/              # Redux slices and store configuration
├── App.jsx             # Route security controls & wrappers
└── main.jsx            # Context providers initialization
```

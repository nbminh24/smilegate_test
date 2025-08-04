# Smilegate Vietnam - Game Management System

A modern, full-featured web application for managing a game database. This project was developed as part of the Frontend Engineer Intern Entry Test for Smilegate Vietnam. It demonstrates proficiency in building responsive, feature-rich applications using a modern Vue.js stack, including Nuxt 3, TypeScript, and UnoCSS.

The application provides a clean and intuitive interface for performing full CRUD (Create, Read, Update, Delete) operations on game entries, complete with multilingual support, advanced filtering, and real-time validation.

## 🚀 Key Features

- **Full CRUD Functionality**: Seamlessly create, view, edit, and delete game entries.
- **Advanced Game List**: A robust data table displays all games with features like:
    - **Dynamic Search**: Instantly search for games by ID or name.
    - **Category Filtering**: Filter games by genre (e.g., RPG, Action, Sci-Fi).
    - **Pagination**: Efficiently navigate through large datasets.
    - **Bulk Deletion**: Select and delete multiple games at once.
- **Multilingual Support**: Add and manage game names in multiple languages (EN, KR, JP), with one designated as the default.
- **Responsive UI**: The interface is built with PrimeVue and styled with UnoCSS, ensuring a great experience on all screen sizes.
- **Form Validation**: Client-side validation powered by `yup` provides instant feedback to users, preventing incorrect data submission.
- **Modern Styling**: A custom, modern design language implemented with UnoCSS shortcuts, featuring consistent button styles, hover effects, and a clean layout.

## 🛠️ Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [PrimeVue](https://primevue.org/)
- **Styling**: [UnoCSS](https://unocss.dev/) (with custom shortcuts)
- **Validation**: [Yup](https://github.com/jquense/yup)
- **Linting**: [ESLint](https://eslint.org/)
- **Package Manager**: [Bun](https://bun.sh/)
- **Server**: Nuxt Nitro server with a file-based JSON database.

## 🌱 Development Journey & Key Improvements

This project evolved through several stages of development, focusing on both functionality and code quality:

1.  **Initial Setup**: Scaffolding the Nuxt 3 project, integrating PrimeVue for UI components, and setting up UnoCSS for a utility-first styling approach.
2.  **Core Feature Implementation**: Building the main pages for listing and creating games, and setting up the server API for CRUD operations.
3.  **UI/UX Refinement**: 
    - Modernized all button styles (`btn-primary`, `btn-secondary`) with rounded corners, shadows, and scaling hover effects for a more dynamic feel.
    - Improved layout and spacing on the game list and registration pages for better readability and user experience.
    - Removed unnecessary borders on UI elements (like language selection buttons) for a cleaner, more modern aesthetic.
4.  **Bug Squashing & Logic Correction**:
    - **Filtering Logic**: Fixed a critical bug where the category filter failed due to a value mismatch (`Sci_Fi` vs. `Sci-Fi`).
    - **Pagination**: Resolved an issue where the view would not update correctly by implementing a `watchEffect` to reset the page to 1 whenever search or filter criteria changed.
5.  **Code Quality & Linting**: 
    - **ESLint Overhaul**: Systematically resolved all ESLint parsing errors and warnings across the entire project.
    - **Configuration Fixes**: Updated `tsconfig.json` and `.eslintrc.cjs` to correctly parse `.vue` files in nested directories.
    - **Code Cleanup**: Addressed minor issues like trailing spaces and unused variables to achieve a perfectly clean linting state.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or newer)
- [Bun](https://bun.sh/) (v1.0 or newer)

### Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2.  **Install dependencies**:
    ```bash
    bun install
    ```

3.  **Run the development server**:
    The application will be available at `http://localhost:3000`.
    ```bash
    bun run dev
    ```

### Building for Production

1.  **Generate the production build**:
    ```bash
    bun run build
    ```

2.  **Preview the production build**:
    ```bash
    bun run preview
    ```

The application will be built into the `.output` directory, ready for deployment on any static hosting provider.

## ✅ Code Quality & Linting

This project uses ESLint, configured with `@nuxt/eslint-config`, to enforce a consistent and high-quality coding style. 

To run the linter, use the following command:
```bash
bun run lint
```

All linting issues, including parsing errors and rule violations, have been resolved to ensure a clean and maintainable codebase.

## 📁 Project Structure

```
.eta/
├── assets/                 # Static assets like CSS
├── components/             # Reusable Vue components (e.g., AppHeader)
├── pages/                  # Application pages and routes
│   ├── index.vue           # Main page (Game List)
│   └── register/           # Game registration routes
│       └── new.vue         # Form to create a new game
├── server/                 # Server-side logic (Nitro)
│   ├── api/                # API endpoints for CRUD operations
│   └── data/               # Contains the games.json database file
├── plugins/                # Nuxt plugins (e.g., PrimeVue setup)
├── uno.config.ts           # UnoCSS configuration file
├── nuxt.config.ts          # Nuxt 3 configuration file
├── tsconfig.json           # TypeScript configuration
└── .eslintrc.cjs           # ESLint configuration
```

## 📄 License

This project was created for the Smilegate Vietnam Frontend Engineer Intern Entry Test.
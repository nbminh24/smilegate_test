# Smilegate Vietnam - Game Management System

A modern web application for managing game information with multilingual support, built with Nuxt 3, UnoCSS, and PrimeVue 4.

## 🚀 Features

- **Game List Management**: View, search, filter, and paginate games
- **Multi-language Support**: Support for English (EN), Korean (KO), and Japanese (JA)
- **CRUD Operations**: Create, read, update, and delete games
- **Bulk Operations**: Multi-select and bulk delete functionality
- **Responsive Design**: Modern UI with PrimeVue components
- **Real-time Validation**: Form validation with user feedback

## 🛠️ Tech Stack

- **Framework**: Nuxt 3
- **Styling**: UnoCSS
- **UI Components**: PrimeVue 4
- **Package Manager**: Bun
- **Database**: JSON file storage
- **Language**: TypeScript

## 📋 Requirements

- Node.js 18+ or Bun 1.0+
- Modern web browser

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   bun install
   ```

2. **Start development server**:
   ```bash
   bun run dev
   ```

3. **Build for production**:
   ```bash
   bun run build
   ```

4. **Preview production build**:
   ```bash
   bun run preview
   ```

## 📁 Project Structure

```
├── assets/
│   └── css/
│       └── main.css          # Global styles
├── components/
│   └── AppHeader.vue         # Reusable header component
├── pages/
│   ├── index.vue             # Game List page
│   └── register/
│       ├── index.vue         # Redirect to new game
│       ├── new.vue           # New game registration
│       └── [id].vue          # Edit existing game
├── server/
│   ├── api/                  # API endpoints
│   │   └── games/
│   │       ├── get.ts        # GET /api/games
│   │       ├── post.ts       # POST /api/games
│   │       ├── delete.post.ts # POST /api/games/delete
│   │       └── [id]/
│   │           ├── get.ts    # GET /api/games/[id]
│   │           └── put.ts    # PUT /api/games/[id]
│   ├── data/
│   │   └── games.json        # JSON database
│   └── utils/
│       └── database.ts       # Database utilities
├── plugins/
│   └── primevue.client.ts    # PrimeVue configuration
├── uno.config.ts             # UnoCSS configuration
├── nuxt.config.ts            # Nuxt configuration
└── package.json
```

## 🎯 API Endpoints

### Games
- `GET /api/games` - Get all games with filtering and pagination
- `POST /api/games` - Create a new game
- `GET /api/games/[id]` - Get a specific game
- `PUT /api/games/[id]` - Update a specific game
- `POST /api/games/delete` - Bulk delete games

### Query Parameters
- `category` - Filter by game category
- `keyword` - Search in game ID and names
- `page` - Page number for pagination
- `limit` - Items per page

## 🎨 UI Features

### Game List Page
- Search and filter functionality
- Data table with sorting
- Multi-select for bulk operations
- Pagination controls
- Responsive design

### Game Registration Page
- Multi-language form support
- Dynamic language management
- Real-time validation
- Default language selection
- Modal dialogs for adding languages

## 🔧 Configuration

### UnoCSS
Custom theme with Smilegate brand colors and utility shortcuts.

### PrimeVue
Configured with Lara Light Blue theme and essential components.

### ESLint
Extended Nuxt ESLint configuration with custom rules.

## 📝 Data Structure

```typescript
interface Game {
  id: string
  category: string
  name: GameName[]
}

interface GameName {
  language: string
  value: string
  isDefault: boolean
}
```

## 🚀 Deployment

The application can be deployed to any static hosting service:

1. Build the application:
   ```bash
   bun run build
   ```

2. Deploy the `.output` directory to your hosting service.

## 📄 License

This project is created for Smilegate Vietnam Frontend Engineer Intern Entry Test.

## 👨‍💻 Author

Created for Smilegate Vietnam Frontend Engineer Intern Entry Test Assignment. 
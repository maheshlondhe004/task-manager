# Task Manager Application

A full-stack task management application with user authentication, role-based access control, and system health monitoring.

## Features

- User Authentication & Authorization
- Role-based Access Control (Admin/User roles)
- Task Management (Create, Read, Update, Delete)
- System Health Monitoring Dashboard
- Persistent Sessions with Refresh Tokens
- Responsive UI Design

## Tech Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Chakra UI** - Component library for styled components
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool and development server
- **Recharts** - Charting library for analytics
- **date-fns** - Date utility library

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type-safe JavaScript
- **TypeORM** - Object-Relational Mapping
- **MySQL** - Database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **cookie-parser** - Cookie handling middleware
- **cors** - Cross-Origin Resource Sharing

### DevOps & Tools
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Git** - Version control
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Architecture & Patterns

- **Model-View-Controller (MVC)** - Backend architecture
- **Repository Pattern** - Data access layer
- **Context API** - State management
- **Custom Hooks** - Reusable logic
- **JWT with Refresh Tokens** - Authentication strategy
- **REST API** - Communication between frontend and backend
- **Dependency Injection** - Service pattern
- **Middleware Pattern** - Request processing
- **Error Handling Middleware** - Centralized error handling

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)
- Git

### Running the Application

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd task-manager
   ```

2. Start the application using Docker Compose:
   ```bash
   docker-compose up --build
   ```

   This will start:
   - Frontend at http://localhost:5173
   - Backend at http://localhost:3000
   - MySQL database at localhost:3306

### Development Setup

1. Install frontend dependencies:
   ```bash
   cd task-manager
   npm install
   ```

2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

3. Start the development servers:
   ```bash
   # Frontend (in task-manager directory)
   npm run dev

   # Backend (in server directory)
   npm run dev
   ```

## Project Structure

```
task-manager/
├── src/                    # Frontend source code
│   ├── components/        # React components
│   ├── contexts/         # React contexts
│   ├── services/         # API services
│   └── types/           # TypeScript type definitions
├── server/               # Backend source code
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── modules/     # Feature modules
│   │   ├── middleware/  # Express middleware
│   │   └── types/      # TypeScript type definitions
│   └── package.json
├── docker-compose.yml    # Docker composition
├── Dockerfile.frontend   # Frontend Docker configuration
└── package.json         # Frontend dependencies
```

## API Documentation

### Authentication Endpoints
- POST `/api/users/register` - User registration
- POST `/api/users/login` - User login
- POST `/api/users/refresh-token` - Refresh access token
- POST `/api/users/logout` - User logout

### Task Endpoints
- GET `/api/tasks` - List tasks
- POST `/api/tasks` - Create task
- PUT `/api/tasks/:id` - Update task
- DELETE `/api/tasks/:id` - Delete task

### Admin Endpoints
- GET `/api/users` - List users (Admin only)
- GET `/api/health` - System health dashboard (Admin only)

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Create a pull request with a description of your changes

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

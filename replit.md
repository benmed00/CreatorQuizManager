# QuizGenius - AI-Powered Quiz Generator

## Overview

QuizGenius is a comprehensive AI-powered quiz generation platform built with React, Express.js, and PostgreSQL. The application allows users to create, manage, and take quizzes with AI assistance, featuring real-time analytics, user authentication, and multi-language support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui components for consistent UI
- **State Management**: Zustand for global state management
- **Routing**: Wouter for client-side routing
- **Animations**: Framer Motion for smooth transitions and interactions
- **Internationalization**: react-i18next for multi-language support (English, French, Spanish, Chinese, Arabic) with RTL support

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety
- **API Design**: RESTful API with JSON responses
- **Session Management**: Express sessions with PostgreSQL session store
- **Email Service**: SendGrid integration with mock fallback

### Database Architecture
- **Primary Database**: PostgreSQL with connection pooling
- **ORM**: Drizzle ORM for type-safe database operations
- **Connection**: Neon serverless PostgreSQL with WebSocket support
- **Migrations**: Drizzle Kit for schema management

## Key Components

### Authentication System
- **Primary**: Firebase Authentication with email/password and Google OAuth
- **Mock Implementation**: Fallback authentication for development without Firebase credentials
- **User Management**: Custom user transformation layer to bridge Firebase users with app-specific user models
- **Session Persistence**: localStorage for client-side persistence

### Quiz Management
- **Creation Methods**: 
  - Manual quiz creation with question editor
  - AI-assisted generation using OpenAI GPT-4
  - Template-based creation with predefined categories
- **Question Types**: Multiple choice with optional code snippets
- **Categories**: Hierarchical categorization system
- **Tags**: Flexible tagging system for enhanced organization

### AI Integration
- **Provider**: OpenAI GPT-4 for intelligent quiz generation
- **Mock Mode**: Comprehensive mock responses for development without API keys
- **Features**: Topic-based generation, difficulty adjustment, code snippet inclusion

### User Interface
- **Design System**: shadcn/ui components with Tailwind CSS
- **Theme Support**: Light/dark mode toggle
- **Responsive**: Mobile-first design approach
- **Accessibility**: ARIA compliance and keyboard navigation

## Data Flow

### Quiz Creation Flow
1. User selects creation method (manual/AI/template)
2. Form data validation and processing
3. AI service generates questions (if AI mode)
4. Questions stored in PostgreSQL database
5. Quiz metadata created with associations
6. Real-time updates to user dashboard

### Quiz Taking Flow
1. User navigates to quiz from dashboard or public link
2. Quiz questions loaded from database
3. Timer management and answer tracking
4. Real-time progress updates
5. Results calculation and storage
6. Achievement system evaluation

### Authentication Flow
1. User authentication through Firebase
2. User object transformation for app compatibility
3. Session creation and persistence
4. Protected route access management

## External Dependencies

### Required Services
- **PostgreSQL Database**: Primary data storage
- **Firebase**: Authentication provider
- **OpenAI API**: AI quiz generation
- **SendGrid**: Email notifications

### Optional Services (Mock Fallbacks Available)
- Firebase (uses mock authentication)
- OpenAI (uses predefined mock quizzes)
- SendGrid (console logging for emails)

### Development Tools
- **Testing**: Cypress for E2E and component testing
- **Linting**: ESLint with TypeScript support
- **Type Checking**: TypeScript strict mode
- **Hot Reload**: Vite HMR for development

## Deployment Strategy

### Development
- **Local Development**: Vite dev server with Express backend
- **Database**: Local PostgreSQL or development cloud instance
- **Mock Services**: Automatic fallback for missing API keys

### Production
- **Build Process**: Vite production build with static asset optimization
- **Server**: Express.js with production optimizations
- **Database**: Production PostgreSQL with connection pooling
- **Environment Variables**: Secure configuration management

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string (required)
- `VITE_FIREBASE_API_KEY`: Firebase configuration (optional)
- `VITE_FIREBASE_PROJECT_ID`: Firebase project ID (optional)
- `VITE_FIREBASE_APP_ID`: Firebase app ID (optional)
- `OPENAI_API_KEY`: OpenAI API access (optional)
- `SENDGRID_API_KEY`: Email service access (optional)

### Scaling Considerations
- Database connection pooling for concurrent users
- Stateless server design for horizontal scaling
- CDN-ready static asset handling
- Session store configuration for distributed deployments

The application is designed with a "mock-first" approach, allowing full functionality in development environments without requiring external service credentials, while seamlessly transitioning to production services when credentials are provided.
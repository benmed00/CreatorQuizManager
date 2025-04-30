# AI-Powered Quiz Generator

An AI-powered quiz generator application built with React, Express, and PostgreSQL, featuring automated quiz creation, user authentication, and analytics functionality.

## Features

- **User Authentication**: Secure user registration and login using Firebase
- **AI-Powered Quiz Generation**: Automatically create quizzes based on topics using OpenAI
- **Quiz Management**: Create, edit, and delete quizzes
- **Quiz Taking**: Interactive quiz-taking experience with timer
- **Analytics**: Track quiz results and user performance
- **Persistent Storage**: PostgreSQL database for reliable data storage
- **Responsive Design**: Modern UI that works on desktop and mobile
- **Dark Mode Support**: Light and dark theme options

## Technology Stack

- **Frontend**: React with Tailwind CSS and shadcn UI components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Firebase Auth (with mock implementation for testing)
- **AI Integration**: OpenAI GPT (with mock implementation for testing)
- **State Management**: Zustand for global state
- **Styling**: Tailwind CSS for utility-first styling

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- PostgreSQL database
- Firebase project (optional)
- OpenAI API key (optional)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `VITE_FIREBASE_API_KEY`: Firebase API Key (optional)
   - `VITE_FIREBASE_PROJECT_ID`: Firebase Project ID (optional)
   - `VITE_FIREBASE_APP_ID`: Firebase App ID (optional)
   - `OPENAI_API_KEY`: OpenAI API Key (optional)

4. Initialize the database:
   ```
   npm run db:push
   ```
5. Start the development server:
   ```
   npm run dev
   ```

## Project Structure

```
/
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions and constants
│   │   ├── pages/        # Page components
│   │   ├── store/        # Zustand state management
│   │   ├── App.tsx       # Main application component
│   │   └── main.tsx      # Entry point
├── server/               # Backend Express server
│   ├── db.ts             # Database connection
│   ├── index.ts          # Server entry point
│   ├── openai.ts         # OpenAI integration
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Storage implementation
│   └── vite.ts           # Vite server configuration
├── shared/               # Shared code between client and server
│   └── schema.ts         # Database schema and types
└── drizzle.config.ts     # Drizzle ORM configuration
```

## Database Schema

The application uses a PostgreSQL database with the following tables:

- **users**: Store user information
- **quizzes**: Store quiz metadata
- **questions**: Store questions for each quiz
- **options**: Store answer options for each question
- **quiz_results**: Store user results for completed quizzes

The schema includes proper relations between tables for efficient querying.

## Authentication

The application includes two authentication options:

1. **Mock Authentication**: For testing and development
   - Default credentials: Email: `test@example.com`, Password: `password123`

2. **Firebase Authentication**: For production use
   - Requires Firebase configuration through environment variables

## API Integration

Two external API integrations are supported:

1. **OpenAI Integration**: For AI-powered quiz generation
   - Mock implementation available for testing
   - Full integration available with OpenAI API key

## Deploying to Production

For deploying to production:

1. Set all required environment variables
2. Build the project:
   ```
   npm run build
   ```
3. Start the production server:
   ```
   npm start
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [OpenAI](https://openai.com/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Drizzle ORM](https://orm.drizzle.team/)